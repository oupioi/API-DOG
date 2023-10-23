import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "./database/connection";
import Sex from "./database/models/Sex";

const app = express();

app.use(cors({
    credentials: true
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

app.post("/sex", async (req, res) => {
    const sex = await Sex.create(req.body);
    return res.status(201).json(sex);
})
server.listen(3000, () => {
    console.log({
        database: process.env.DB_NAME,
        dialect: "mysql",
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT)
    });
    console.log("Le serveur tourne sur http://localhost:3000/");
})
