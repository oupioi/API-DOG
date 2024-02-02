import express, { Router } from "express";
import userController from "./Controllers/UserController";
import alertController from "./Controllers/AlertController";
import parkController from "./Controllers/ParkController";
import eventController from "./Controllers/EventController";
import dogController from "./Controllers/DogController";

const router: Router = express.Router();

router.use('/customer', userController);
router.use('/alert', alertController);
router.use('/park', parkController);
router.use('/dog', dogController)
router.use('/event', eventController);

export default router;