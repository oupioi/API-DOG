import * as dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import Sex from "./database/models/Sex";
import sequelize from './database/connection';
import apiRouter from './api/ApiRouter';
import { CustomError, ErrorHandler } from './api/Tools/ErrorHandler';
import { ValidationError } from 'sequelize';

sequelize.sync().then(() => {
    console.log('Tables syncronisées');
}).catch((error) => {
    console.log(error);
})
const app = express();


app.use(cors({credentials: true}))
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

app.use("/api", apiRouter);

/** CustomError handler */
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    const handler: ErrorHandler = new ErrorHandler();
    if (err instanceof CustomError) {
        const json = handler.handle(err);
        res.status(json.code).json(json);
    }else {
        next(err);
    }
})

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ValidationError) {
        res.status(500).json({
            code: 500,
            message: err.message
        });
    }else {
        next(err);
    }
})

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
        code: 404,
        message: 'Not found'
    });
})

server.listen(3000, () => {
    console.log("Le serveur tourne sur http://localhost:3000/");
})