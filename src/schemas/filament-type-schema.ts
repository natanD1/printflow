import { z } from "zod";

export const filamentTypeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

export type FilamentTypeSchema = z.infer<typeof filamentTypeSchema>;
