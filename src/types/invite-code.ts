export type InviteCodeStatus = "Available" | "Used" | "Revoked" | "Expired";

export interface InviteCode {
  code: string;
  createdAt: string;
  expiresAt: string;
  id: string;
  revokedAt: string | null;
  status: InviteCodeStatus;
  usedAt: string | null;
  usedByUserEmail: string | null;
  usedByUserName: string | null;
}
