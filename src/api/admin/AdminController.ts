import { UserBusiness } from "../../api/Business/UserBusiness";
import express, { Router, Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { SexDTO } from "../../api/RequestBodies/SexDTO";
import { SexBusiness } from "../../api/Business/SexBusiness";
import { TokenHandler } from "../../api/Tools/TokenHandler";


const router: Router = express.Router();

// ---------------------------------- GET -------------------------------------
router.get('/customer/ihm', TokenHandler.handle, TokenHandler.isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    const userBusiness: UserBusiness = new UserBusiness();
    try {
        const result = await userBusiness.getUserIHM(req.query?.email as string, req.query?.pseudo as string, parseInt(req.query?.limit as string), parseInt(req.query?.offset as string));
        res.status(200).json({
            total_items: result.count,
            users: result.rows
        });
    } catch (error) {
        next(error)
    }
})
router.get('/customer/:id', TokenHandler.handle, TokenHandler.isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    const userBusiness: UserBusiness = new UserBusiness();
    try {
        const result = await userBusiness.getUserByIdA(parseInt(req.params.id));
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
})
router.get('/customer/:id', TokenHandler.handle, TokenHandler.isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    const userBusiness: UserBusiness = new UserBusiness();
    try {
        const result = await userBusiness.getUserById(parseInt(req.params.id));
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
})

// ---------------------------------- POST -------------------------------------
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

// ---------------------------------- PUT -------------------------------------


// ---------------------------------- DELETE -------------------------------------


export default router;