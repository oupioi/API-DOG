import express, { Router } from "express";
import userController from "./Controllers/UserController";
import alertController from "./Controllers/AlertController";
import parkController from "./Controllers/ParkController";
import noteController from "./Controllers/NoteController";
import dogController from "./Controllers/DogController";
import breedController from "./Controllers/BreedController";
import sexController from "./Controllers/SexController";
import adminController from "./admin/AdminController";
import addressController from "./Controllers/AddressController";
import friendController from "./Controllers/FriendController";
const router: Router = express.Router();

router.use('/customer', userController);
router.use('/alert', alertController);
router.use('/park', parkController);
router.use('/note', noteController);
router.use('/dog', dogController);
router.use('/breed', breedController);
router.use('/address', addressController);
router.use('/sex', sexController)
router.use('/admin', adminController)
router.use('/friend', friendController);

export default router;