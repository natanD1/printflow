import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-client";
import { AUTH_COOKIE_NAME, clearAuthCookie } from "@/lib/auth-cookie";

export const dynamic = "force-dynamic";

export async function POST(): Promise<NextResponse> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (token) {
    await apiFetch<void>("/auth/logout", {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
    }).catch(() => null);
  }

  const response = NextResponse.json({ success: true });
  clearAuthCookie(response.cookies);

  return response;
}
