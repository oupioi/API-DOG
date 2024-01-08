import { AlertBusiness } from "../../api/Business/AlertBusiness";
import express, { Router, Request, Response } from "express";


const router: Router = express.Router();
const alertBusiness: AlertBusiness = new AlertBusiness();

router.get('/', (req: Request, res: Response) => {
    alertBusiness.getAllAlerts().then((result) => {
        res.json({
            total_items: result.count,
            alerts: result.rows
        })
    })
})

router.get('/:id', (req: Request, res: Response, next) => {
    try {
        alertBusiness.getAlertById(parseInt(req.params.id)).then((alert) => {
            res.json(alert);
        })
    } catch(err) {
        next(err);
    }
})

export default router;