import express, { Router } from "express";
import userController from "./Controllers/UserController";

const router: Router = express.Router();

router.use('/customer', userController);

export default router;