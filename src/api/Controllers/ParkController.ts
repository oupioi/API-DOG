import { ParkDTO } from "../../api/RequestBodies/ParkDTO";
import { ParkBusiness } from "../../api/Business/ParkBusiness";
import Park from "../../database/models/Park";
import express, { Router, Request, Response } from "express";
import { plainToInstance } from "class-transformer";

const router: Router = express.Router();
const parkBusiness: ParkBusiness = new ParkBusiness();

router.get('/', async (req: Request, res: Response) => {
    const result: {rows: Park[], count: number} = await parkBusiness.getAllParks();
    res.json({
        total_items: result.count,
        parks: result.rows
    })
})

router.get('/:id', async (req:Request, res: Response, next) => {
    try {
        const park: Park = await parkBusiness.getParkById(parseInt(req.params.id));
        res.json(park)
    } catch(error) {
        next(error);
    }
})

router.get('/search/:zip_code', async (req: Request, res: Response, next) => {
    try {
        const result: {rows: Park[], count: number} = await parkBusiness.getParkByZipCode(parseInt(req.params.zip_code));
        res.json({
            total_items: result.count,
            parks: result.rows
        });
    } catch (error) {
        next(error);
    }
})

/**
 * @todo à déplacer dans le controller admin
 */
router.post('/', async (req: Request, res: Response, next) => {
    try {
        const parkDto: ParkDTO = plainToInstance(ParkDTO, req.body);
        const newPark: Park = await parkBusiness.createPark(parkDto);
        const park: Park = await Park.findByPk(newPark.id);
        res.status(201).json(park);
    } catch (error) {
        next(error);
    }
})

export default router;