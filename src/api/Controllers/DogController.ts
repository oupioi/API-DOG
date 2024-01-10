import { DogDTO } from "../RequestBodies/DogDTO";
import Dog from "../../database/models/Dog";
import express, { NextFunction, Request, Response, Router } from "express";
import { plainToInstance } from "class-transformer";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import { DogBusiness } from "../../api/Business/DogBusiness";

const router: Router = express.Router();
const dogBusiness: DogBusiness = new DogBusiness();

router.get('/',  TokenHandler.handle, async (req: Request, res: Response, next:NextFunction) => {
    try {
        const dogs: { rows: Dog[]; count: number; } = await dogBusiness.getAllDogs();
        res.json({
            total_items: dogs.count,
            dogs: dogs.rows
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dog: Dog = await dogBusiness.getDog(parseInt(req.params.id));
        res.json(dog);
    } catch (error) {
        next(error);
    }
});

router.get('/user/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dogs: { count: number, rows: Dog[] } = await dogBusiness.getDogByUser(parseInt(req.params.id));
        res.json({
            total_items: dogs.count,
            dogs: dogs.rows
        });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dogDto = plainToInstance(DogDTO, req.body);
        const dog: Dog = await dogBusiness.modifyDog(dogDto);
    
        res.status(200).json(dog);
    } catch (error) {
        next(error);
    }
})

router.post('/', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dogDto = plainToInstance(DogDTO, req.body);
        const newDog: Dog = await dogBusiness.createDog(dogDto);
        res.status(201).json(newDog);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await dogBusiness.deleteDog(parseInt(req.params.id));
        res.status(200).json({
            message: "Dog deleted"
        });
    } catch (error) {
        next(error);
    }
})



export default router;