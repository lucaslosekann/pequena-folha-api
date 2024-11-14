import { Request, Response } from "express";
import { prisma } from "../server";
import { CreateFormsSchema, UpdateFormsSchema } from "../schemas/FormsSchema";
export default class FormsController {
    public static async index(req: Request, res: Response) {
        const forms = await prisma.forms.findMany({
            select: {
                description_residue: true,
                vol_residue: true,
                organic_image: true,
                description_organic_other: true,
                description_organic: true,
                mass_organic: true,
                vol_organic_other: true,
                vol_organic: true,
                inorganic_image: true,
                description_inorganic_other: true,
                description_inorganic: true,
                mass_inorganic: true,
                vol_inorganic_other: true,
                vol_inorganic: true,
                date: true,
                name: true,
                id: true,
            },
        });
        res.json(forms);
    }





    public static async create(req: Request, res: Response) {
        const { data, error } = await CreateFormsSchema.safeParseAsync({
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
            res.status(400).json({ message: "Id mal formatado" });
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
            res.status(400).json({ message: "Id mal formatado" });
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
            res.status(404).json({ message: "Parceiro não encontrado" });
            return;
        }
        res.json(partner);
    }
}
