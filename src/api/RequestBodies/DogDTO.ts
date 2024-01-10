import { BreedDTO } from "./BreedDTO";

export class DogDTO 
{
    id?: number;

    breed: BreedDTO;

    name: string;

    weight: number;

    sex: boolean;

    birthdate: Date;
}