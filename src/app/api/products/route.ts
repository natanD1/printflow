import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api-client";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import type { Product } from "@/types/product";

export async function GET(): Promise<NextResponse> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  try {
    const products = await apiFetch<Product[]>("/products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(products);
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
  const formData = await request.formData();

  try {
    const product = await apiFetch<Product>("/products", {
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
    });

    return NextResponse.json(product, { status: 201 });
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
