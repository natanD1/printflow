import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api-client";
import { setAuthCookie } from "@/lib/auth-cookie";
import { registerSchema } from "@/schemas/register-schema";
import type { AuthSession, AuthUser } from "@/types/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const parsedBody = registerSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { issues: parsedBody.error.issues, message: "Dados inválidos" },
      { status: 400 }
    );
  }

  try {
    const session = await apiFetch<AuthSession>("/auth/register", {
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
