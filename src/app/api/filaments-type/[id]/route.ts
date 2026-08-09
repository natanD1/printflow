import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api-client";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import type { FilamentType } from "@/types/filament-type";

export const dynamic = "force-dynamic";

const updateFilamentTypeSchema = z.object({
  isActive: z.boolean(),
  name: z.string().min(1, "Nome é obrigatório"),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { id } = await params;
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const body = await request.json();
  const parsedBody = updateFilamentTypeSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { issues: parsedBody.error.issues, message: "Dados inválidos" },
      { status: 400 }
    );
  }

  try {
    const filamentType = await apiFetch<FilamentType>(`/filaments-type/${id}`, {
      body: parsedBody.data,
      headers: { Authorization: `Bearer ${token}` },
      method: "PUT",
    });

    return NextResponse.json(filamentType);
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
