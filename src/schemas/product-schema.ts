import { z } from "zod";

export const productFilamentEntrySchema = z.object({
  filamentId: z.string().min(1, "Selecione um filamento"),
  gramsUsed: z.number().min(0, "Gramas não pode ser negativo"),
});

export const productSchema = z.object({
  filaments: z.array(productFilamentEntrySchema),
  photo: z.instanceof(File).nullable(),
  productName: z.string().min(1, "Nome é obrigatório"),
  salePriceOverride: z
    .number()
    .min(0, "Preço não pode ser negativo")
    .nullable(),
  totalHours: z.number().min(0, "Horas não pode ser negativo"),
});

export type ProductFilamentEntrySchema = z.infer<
  typeof productFilamentEntrySchema
>;
export type ProductSchema = z.infer<typeof productSchema>;
