import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api-client";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import type { Feedback } from "@/types/feedback";

export const dynamic = "force-dynamic";

const updateFeedbackStatusSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected"]),
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
  const parsedBody = updateFeedbackStatusSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { issues: parsedBody.error.issues, message: "Dados inválidos" },
      { status: 400 }
    );
  }

  try {
    const feedback = await apiFetch<Feedback>(`/feedbacks/${id}/status`, {
      body: parsedBody.data,
      headers: { Authorization: `Bearer ${token}` },
      method: "PUT",
    });

    return NextResponse.json(feedback);
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
