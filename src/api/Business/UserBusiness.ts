import User from "../../database/models/User";
import { UserDTO } from "../RequestBodies/UserDTO";
import Address from "../../database/models/Address";
import Sex from "../../database/models/Sex";
import { AddressBusiness } from "./AddressBusiness";
import { CustomError } from "../../api/Tools/ErrorHandler";
import { create, handle } from "../../api/Tools/TokenHandler";
import bcryptjs from "bcryptjs";

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
    public async createUser(userDto: UserDTO): Promise<User>
    {
        // Creates address first
        const address: Address = await this.addressBusiness.createAddress(userDto.address);

        const hPassword: string = await bcryptjs.hash(userDto.password, 10);
        const newUser = User.findOrCreate({
            where: {email: userDto.email},
            defaults: {
                email: userDto.email,
                password: hPassword,
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                birthdate: userDto.birthdate,
                notifyFriends: userDto.notifyFriends,
                idSex: userDto.sex.id,
                idAddress: address.id
            },
            include: [Address, Sex]
        }).then(([user, created]) => {
            if (!created) {
                throw new CustomError("This email is already linked to an account");
            }
            return user;
        });
        return newUser;
    }

    /**
     * Get every user in the database
     * @returns List of users
     */
    public async getAllUsers()
    {
        const users = await User.findAndCountAll().then();
        return users;
    }

    /**
     * Return user by its id
     * @param id User id
     * @returns Promise<User>
     */
    public async getUserById(id: number)
    {
        let user: User|null = await User.findByPk(id).then();
        return user;
    }

    /**
     * @todo Faire une classe static avec un attribut et une fonction qui va juste servir à check le token et mettre les infos de celui-ci dans la variable.
     * On pourra ensuite récup ces infos de partout dans le code si besoin.
     * @throws CustomError
     */
    public async modifyUser(userDto: UserDTO): Promise<User> {
        /** @todo En dûr pour l'instant, récupéré du token par la suite */
        // let id: number = 1;
        // if (id != userDto.id) {
        //     throw new Error('Access forbidden');
        // }
        
        let user: User = await User.findByPk(
            userDto.id,
            {
                attributes: {
                    include: ["password"]
                }
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
        user.firstName = userDto.firstName;
        user.lastName = userDto.lastName;
        user.birthdate = userDto.birthdate;
        user.notifyFriends = userDto.notifyFriends;
        user.idSex = userDto.sex.id;
        this.addressBusiness.modifyUserAddress(user.address, userDto.address).then();

        await user.save();
        return user;
    }

    /**
     * 
     * @param id User id
     * @throws CustomError()
     */
    public async deleteUser(id: number)
    {
        /** @todo Check dans le token que c'est le bon utilisateur */
        await User.findByPk(id).then((user: User) => {
            if (user) {
                return user.destroy();
            } else {
                throw new CustomError("User not found");
            }
        });
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
            attributes: ["password"]
        });
        if (!user) {
            throw new CustomError('Could not authenticate you, wrong combination of email/password', 403);
        }
        const match = await bcryptjs.compare(userDto.password, user.password);
        if (match) {
            return create(user.id);
        }
        throw new CustomError('Could not authenticate you, wrong combination of email/password', 403);
    }
}