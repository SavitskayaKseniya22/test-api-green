import { z } from "zod";

export const sessionCredentialsSchema = z.object({
    idInstance: z
        .string()
        .trim()
        .min(1, "Укажите idInstance.")
        .regex(/^\d+$/, "idInstance должен содержать только цифры."),
    apiTokenInstance: z
        .string()
        .trim()
        .min(1, "Укажите apiTokenInstance.")
        .regex(/^[a-zA-Z0-9]+$/, "apiTokenInstance должен содержать только латинские буквы и цифры."),
});

export const instanceStateSchema = z.object({
    stateInstance: z.string().min(1),
});

export type SessionCredentials = z.infer<typeof sessionCredentialsSchema>;
export type InstanceState = z.infer<typeof instanceStateSchema>;
