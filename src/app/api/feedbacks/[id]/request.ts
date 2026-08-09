import { api } from "@/lib/api";
import type { Feedback, FeedbackStatus } from "@/types/feedback";

export async function updateFeedbackStatusRequest(
  id: string,
  status: FeedbackStatus
): Promise<Feedback> {
  const response = await api.put<Feedback>(`/feedbacks/${id}`, {
    status,
  });

  return response.data;
}
