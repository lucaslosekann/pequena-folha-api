import { z } from "zod";

export const LoginUser = z.object({
    email: z.string(),
    password: z.string()
});