import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api-client";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { filamentSchema } from "@/schemas/filament-schema";
import type { Filament } from "@/types/filament";

export async function GET(): Promise<NextResponse> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  try {
    const filaments = await apiFetch<Filament[]>("/filaments", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(filaments);
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

export async function POST(request: Request): Promise<NextResponse> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const body = await request.json();
  const parsedBody = filamentSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { issues: parsedBody.error.issues, message: "Dados inválidos" },
      { status: 400 }
    );
  }

  try {
    const filament = await apiFetch<Filament>("/filaments", {
      body: parsedBody.data,
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
    });

    return NextResponse.json(filament, { status: 201 });
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
