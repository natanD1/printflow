import { z } from "zod";

export const filamentBrandSchema = z.object({
  image: z.instanceof(File).nullable().optional(),
  nameBrand: z.string().min(1, "Nome é obrigatório"),
});

export type FilamentBrandSchema = z.infer<typeof filamentBrandSchema>;
