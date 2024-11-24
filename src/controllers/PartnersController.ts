import { Request, Response } from "express";
import { prisma } from "../server";
import { CreatePartnerSchema, UpdatePartnerSchema } from "../schemas/PartnersSchema";
export default class PartnersController {
    public static async index(req: Request, res: Response) {
        const partners = await prisma.partner.findMany({
            select: {
                description: true,
                name: true,
                id: true,
            },
        });
        res.json(partners);
    }

    public static async create(req: Request, res: Response) {
        const { data, error } = await CreatePartnerSchema.safeParseAsync({
            name: req.body.name,
            description: req.body.description,
            image: req.file,
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }
        const partner = await prisma.partner.create({
            data: {
                name: data.name,
                description: data.description,
                image: data.image.buffer,
            },
            select: {
                image: false,
                description: true,
                name: true,
                id: true,
            },
        });
        res.json(partner);
    }

    public static async image(req: Request, res: Response) {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({ message: "Id mal formatado" });
            return;
        }
        const partner = await prisma.partner.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!partner) {
            res.status(404).json({ message: "Parceiro não encontrado" });
            return;
        }
        res.setHeader("Content-Type", "image/png");
        res.send(partner.image);
    }

    public static async delete(req: Request, res: Response) {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({ message: "Id mal formatado!" });
            return;
        }
        const partner = await prisma.partner
            .delete({
                where: {
                    id: Number(req.params.id),
                },
            })
            .catch((e) => {
                if (e.code === "P2025") return null;
                throw e;
            });
        if (!partner) {
            res.status(404).json({ message: "Parceiro não encontrado" });
            return;
        }
        res.json({ message: "Parceiro deletado com sucesso" });
    }

    public static async update(req: Request, res: Response) {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({ message: "Id mal formatado!" });
            return;
        }
        const { data, error } = await UpdatePartnerSchema.safeParseAsync({
            name: req.body.name,
            description: req.body.description,
            image: req.file,
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }

        const partner = await prisma.partner
            .update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    name: data.name,
                    description: data.description,
                    image: data.image ? data.image.buffer : undefined,
                },
                select: {
                    image: false,
                    description: true,
                    name: true,
                    id: true,
                },
            })
            .catch((e) => {
                if (e.code === "P2025") return null;
                throw e;
            });
        if (!partner) {
            res.status(404).json({ message: "Parceiro não encontrado!" });
            return;
        }
        res.json(partner);
    }
}
