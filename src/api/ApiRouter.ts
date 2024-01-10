import express, { Router } from "express";
import userController from "./Controllers/UserController";
import parkController from "./Controllers/ParkController";

const router: Router = express.Router();

router.use('/customer', userController);

router.use('/park', parkController);

export default router;