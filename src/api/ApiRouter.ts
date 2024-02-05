import express, { Router } from "express";
import userController from "./Controllers/UserController";
import alertController from "./Controllers/AlertController";
import parkController from "./Controllers/ParkController";
import noteController from "./Controllers/NoteController";
import dogController from "./Controllers/DogController";
import breedController from "./Controllers/BreedController";

const router: Router = express.Router();

router.use('/customer', userController);
router.use('/alert', alertController);
router.use('/park', parkController);
router.use('/note', noteController);
router.use('/dog', dogController);
router.use('/breed', breedController);
export default router;