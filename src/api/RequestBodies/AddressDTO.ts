import { Expose } from "class-transformer";

export class AddressDTO {
    @Expose()
    id: number|null;
    
    @Expose()
    address: string;

    @Expose()
    zipCode: number;
    
    @Expose()
    city: string;
}