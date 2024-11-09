import { z } from "zod";

export const CreatePartnerSchema = z.object({
    name: z.string(),
    description: z.string(),
    image: z.object({
        buffer: z.instanceof(Buffer),
    }),
});

export const UpdatePartnerSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    image: z
        .object({
            buffer: z.instanceof(Buffer),
        })
        .optional(),
});
