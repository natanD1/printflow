"use client";

import axios from "axios";
import { useCallback } from "react";
import useSWR from "swr";
import { updateFilamentTypeRequest } from "@/app/api/filaments-type/[id]/request";
import {
  createFilamentTypeRequest,
  getFilamentTypesRequest,
} from "@/app/api/filaments-type/request";
import type { FilamentTypeSchema } from "@/schemas/filament-type-schema";
import type { ApiErrorResponse } from "@/types/auth";
import type { FilamentType } from "@/types/filament-type";

const FILAMENT_TYPES_KEY = "filament-types";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useFilamentTypes() {
  const {
    data,
    error,
    isLoading,
    mutate: mutateFilamentTypes,
  } = useSWR<FilamentType[]>(FILAMENT_TYPES_KEY, getFilamentTypesRequest);

  const createFilamentType = useCallback(
    async (formData: FilamentTypeSchema) => {
      try {
        const filamentType = await createFilamentTypeRequest(formData);
        await mutateFilamentTypes(
          (current) => [filamentType, ...(current ?? [])],
          { revalidate: false }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateFilamentTypes]
  );

  const updateFilamentType = useCallback(
    async (id: string, formData: FilamentTypeSchema, isActive: boolean) => {
      try {
        const filamentType = await updateFilamentTypeRequest(
          id,
          formData,
          isActive
        );
        await mutateFilamentTypes(
          (current) =>
            current?.map((item) => (item.id === id ? filamentType : item)),
          { revalidate: false }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateFilamentTypes]
  );

  return {
    createFilamentType,
    error: error ? getErrorMessage(error) : null,
    fetchFilamentTypes: useCallback(
      () => mutateFilamentTypes(),
      [mutateFilamentTypes]
    ),
    filamentTypes: data ?? [],
    isLoading,
    updateFilamentType,
  };
}
