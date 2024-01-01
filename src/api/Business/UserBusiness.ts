import User from "../../database/models/User";
import { UserDTO } from "../RequestBodies/UserDTO";
import Address from "../../database/models/Address";
import Sex from "../../database/models/Sex";
import { AddressBusiness } from "./AddressBusiness";

export class UserBusiness {
    private addressBusiness: AddressBusiness

    public constructor () {
        this.addressBusiness = new AddressBusiness();
    }

    /**
     * Checks if user exists by the given email, if not, creates it.
     * @param userDto 
     * @returns Promise<User>
     * @throws Error
     */
    public async createUser(userDto: UserDTO): Promise<User>
    {
        // Creates address first
        const address: Address = await this.addressBusiness.createAddress(userDto.address).then((address) => {
            return address;
        });

        // @todo Hash le password bien évidemment
        const newUser = await User.findOrCreate({
            where: {email: userDto.email},
            defaults: {
                email: userDto.email,
                password: userDto.password,
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                birthdate: userDto.birthdate,
                notifyFriends: userDto.notifyFriends,
                idSex: userDto.sex.id,
                idAddress: address.id
            },
            include: [Address, Sex]
        }).then(([user, created]) => {
            // if (!created) {
            //     throw new Error("This email is already used");
            // }
            return user;
        });
        return newUser;
    }

    public async getAllUsers()
    {
        const users = await User.findAndCountAll().then();
        return users;
    }
    /**
     * Return user by its id
     * @param id User id
     * @returns User|null
     */
    public async getUserById(id: number) {
        let user: User|null = await User.findByPk(id).then();
        return user;
    }

    /**
     * @todo Faire une classe static avec un attribut et une fonction qui va juste servir à check le token et mettre les infos de celui-ci dans la variable.
     * On pourra ensuite récup ces infos de partout dans le code si besoin.
     */
    public async modifyUser(userDto: UserDTO): Promise<User> {
        /** @todo En dûr pour l'instant, récupéré du token par la suite */
        // let id: number = 1;
        // if (id != userDto.id) {
        //     throw new Error('Access forbidden');
        // }
        let user: User = await User.findByPk(userDto.id).then();
        if (!user) {
            throw new Error('Access forbidden');
        }

        user.email = userDto.email;
        /** @todo Hash le password */
        user.password = userDto.password;
        user.firstName = userDto.firstName;
        user.lastName = userDto.lastName;
        user.birthdate = userDto.birthdate;
        user.notifyFriends = userDto.notifyFriends;
        user.idSex = userDto.sex.id;
        this.addressBusiness.modifyUserAddress(user.address, userDto.address).then();

        user.save();
        return user;
    }

    public async deleteUser(id: number)
    {
        /** @todo Check dans le token que c'est le bon utilisateur */
        await User.findByPk(id).then((user: User) => {
            if (user) {
                return user.destroy();
            } else {
                throw new Error("User not found");
            }
        });
    }
}