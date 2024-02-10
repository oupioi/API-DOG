import Alert from "database/models/Alert";
import { AlertBusiness } from "../../api/Business/AlertBusiness";
import { UserBusiness } from "../../api/Business/UserBusiness";
import express, { Router, Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { SexDTO } from "../../api/RequestBodies/SexDTO";
import { SexBusiness } from "../../api/Business/SexBusiness";
import { TokenHandler } from "../../api/Tools/TokenHandler";


const router: Router = express.Router();
const alertBusiness: AlertBusiness = new AlertBusiness();

router.get('/customer/ihm', TokenHandler.handle, TokenHandler.isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    const userBusiness: UserBusiness = new UserBusiness();
    try {
        const result = await userBusiness.getAllUsers();
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
})

router.post("/sex", async (req: Request, res: Response, next: NextFunction) => {
    const sexBusiness = new SexBusiness();
    try {
        const sexDto = plainToInstance(SexDTO, req.body);
        const sex = await sexBusiness.createSex(sexDto);
        return res.status(201).json(sex);
    } catch (error) {
        next(error);
    }
})


export default router;