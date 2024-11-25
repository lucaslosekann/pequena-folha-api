import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/),
    address: z.string().min(3),
    houseResidents: z.number().int().positive(),
    addressDetails: z.string().min(3),
});

export const ChangePasswordSchema = z.object({
    body: z.object({
        password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    }),
    params: z.object({
        id: z
            .string()
            .refine((id) => !isNaN(Number(id)))
            .transform(Number),
    }),
});

export const DeactivateUserSchema = z.object({
    params: z.object({
        id: z
            .string()
            .refine((id) => !isNaN(Number(id)))
            .transform(Number),
    }),
});

export const ActivateUserSchema = z.object({
    params: z.object({
        id: z
            .string()
            .refine((id) => !isNaN(Number(id)))
            .transform(Number),
    }),
});
