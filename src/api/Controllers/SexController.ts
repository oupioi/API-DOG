import { SexBusiness } from "../../api/Business/SexBusiness";
import { SexDTO } from "../../api/RequestBodies/SexDTO";
import { plainToInstance } from "class-transformer";
import Sex from "../../database/models/Sex";
import express, { NextFunction, Request, Response, Router } from "express";

const router: Router = express.Router();
const sexBusiness: SexBusiness = new SexBusiness();


router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sexes: Sex[] = await sexBusiness.getSexes();
        res.json(sexes);
    } catch (error) {
        next(error);
    }
})


export default router;