import express, { Router } from "express";
import userController from "./Controllers/UserController";
import dogController from "./Controllers/DogController";

const router: Router = express.Router();

router.use('/customer', userController);
router.use('/dog', dogController)

export default router;