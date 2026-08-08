import { z } from "zod";

export const settingsSchema = z.object({
  averagePowerWatts: z.number().min(0, "Potência não pode ser negativa"),
  defaultProfitMarginPercentage: z
    .number()
    .min(0, "Margem não pode ser negativa"),
  kwhPrice: z.number().min(0, "Preço do kWh não pode ser negativo"),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;
