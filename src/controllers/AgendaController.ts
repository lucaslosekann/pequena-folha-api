import { Request, Response } from "express";
import { prisma } from "../server";
import { CreateEventSchema, DeleteEventSchema, UpdateEventSchema } from "../schemas/AgendaSchema";

export default class AgendaController {
    public static async index(req: Request, res: Response) {
        const agenda = await prisma.agenda.findMany({
            select: {
                dateTime: true,
                place: true,
                type: true,
                description: true
            }
        });
        res.json(agenda)
    }

    public static async create(req: Request, res: Response) {
        const { data, error } = await CreateEventSchema.safeParseAsync({
            date_time: req.body.date_time,
            place: req.body.place,
            type: req.body.type,
            description: req.body.description
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
                description: data.description
            },
            select: {
                dateTime: true,
                place: true,
                type: true,
                description: true
            }
        });
        res.json(event)
    }

    public static async update(req: Request, res: Response) {
        // check for id format
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(400).json({ message: "Id mal formatado!" });
            return;
        }
        const { data, error } = await UpdateEventSchema.safeParseAsync({
            date_time: req.body.date_time,
            place: req.body.place,
            type: req.body.type,
            description: req.body.description
        });
        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }

        const event = await prisma.agenda.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                dateTime: data.date_time,
                place: data.place,
                type: data.type,
                description: data.description
            },
            select: {
                dateTime: true,
                place: true,
                type: true,
                description: true
            },
        }).catch((e) => {
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

    public static async delete(req: Request, res: Response) {
        const { data, error } = await DeleteEventSchema.safeParseAsync({
            params: {
                id: Number(req.params.id),
            }
        });

        if (error) {
            res.status(400).json({ errors: error?.errors });
            return;
        }

        const partner = await prisma.agenda.delete({
            where: {
                id: data.params.id,
            },
        }).catch((e) => {
            if (e.code === "P2025") return null;
            throw e;
        });
        if (!partner) {
            res.status(404).json({ message: "Evento não encontrado!" });
            return;
        }
        res.json({ message: "Evento deletado com sucesso!" });
    }

}