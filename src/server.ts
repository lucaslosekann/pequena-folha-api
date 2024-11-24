import dotenv from "dotenv";
dotenv.config();
import { EnvSchema } from "./schemas/EnvSchema";
export const ENV = EnvSchema.parse(process.env);

import express from "express";
import cors from "cors";

import multer from "multer";
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

import PartnersRouter from "./routers/PartnersRouter";
import UsersRouter from "./routers/UsersRouter";
import AgendaRouter from "./routers/AgendaRouter";
import LoginRouter from "./routers/LoginRouter";
import FormRouter from "./routers/FormRouter";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/partner", PartnersRouter);
app.use("/user", UsersRouter);
app.use("/agenda", AgendaRouter);
app.use("/login", LoginRouter);
app.use("/form", FormRouter);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
