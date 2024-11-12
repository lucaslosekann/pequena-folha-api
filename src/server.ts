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

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/partner", PartnersRouter);
app.use("/user", UsersRouter);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
