import express, { NextFunction, Request, Response, Router } from "express";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import { BreedBusiness } from "../../api/Business/BreedBusiness";
import Breed from "../../database/models/Breed";
import { DogApiDTO } from "api/Services/ResponseBodies/DogApiDTO";

const router: Router = express.Router();
const breedBusiness: BreedBusiness = new BreedBusiness();

router.get('/',  TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const breeds: { rows: Breed[]; count: number; } = await breedBusiness.getBreeds();
        res.json({
            total_items: breeds.count,
            breeds: breeds.rows
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @todo Mettre cette route dans le router admin, un utilisateur ne devrait pas pouvoir faire ça
 */
router.get('/import',  TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const breeds: { count: number, rows: Breed[]} = await breedBusiness.importBreeds();
        res.json({
            total_items: breeds.count,
            breeds: breeds.rows
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:id',  TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const breed: Breed = await breedBusiness.getBreed(parseInt(req.params.id));
        res.json(breed);
    } catch (error) {
        next(error);
    }
});







export default router;