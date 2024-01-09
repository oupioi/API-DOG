import express, { Router } from "express";
import userController from "./Controllers/UserController";
import friendController from "./Controllers/FriendController";
const router: Router = express.Router();

router.use('/customer', userController);
router.use('/friend', friendController);

export default router;