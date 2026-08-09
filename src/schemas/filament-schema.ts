import { z } from "zod";

export const filamentSchema = z.object({
  brandId: z.string().min(1, "Marca é obrigatória"),
  colorHex: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Cor inválida (ex: #2810E2)"),
  filamentPrice: z.number().min(0, "Preço não pode ser negativo"),
  name: z.string().min(1, "Nome é obrigatório"),
  typeId: z.string().min(1, "Tipo é obrigatório"),
  weight: z.number().min(0, "Peso não pode ser negativo"),
});

export type FilamentSchema = z.infer<typeof filamentSchema>;
