"use client";

import axios from "axios";
import { useCallback } from "react";
import useSWR from "swr";
import { revokeInviteCodeRequest } from "@/app/api/invite-codes/[id]/request";
import {
  createInviteCodeRequest,
  getInviteCodesRequest,
} from "@/app/api/invite-codes/request";
import type { InviteCodeSchema } from "@/schemas/invite-code-schema";
import type { ApiErrorResponse } from "@/types/auth";
import type { InviteCode } from "@/types/invite-code";

const INVITE_CODES_KEY = "invite-codes";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useInviteCodes() {
  const {
    data,
    error,
    isLoading,
    mutate: mutateInviteCodes,
  } = useSWR<InviteCode[]>(INVITE_CODES_KEY, getInviteCodesRequest);

  const createInviteCode = useCallback(
    async (formData: InviteCodeSchema) => {
      try {
        const inviteCode = await createInviteCodeRequest(formData);
        await mutateInviteCodes((current) => [inviteCode, ...(current ?? [])], {
          revalidate: false,
        });
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateInviteCodes]
  );

  const revokeInviteCode = useCallback(
    async (id: string) => {
      try {
        await revokeInviteCodeRequest(id);
        await mutateInviteCodes(
          (current) =>
            current?.map((item) =>
              item.id === id ? { ...item, status: "Revoked" as const } : item
            ),
          { revalidate: true }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateInviteCodes]
  );

  return {
    createInviteCode,
    error: error ? getErrorMessage(error) : null,
    fetchInviteCodes: useCallback(
      () => mutateInviteCodes(),
      [mutateInviteCodes]
    ),
    inviteCodes: data ?? [],
    isLoading,
    revokeInviteCode,
  };
}
