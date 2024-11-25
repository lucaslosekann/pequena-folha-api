import { Request, Response } from "express";
import { prisma } from "../server";
import { ActivateUserSchema, ChangePasswordSchema, CreateUserSchema, DeactivateUserSchema } from "../schemas/UsersSchema";
import { hash } from "bcrypt";

export default class UsersController {
    static async create(req: Request, res: Response) {
        const { data, error } = await CreateUserSchema.safeParseAsync(req.body);
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }
        const user = await prisma.user
            .create({
                data,
            })
            .catch((error) => {
                if (error.code === "P2002") {
                    return null;
                }
                throw error;
            });
        if (!user) {
            res.status(400).json({ message: "Usuário já existente" });
            return;
        }
        res.json(user);
        return;
    }

    static async index(req: Request, res: Response) {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(users.map((user) => ({ ...user, password: undefined, hasPassword: user.password != null })));
    }

    static async changePassword(req: Request, res: Response) {
        const { data, error } = await ChangePasswordSchema.safeParseAsync({
            body: req.body,
            params: req.params,
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: data.params.id,
            },
        });
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const passwordHash = await hash(data.body.password, 10);
        await prisma.user.update({
            where: {
                id: data.params.id,
            },
            data: {
                password: passwordHash,
                ...(user.password ? {} : { active: true }),
            },
        });
        res.json({ message: "Senha atualizada com sucesso" });
    }

    static async deactivate(req: Request, res: Response) {
        const { data, error } = await DeactivateUserSchema.safeParseAsync({
            params: req.params,
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: data.params.id,
            },
        });
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        await prisma.user.update({
            where: {
                id: data.params.id,
            },
            data: {
                active: false,
            },
        });
        res.json({ message: "Usuário desativado com sucesso" });
    }

    static async activate(req: Request, res: Response) {
        const { data, error } = await ActivateUserSchema.safeParseAsync({
            params: req.params,
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: data.params.id,
            },
        });
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        if (!user.password) {
            res.status(400).json({ message: "Usuário precisa ter uma senha definida para ser ativado" });
            return;
        }

        await prisma.user.update({
            where: {
                id: data.params.id,
            },
            data: {
                active: true,
            },
        });
        res.json({ message: "Usuário ativado com sucesso" });
    }
}
