"use client";

import axios from "axios";
import { useCallback } from "react";
import useSWR from "swr";
import {
  deleteFilamentRequest,
  updateFilamentRequest,
} from "@/app/api/filaments/[id]/request";
import {
  createFilamentRequest,
  getFilamentsRequest,
} from "@/app/api/filaments/request";
import type { FilamentSchema } from "@/schemas/filament-schema";
import type { ApiErrorResponse } from "@/types/auth";
import type { Filament } from "@/types/filament";

const FILAMENTS_KEY = "filaments";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useFilaments() {
  const {
    data,
    error,
    isLoading,
    mutate: mutateFilaments,
  } = useSWR<Filament[]>(FILAMENTS_KEY, getFilamentsRequest);

  const createFilament = useCallback(
    async (formData: FilamentSchema) => {
      try {
        const filament = await createFilamentRequest(formData);
        await mutateFilaments((current) => [filament, ...(current ?? [])], {
          revalidate: false,
        });
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateFilaments]
  );

  const updateFilament = useCallback(
    async (id: string, formData: FilamentSchema) => {
      try {
        const filament = await updateFilamentRequest(id, formData);
        await mutateFilaments(
          (current) =>
            current?.map((item) => (item.id === id ? filament : item)),
          { revalidate: false }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateFilaments]
  );

  const deleteFilament = useCallback(
    async (id: string) => {
      try {
        await deleteFilamentRequest(id);
        await mutateFilaments(
          (current) => current?.filter((item) => item.id !== id),
          { revalidate: false }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateFilaments]
  );

  return {
    createFilament,
    deleteFilament,
    error: error ? getErrorMessage(error) : null,
    fetchFilaments: useCallback(() => mutateFilaments(), [mutateFilaments]),
    filaments: data ?? [],
    isLoading,
    updateFilament,
  };
}
