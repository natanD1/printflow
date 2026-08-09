import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api-client";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import type { FilamentBrand } from "@/types/filament-brand";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  const { id } = await params;
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const formData = await request.formData();

  try {
    const filamentBrand = await apiFetch<FilamentBrand>(
      `/filaments-brands/${id}`,
      {
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
        method: "PUT",
      }
    );

    return NextResponse.json(filamentBrand);
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
