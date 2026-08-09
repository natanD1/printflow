export type FeedbackStatus = "Pending" | "Approved" | "Rejected";

export interface Feedback {
  createdAt: string;
  description: string;
  id: string;
  status: FeedbackStatus;
  submittedByUserEmail: string;
  submittedByUserName: string;
  title: string;
  updatedAt: string | null;
}
