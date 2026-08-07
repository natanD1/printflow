import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api-client";
import { setAuthCookie } from "@/lib/auth-cookie";
import { loginSchema } from "@/schemas/login-schema";
import type { AuthSession, AuthUser } from "@/types/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const parsedBody = loginSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { issues: parsedBody.error.issues, message: "Dados inválidos" },
      { status: 400 }
    );
  }

  try {
    const session = await apiFetch<AuthSession>("/auth/login", {
      body: parsedBody.data,
      method: "POST",
    });

    const response = NextResponse.json<{ user: AuthUser }>({
      user: session.user,
    });
    setAuthCookie(response.cookies, session.token);

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    throw error;
  }
}
