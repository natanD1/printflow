import { api } from "@/lib/api";

export async function logoutRequest(): Promise<{ success: boolean }> {
  const response = await api.post<{ success: boolean }>("/auth/logout");

  return response.data;
}
