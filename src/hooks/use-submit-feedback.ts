"use client";

import axios from "axios";
import { useCallback } from "react";
import { createFeedbackRequest } from "@/app/api/feedbacks/request";
import type { FeedbackSchema } from "@/schemas/feedback-schema";
import type { ApiErrorResponse } from "@/types/auth";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useSubmitFeedback() {
  const submitFeedback = useCallback(async (data: FeedbackSchema) => {
    try {
      await createFeedbackRequest(data);
    } catch (caughtError) {
      throw new Error(getErrorMessage(caughtError), { cause: caughtError });
    }
  }, []);

  return { submitFeedback };
}
