import Alert from "../../database/models/Alert";
import { AlertBusiness } from "../../api/Business/AlertBusiness";
import express, { Router, Request, Response, NextFunction } from "express";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import { AlertDTO } from "../../api/RequestBodies/AlertDTO";
import { plainToInstance } from "class-transformer";


const router: Router = express.Router();
const alertBusiness: AlertBusiness = new AlertBusiness();

router.get('/', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result: { rows: Alert[], count: number } = await alertBusiness.getAllAlerts();
        res.json({
            total_items: result.count,
            alerts: result.rows
        })
    } catch (error) {
        next(error);
    }
})

router.get('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const alert: Alert = await alertBusiness.getAlertById(parseInt(req.params.id));
        res.json(alert);
    } catch (error) {
        next(error);
    }
})

/**
 * @todo A déplacer dans le controller ADMIN
 */
router.post('/', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const alertDto: AlertDTO = plainToInstance(AlertDTO, req.body);
        const newAlert: Alert = await alertBusiness.createAlert(alertDto);

        res.status(201).json(newAlert);
    } catch (error) {
        next(error);
    }
})

/**
 * @todo A déplacer dans le controller ADMIN
 */
router.put('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const alertDto: AlertDTO = plainToInstance(AlertDTO, req.body);
        const alert: Alert = await alertBusiness.modifyAlert(alertDto);

        res.status(200).json(alert);
    } catch (error) {
        next(error);
    }
})

/**
 * @todo A déplacer dans le controller ADMIN
 */
router.delete('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await alertBusiness.deleteAlert(parseInt(req.params.id));
        res.status(200).json({
            massage: "Alert deleted"
        })
    } catch (error) {
        next(error);
    }
})

export default router;