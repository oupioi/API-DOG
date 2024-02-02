import { AddressDTO } from "./AddressDTO";
import { UserDTO } from "./UserDTO";

export class EventDTO{
    id?: Number;

    title: string;

    description: string;
    
    maxPeople: number;

    followers: number;

    closed: boolean;

    public: boolean;
    
    date: Date;

    address: AddressDTO;

    tabUser: number[];
}