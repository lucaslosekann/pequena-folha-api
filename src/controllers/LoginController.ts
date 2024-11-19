import { Request, Response } from "express";
import { prisma } from "../server";
import { LoginUser } from "../schemas/LoginSchema";
import { compare } from "bcrypt";

export default class LoginController {
    public static async loginOne(req: Request, res: Response) {

        const { data, error } = await LoginUser.safeParseAsync(req.body);
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        if (!user) {
            res.status(404).json({ message: "Usuário não existente!" });
            return;
        }

        if (!user.active) {
            res.status(401).json({ message: "Usuário não está ativo!" });
            return;
        }

        if (!user.password) {
            res.status(401).json({ message: "Usuário não possui senha!" });
            return;
        }

        const isPassword_correct = await compare(password, user.password)



    }
}