import { AddressDTO } from "./AddressDTO";
import { SexDTO } from "./SexDTO";
import { Expose, Exclude } from 'class-transformer';

export class UserDTO {
    @Expose()
    id?: number;

    @Expose()
    email: string;

    @Expose()
    password: string;

    @Expose()
    firstName: string;
    
    @Expose()
    lastName: string;
    
    @Expose()
    birthdate: Date;
    
    @Expose()
    notifyFriends: boolean;

    @Expose()
    sex: SexDTO;

    @Expose()
    address: AddressDTO;
}