import { z } from "zod";

export const feedbackSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  title: z.string().min(1, "Título é obrigatório"),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;
