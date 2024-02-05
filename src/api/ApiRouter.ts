import express, { Router } from "express";
import userController from "./Controllers/UserController";
import alertController from "./Controllers/AlertController";
import parkController from "./Controllers/ParkController";
import dogController from "./Controllers/DogController";
import breedController from "./Controllers/BreedController";
import sexController from "./Controllers/SexController";

const router: Router = express.Router();

router.use('/customer', userController);
router.use('/alert', alertController);
router.use('/park', parkController);
router.use('/dog', dogController)
router.use('/breed', breedController)
router.use('/sex', sexController)

export default router;