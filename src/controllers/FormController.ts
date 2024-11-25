import { Request, Response } from "express";
import { prisma } from "../server";
import { CreateFormSchema } from "../schemas/FormSchema";
import { FormImageType } from "@prisma/client";

export default class FormsController {
    public static async index(req: Request, res: Response) {
        const forms = await prisma.form.findMany({
            include: {
                inorganicDescription: true,
                organicDescription: true,
                residueComposition: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
        });
        res.json(forms);
    }

    public static async show(req: Request, res: Response) {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({ message: "Id mal formatado" });
            return;
        }
        const form = await prisma.form.findUnique({
            where: {
                id: Number(req.params.id),
            },
            include: {
                inorganicDescription: true,
                organicDescription: true,
                residueComposition: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
        });
        if (!form) {
            res.status(404).json({ message: "Formulário não encontrado" });
            return;
        }
        res.json(form);
    }

    public static async create(req: Request, res: Response) {
        if (Array.isArray(req.files)) {
            res.status(400).json({ error: "Invalid file format" });
            return;
        }

        const { data, error } = await CreateFormSchema.safeParseAsync({
            ...req.body,
            organicResidueComposition: req.files?.organicResidueComposition,
            inorganicResidueComposition: req.files?.inorganicResidueComposition,
        });
        if (error) {
            res.status(400).json({ error });
            return;
        }
        const { organicResidueComposition: _, inorganicResidueComposition: __, ...rest } = data;

        const user = await prisma.user.findUnique({
            where: {
                id: req.user!.id,
            },
        });
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        if (!user.active) {
            res.status(403).json({ message: "Usuário não ativo" });
            return;
        }

        const form = await prisma.form.create({
            data: {
                ...rest,
                userId: user.id,
                date: new Date(data.date),
                inorganicDescription: {
                    createMany: {
                        data: data.inorganicDescription.map((description) => ({
                            text: description,
                        })),
                    },
                },
                residueComposition: {
                    createMany: {
                        data: [
                            ...data.organicResidueComposition.map((file) => ({
                                image: file.buffer,
                                type: FormImageType.ORGANIC,
                            })),
                            ...data.inorganicResidueComposition.map((file) => ({
                                image: file.buffer,
                                type: FormImageType.INORGANIC,
                            })),
                        ],
                    },
                },
                organicDescription: {
                    createMany: {
                        data: data.organicDescription.map((description) => ({
                            text: description,
                        })),
                    },
                },
            },
        });

        res.json({
            message: "Formulário submetido com sucesso",
            id: form.id,
        });
    }

    public static async image(req: Request, res: Response) {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({ message: "Id mal formatado" });
            return;
        }
        const formImage = await prisma.formImage.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!formImage) {
            res.status(404).json({ message: "Imagem não encontrado" });
            return;
        }
        res.setHeader("Content-Type", "image/png");
        res.send(formImage.image);
    }
}
