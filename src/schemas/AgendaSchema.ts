import { z } from "zod";

// Lacking event title, maybe???
// Maybe event status too ==> [not started, in progress, finished, canceled ]

export const CreateEventSchema = z.object({
    date_time: z.string().datetime(),
    place: z.string(),
    type: z.string(),
    description: z.string()
});

export const UpdateEventSchema = z.object({
    date_time: z.string().datetime().optional(),
    place: z.string().optional(),
    type: z.string().optional(),
    description: z.string().optional()
});

export const DeleteEventSchema = z.object({
    params: z.object({
        id: z.number()
    }),
});

