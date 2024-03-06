import { AddressDTO } from "./AddressDTO"
export class ParkDTO {
    id?: number;

    name: string;

    topography: boolean;

    address: AddressDTO;

    idOsm: number;
}