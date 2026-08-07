import { api } from "@/lib/api";
import type { LoginSchema } from "@/schemas/login-schema";
import type { AuthUserResponse } from "@/types/auth";

export async function loginRequest(
  credentials: LoginSchema
): Promise<AuthUserResponse> {
  const response = await api.post<AuthUserResponse>("/auth/login", credentials);

  return response.data;
}
