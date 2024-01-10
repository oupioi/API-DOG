import { DogDTO } from "api/RequestBodies/DogDTO";
import Dog from "../../database/models/Dog";
import User from "../../database/models/User";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import { CustomError } from "../../api/Tools/ErrorHandler";
import Breed from "../../database/models/Breed";

export class DogBusiness {

    /**
     * Creates a dog and assiocate it to the user by the given token
     * @param dogDto Request body
     * @returns 
     */
    public async createDog(dogDto: DogDTO)
    {
        let newDog: Dog = new Dog({
            idBreed:    dogDto.breed.id,
            name:       dogDto.name,
            weight:     dogDto.weight,
            sex:        dogDto.sex,
            birthdate:  dogDto.birthdate,
            idUser:     TokenHandler.tokenUserId
        });
        await newDog.save();
        return await this.getDog(newDog.id);
    }

    /**
     * Return every dog in database
     * @returns
     */
    public async getAllDogs()
    {
        const dogs = await Dog.findAndCountAll({include: {model: Breed, as: "breed"}});
        return dogs;
    }

    /**
     * Returns a dog by its given id + informations on the owner
     * @param id Dog id
     * @throws CustomError
     * @returns
     */
    public async getDog(id: number)
    {
        const dog = await Dog.findByPk(id, {
            include: [
                {model: User, as: "user", attributes: ["pseudo", "firstName", "lastName"]},
                {model: Breed, as: "breed"}
            ]
        });
        if (!dog) {
            throw new CustomError("Not found", 404);
        }
        return dog;
    }

    /**
     * Deletes a dog by its given id
     * @param id Dog id
     * @throws CustomError
     */
    public async deleteDog(id: number)
    {
        const dog: Dog = await Dog.findByPk(id);
        if (!dog) {
            throw new CustomError("Not found", 404);
        }
        if (TokenHandler.tokenUserId != dog.idUser) {
            throw new CustomError("Can't delete a dog that isn't yours", 403);
        }

        await dog.destroy();
    }

    public async modifyDog(dogDto: DogDTO)
    {
        let dog: Dog = await Dog.findByPk(dogDto.id);
        
        if (!dog) {
            throw new CustomError("Not found", 404);
        }
        dog.idBreed     = dogDto.breed.id;
        dog.name        = dogDto.name;
        dog.weight      = dogDto.weight;
        dog.sex         = dogDto.sex;
        dog.birthdate   = dogDto.birthdate;

        await dog.save();
        return await Dog.findByPk(dog.id);
    }

    public async getDogByUser(userId: number)
    {
        const dogs: {count: number, rows: Dog[] } = await Dog.findAndCountAll({where: { idUser: userId }});
        return dogs;
    }
}