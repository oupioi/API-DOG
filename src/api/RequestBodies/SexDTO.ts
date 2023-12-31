import { Expose } from "class-transformer";

export class SexDTO {
    @Expose()
    id: number|null;
    
    @Expose()
    name: string;
}