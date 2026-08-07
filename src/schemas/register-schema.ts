import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("E-mail inválido"),
  inviteCode: z.string().trim().min(1, "Informe o código de convite"),
  name: z.string().trim().min(2, "Informe seu nome completo"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
