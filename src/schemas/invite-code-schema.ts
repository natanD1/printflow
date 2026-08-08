import { z } from "zod";

export const inviteCodeSchema = z.object({
  ownerName: z.string().min(1, "Nome é obrigatório"),
});

export type InviteCodeSchema = z.infer<typeof inviteCodeSchema>;
