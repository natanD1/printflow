import { api } from "@/lib/api";
import type { FeedbackSchema } from "@/schemas/feedback-schema";
import type { Feedback } from "@/types/feedback";

export async function getFeedbacksRequest(): Promise<Feedback[]> {
  const response = await api.get<Feedback[]>("/feedbacks");

  return response.data;
}

export async function createFeedbackRequest(
  data: FeedbackSchema
): Promise<Feedback> {
  const response = await api.post<Feedback>("/feedbacks", data);

  return response.data;
}
