import { z } from "zod";

export const CreateFormSchema = z.object({
    date: z.string().date(),
    inorganicVolume: z.coerce.number(),
    inorganicWeight: z.coerce.number(),
    inorganicDescriptionOther: z.string().optional(),
    organicVolume: z.coerce.number(),
    organicWeight: z.coerce.number(),
    organicDescriptionOther: z.string().optional(),
    wastes: z.string(),
    wastesVolume: z.coerce.number(),
    organicResidueComposition: z
        .array(
            z.object({
                buffer: z.instanceof(Buffer),
            })
        )
        .default([]),
    inorganicResidueComposition: z
        .array(
            z.object({
                buffer: z.instanceof(Buffer),
            })
        )
        .default([]),
    inorganicDescription: z.array(z.string()),
    organicDescription: z.array(z.string()),
});
