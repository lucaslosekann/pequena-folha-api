import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../server";
import { User } from "@prisma/client";

export default function VerifyToken(admin = false) {
    return (req: Request, res: Response, next: NextFunction) => {
        const authorization = req.headers?.["Authorization"] ?? req.headers?.["authorization"];
        if (Array.isArray(authorization)) {
            res.status(401).send({ message: "Token malformed" });
            return;
        }
        const [bearer, token] = authorization?.split(" ") || [];

        if (bearer !== "Bearer" || !token) {
            console.log(authorization);
            res.status(401).send({ message: "Token malformed" });
            return;
        }

        try {
            const user = jwt.verify(token, ENV.JWT_SECRET);
            req.user = user as Omit<User, "password">;
            if (admin && !req.user.isAdmin) {
                res.status(403).send({ message: "Unauthorized" });
                return;
            }
            next();
        } catch (err) {
            res.status(401).send({ message: "Invalid token" });
            return;
        }
    };
}
