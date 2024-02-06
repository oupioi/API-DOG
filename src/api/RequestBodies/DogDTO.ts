import { DogSex } from "database/models/Dog";
import { BreedDTO } from "./BreedDTO";

export class DogDTO 
{
    id?: number;

    breed: BreedDTO;

    name: string;

    weight: number;

    sex: DogSex;

    birthdate: Date;
}