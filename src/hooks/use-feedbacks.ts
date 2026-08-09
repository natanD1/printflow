"use client";

import axios from "axios";
import { useCallback } from "react";
import useSWR from "swr";
import { updateFeedbackStatusRequest } from "@/app/api/feedbacks/[id]/request";
import { getFeedbacksRequest } from "@/app/api/feedbacks/request";
import type { ApiErrorResponse } from "@/types/auth";
import type { Feedback, FeedbackStatus } from "@/types/feedback";

const FEEDBACKS_KEY = "feedbacks";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useFeedbacks() {
  const {
    data,
    error,
    isLoading,
    mutate: mutateFeedbacks,
  } = useSWR<Feedback[]>(FEEDBACKS_KEY, getFeedbacksRequest);

  const updateFeedbackStatus = useCallback(
    async (id: string, status: FeedbackStatus) => {
      try {
        const feedback = await updateFeedbackStatusRequest(id, status);
        await mutateFeedbacks(
          (current) =>
            current?.map((item) => (item.id === id ? feedback : item)),
          { revalidate: false }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateFeedbacks]
  );

  return {
    error: error ? getErrorMessage(error) : null,
    feedbacks: data ?? [],
    fetchFeedbacks: useCallback(() => mutateFeedbacks(), [mutateFeedbacks]),
    isLoading,
    updateFeedbackStatus,
  };
}
