import express, { Router } from "express";
import userController from "./Controllers/UserController";
import alertController from "./Controllers/AlertController";

const router: Router = express.Router();

router.use('/customer', userController);

router.use('/alert', alertController);

export default router;