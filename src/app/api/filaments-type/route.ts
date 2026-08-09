import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api-client";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { filamentTypeSchema } from "@/schemas/filament-type-schema";
import type { FilamentType } from "@/types/filament-type";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  try {
    const filamentTypes = await apiFetch<FilamentType[]>("/filaments-type", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(filamentTypes);
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
  const parsedBody = filamentTypeSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { issues: parsedBody.error.issues, message: "Dados inválidos" },
      { status: 400 }
    );
  }

  try {
    const filamentType = await apiFetch<FilamentType>("/filaments-type", {
      body: parsedBody.data,
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
    });

    return NextResponse.json(filamentType, { status: 201 });
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
