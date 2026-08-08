import { api } from "@/lib/api";
import type { InviteCodeSchema } from "@/schemas/invite-code-schema";
import type { InviteCode } from "@/types/invite-code";

export async function getInviteCodesRequest(): Promise<InviteCode[]> {
  const response = await api.get<InviteCode[]>("/invite-codes");

  return response.data;
}

export async function createInviteCodeRequest(
  data: InviteCodeSchema
): Promise<InviteCode> {
  const response = await api.post<InviteCode>("/invite-codes", data);

  return response.data;
}
