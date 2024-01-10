import Breed from "database/models/Breed";
import { CustomError } from "api/Tools/ErrorHandler";
import { BreedService } from "api/Services/BreedService";

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
        // appel au service
    }
}