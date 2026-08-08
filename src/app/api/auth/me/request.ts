import { api } from "@/lib/api";
import type { AuthUser } from "@/types/auth";

export async function getCurrentUserRequest(): Promise<AuthUser> {
  const response = await api.get<AuthUser>("/auth/me");

  return response.data;
}
