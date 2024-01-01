import { AddressDTO } from "./AddressDTO";
import { SexDTO } from "./SexDTO";
export class UserDTO {
    id?: number;

    email: string;

    password: string;

    firstName: string;
    
    lastName: string;
    
    birthdate: Date;
    
    notifyFriends: boolean;

    sex: SexDTO;

    address: AddressDTO;
}