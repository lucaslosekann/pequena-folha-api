import { Request, Response } from "express";
import { prisma } from "../server";
import {
    CreateEventSchema,
    DeleteEventSchema,
    UpdateEventSchema,
    UpdatePreviousEventSchema,
    GetEventImageSchema,
} from "../schemas/AgendaSchema";

export default class AgendaController {
    public static async index(req: Request, res: Response) {
        const agenda = await prisma.agenda.findMany({
            select: {
                id: true,
                dateTime: true,
                place: true,
                type: true,
                description: true,
                additionalText: true,
                eventsImages: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        res.json(agenda);
    }

    public static async image(req: Request, res: Response) {
        const { data, error } = await GetEventImageSchema.safeParseAsync({
            params: {
                id: Number(req.params.id),
            },
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }

        const eventImg = await prisma.eventsImages.findUnique({
            where: {
                id: data.params.id,
            },
        });
        if (!eventImg) {
            res.status(404).json({ message: "Imagem não encontrada" });
            return;
        }
        res.setHeader("Content-Type", "image/png");
        res.send(eventImg.image);
    }

    public static async create(req: Request, res: Response) {
        const { data, error } = await CreateEventSchema.safeParseAsync({
            date_time: req.body.date_time,
            place: req.body.place,
            type: req.body.type,
            description: req.body.description,
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
            // ?. safely access errors property of the error object,
            // and if it's null, it doesn't throw an error, it return "undefined"
        }

        const event = await prisma.agenda.create({
            data: {
                dateTime: data.date_time,
                place: data.place,
                type: data.type,
                description: data.description,
            },
            select: {
                dateTime: true,
                place: true,
                type: true,
                description: true,
            },
        });
        res.json(event);
    }

    public static async update(req: Request, res: Response) {
        const { data, error } = await UpdateEventSchema.safeParseAsync({
            params: {
                id: Number(req.params.id),
            },
            date_time: req.body.date_time,
            place: req.body.place,
            type: req.body.type,
            description: req.body.description,
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }

        const event = await prisma.agenda
            .update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    dateTime: data.date_time,
                    place: data.place,
                    type: data.type,
                    description: data.description,
                },
                select: {
                    dateTime: true,
                    place: true,
                    type: true,
                    description: true,
                },
            })
            .catch((e) => {
                if (e.code === "P2025") return null;
                // "An operation failed because it depends on one or more records that were required but not found. {cause}"
                throw e;
            });
        if (!event) {
            res.status(404).json({ message: "Evento não encontrado!" });
            return;
        }
        res.json(event);
    }

    public static async updatePreviousEvent(req: Request, res: Response) {
        const { data, error } = await UpdatePreviousEventSchema.safeParseAsync({
            params: {
                id: Number(req.params.id),
            },
            additionalText: req.body.additionalText,
            image: req.files,
            imagesToDelete: req.body.imagesToDelete,
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }

        const previousEvent = await prisma.agenda
            .update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    additionalText: data.additionalText,
                    eventsImages: {
                        createMany: {
                            data: data.image.map((eventImages) => {
                                return { image: eventImages.buffer };
                            }),
                        },
                        deleteMany: data.imagesToDelete.map((id) => {
                            return { id };
                        }),
                    },
                },
                select: {
                    id: true,
                    additionalText: true,
                },
            })
            .catch((e) => {
                if (e.code === "P2025") return null;
                throw e;
            });
        if (!previousEvent) {
            res.status(404).json({ message: "Evento não encontrado!" });
            return;
        }
        res.json(previousEvent);
    }

    public static async delete(req: Request, res: Response) {
        const { data, error } = await DeleteEventSchema.safeParseAsync({
            params: {
                id: Number(req.params.id),
            },
        });

        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }

        const partner = await prisma.agenda
            .delete({
                where: {
                    id: data.params.id,
                },
            })
            .catch((e) => {
                if (e.code === "P2025") return null;
                throw e;
            });
        if (!partner) {
            res.status(404).json({ message: "Evento não encontrado!" });
            return;
        }
        res.json({ message: "Evento deletado com sucesso!" });
    }

    public static async delete_image(req: Request, res: Response) {
        const { data, error } = await GetEventImageSchema.safeParseAsync({
            params: {
                id: Number(req.params.id),
            },
        });

        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }

        const partner = await prisma.eventsImages
            .delete({
                where: {
                    id: data.params.id,
                },
            })
            .catch((e) => {
                if (e.code === "P2025") return null;
                throw e;
            });
        if (!partner) {
            res.status(404).json({ message: "Imagem não encontrada!" });
            return;
        }
        res.json({ message: "Imagem deletada com sucesso!" });
    }
}
