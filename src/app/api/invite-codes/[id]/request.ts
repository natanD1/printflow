import { api } from "@/lib/api";

export async function revokeInviteCodeRequest(id: string): Promise<void> {
  await api.delete(`/invite-codes/${id}`);
}
