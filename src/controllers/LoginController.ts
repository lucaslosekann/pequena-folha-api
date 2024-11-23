import { Request, Response } from "express";
import { ENV, prisma } from "../server";
import { LoginUser } from "../schemas/LoginSchema";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";


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
            res.status(404).json({ message: "Usuário não existente" });
            return;
        }

        if (!user.active) {
            res.status(401).json({ message: "Usuário não está ativo" });
            return;
        }

        if (!user.password) {
            res.status(401).json({ message: "Usuário não possui senha" });
            return;
        }

        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).json({ message: "Senha incorreta" })
            return;
        }

        const { password: _, ...userNoPassword } = user
        const token = jwt.sign(userNoPassword, ENV.JWT_SECRET, { expiresIn: '7d' }); // Token expires in 1 hour

        res.json({ user: userNoPassword, token });
        return;
    }
}