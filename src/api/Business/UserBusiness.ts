import User from "../../database/models/User";
import { UserDTO } from "../RequestBodies/UserDTO";
import Address from "../../database/models/Address";
import Sex from "../../database/models/Sex";
import { AddressBusiness } from "./AddressBusiness";
import { CustomError } from "../../api/Tools/ErrorHandler";
import bcryptjs from "bcryptjs";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import { Op } from "sequelize";
import Dog from "../../database/models/Dog";

export class UserBusiness {
    private addressBusiness: AddressBusiness

    public constructor () {
        this.addressBusiness = new AddressBusiness();
    }

    /**
     * Checks if user exists by the given email, if not, creates it.
     * @param userDto 
     * @returns Promise<User>
     * @throws CustomError
     */
    public async createUser(userDto: UserDTO): Promise<{id: number, token: string}>
    {
        // Creates address first
        const address: Address = await this.addressBusiness.createAddress(userDto.address);

        const hPassword: string = await bcryptjs.hash(userDto.password, 10);
        const existingUser = await User.findOne({
            where: {email: userDto.email}
        });
        if (existingUser) {
            throw new CustomError("This email is already used");
        }
        const notifyFriends = userDto.notifyFriends ? userDto.notifyFriends : true;
        const pseudo = userDto.pseudo.charAt(0) !== '@' ? '@'+userDto.pseudo : userDto.pseudo;

        let newUser: User = new User({
            pseudo:         pseudo,
            email:          userDto.email,
            password:       hPassword,
            firstName:      userDto.firstName,
            lastName:       userDto.lastName,
            birthdate:      userDto.birthdate,
            notifyFriends:  notifyFriends,
            idSex:          userDto.sex.id,
            idAddress:      address.id
        });
        await newUser.save();
        const token: string = TokenHandler.create(newUser.id);
        
        return {id: newUser.id, token: token};
    }

    /**
     * Get every user in the database
     * @returns List of users
     */
    public async getAllUsers()
    {
        const users = await User.findAndCountAll({
            attributes: {
                exclude: ['notifyFriends', 'email', 'birthdate']
            }
        });
        return users;
    }

    /**
     * Return user by its id
     * @param id User id
     * @returns Promise<User>
     */
    public async getUserById(id: number)
    {
        let user: User|null = await User.findByPk(id, {
            attributes: {
                exclude: ['notifyFriends', 'email', 'birthdate', 'id']
            }
        });
        if (!user) {
            throw new CustomError('No user found', 404);
        }
        return user;
    }

    public async getUserPersonalInfos(id: number)
    {
        const user: User = await User.findByPk(id, {include: {all:true}});
        return user;
    }

    /**
     * @todo Faire une classe static avec un attribut et une fonction qui va juste servir à check le token et mettre les infos de celui-ci dans la variable.
     * On pourra ensuite récup ces infos de partout dans le code si besoin.
     * @throws CustomError
     */
    public async modifyUser(userDto: UserDTO): Promise<User> {
        let user: User = await User.findByPk(
            userDto.id,
            {
                attributes: {
                    include: ["password"]
                },
                include: {model: Address, as:'address'}
            }
        );
        if (!user) {
            throw new CustomError('Access forbidden');
        }

        const emailUser: User|null = await User.findOne({where: {email: userDto.email}});
        if (emailUser && emailUser.id != userDto.id) {
            throw new CustomError("This email is already used")
        }
        
        const match: boolean = await bcryptjs.compare(userDto.password, user.password)
        if (!match) {
            const hPassword: string = await bcryptjs.hash(userDto.password, 10);
            user.password = hPassword;
        }
        user.email = userDto.email;
        user.pseudo = userDto.pseudo;
        user.firstName = userDto.firstName;
        user.lastName = userDto.lastName;
        user.birthdate = userDto.birthdate;
        user.notifyFriends = userDto.notifyFriends;
        user.idSex = userDto.sex.id;
        await this.addressBusiness.modifyUserAddress(user.address, userDto.address);

        await user.save();
        return user;
    }

    /**
     * Check the user id in token and the id given, if they match, delete the user
     * @param id User id
     * @throws CustomError
     */
    public async deleteUser(id: number)
    {
        if (TokenHandler.tokenUserId !== id) {
            throw new CustomError("Can't delete a user you are not", 403);
        }

        const user: User = await User.findByPk(id, {include: {model: Dog, as: "dogs"}});
        if (user) {
            await Dog.destroy({
                where: {
                    idUser: id
                }
            });
            await user.destroy();
            await Address.destroy({
                where: {
                    id: user.address.id
                }
            });
            return;
        } else {
            throw new CustomError("User not found", 404);
        }
    }

    /**
     * Log the user
     * @param userDto Request body
     * @returns Promise<string>
     * @throws CustomError
     */
    public async login(userDto: UserDTO)
    {
        const user = await User.findOne({
            where: {
                email: userDto.email
            },
            attributes: ["password", "id"]
        });
        if (!user) {
            throw new CustomError('Could not authenticate you, wrong combination of email/password', 403);
        }
        const match = await bcryptjs.compare(userDto.password, user.password);
        if (match) {
            const token: string = TokenHandler.create(user.id);
            
            return {id: user.id, token: token};
        }
        throw new CustomError('Could not authenticate you, wrong combination of email/password', 403);
    }

    public async searchUserByPseudo(query: string)
    {
        if (query.length <= 1) {
            throw new CustomError("Query must be of at least 2 caracters in order to search");
        }
        const users: { rows: User[]; count: number; } = await User.findAndCountAll({
            where: {
                pseudo: {
                    [Op.like]: `${query}%`
                }
            },
            limit: 10
        });
        return users;
    }
}