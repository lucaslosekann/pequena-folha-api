import { z } from "zod";

export const GetEventImageSchema = z.object({
    params: z.object({
        id: z.number(),
    }),
});

export const CreateEventSchema = z.object({
    date_time: z.string().datetime(),
    place: z.string(),
    type: z.string(),
    description: z.string(),
});

export const UpdateEventSchema = z.object({
    params: z.object({
        id: z.number(),
    }),
    date_time: z.string().datetime().optional(),
    place: z.string().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
});

export const UpdatePreviousEventSchema = z.object({
    params: z.object({
        id: z.number(),
    }),
    additionalText: z.string(),
    image: z
        .array(
            z.object({
                buffer: z.instanceof(Buffer),
            })
        )
        .default([]),
});

export const DeleteEventSchema = z.object({
    params: z.object({
        id: z.number(),
    }),
});
