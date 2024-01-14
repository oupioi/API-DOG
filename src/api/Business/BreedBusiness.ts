import Breed from "../../database/models/Breed";
import { CustomError } from "../../api/Tools/ErrorHandler";
import { BreedService } from "../../api/Services/BreedService";
import { DogApiDTO } from "../../api/Services/ResponseBodies/DogApiDTO";
import { plainToInstance } from "class-transformer";

export class BreedBusiness {

    private breedService: BreedService;

    constructor()
    {
        this.breedService = new BreedService();
    }

    /**
     * Returns breed in database
     * @returns
     */
    public async getBreeds()
    {
        const breeds: { count: number, rows: Breed[] } = await Breed.findAndCountAll();
        return breeds;
    }

    /**
     * Returns breed by its given id
     * @param id Breed id
     * @returns 
     */
    public async getBreed(id: number)
    {
        const breed: Breed = await Breed.findByPk(id);
        if (!breed) {
            throw new CustomError("Not found", 404);
        }
        return breed;
    }

    /**
     * Store dog breeds from https://dog.ceo/api into database
     */
    public async importBreeds()
    {
        let breeds: any[] = [];

        const response: DogApiDTO = await this.breedService.getBreedsFromApi();
        const responseDto = plainToInstance(DogApiDTO, response);

        for (const key in responseDto.message) {
            breeds.push({ name: key.charAt(0).toUpperCase() + key.slice(1)});
            
            responseDto.message[key].forEach((subBreed: string) => {
                breeds.push({name: `${subBreed.charAt(0).toUpperCase() + subBreed.slice(1)} ${key}`});
            });
        }

        await Breed.bulkCreate(breeds);

        return Breed.findAndCountAll();
    }
}