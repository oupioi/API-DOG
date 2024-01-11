import Alert from "database/models/Alert";
import { AlertBusiness } from "../../api/Business/AlertBusiness";
import express, { Router, Request, Response } from "express";
import { CheckNumber } from "../../api/Tools/CheckInt";


const router: Router = express.Router();
const alertBusiness: AlertBusiness = new AlertBusiness();

router.get('/', async (req: Request, res: Response) => {
    const result: { rows: Alert[], count: number } = await alertBusiness.getAllAlerts();
    res.json({
        total_items: result.count,
        alerts: result.rows
    })
})

router.get('/:id',CheckNumber.CheckintID, async (req: Request, res: Response, next) => {
    try {
        const alert: Alert = await alertBusiness.getAlertById(parseInt(req.params.id));
        res.json(alert);
    } catch (err) {
        next(err);
    }
})

export default router;