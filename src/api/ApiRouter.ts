import express, { Router } from "express";
import customerController from "./Controllers/CustomerController";

const router: Router = express.Router();

router.use('/customer', customerController);

export default router;