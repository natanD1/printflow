"use client";

import axios from "axios";
import { useCallback } from "react";
import useSWR from "swr";
import { updateFilamentBrandRequest } from "@/app/api/filaments-brands/[id]/request";
import {
  createFilamentBrandRequest,
  getFilamentBrandsRequest,
} from "@/app/api/filaments-brands/request";
import type { FilamentBrandSchema } from "@/schemas/filament-brand-schema";
import type { ApiErrorResponse } from "@/types/auth";
import type { FilamentBrand } from "@/types/filament-brand";

const FILAMENT_BRANDS_KEY = "filament-brands";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useFilamentBrands() {
  const {
    data,
    error,
    isLoading,
    mutate: mutateFilamentBrands,
  } = useSWR<FilamentBrand[]>(FILAMENT_BRANDS_KEY, getFilamentBrandsRequest);

  const createFilamentBrand = useCallback(
    async (formData: FilamentBrandSchema) => {
      try {
        const filamentBrand = await createFilamentBrandRequest(formData);
        await mutateFilamentBrands(
          (current) => [filamentBrand, ...(current ?? [])],
          { revalidate: false }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateFilamentBrands]
  );

  const updateFilamentBrand = useCallback(
    async (id: string, formData: FilamentBrandSchema, isActive: boolean) => {
      try {
        const filamentBrand = await updateFilamentBrandRequest(
          id,
          formData,
          isActive
        );
        await mutateFilamentBrands(
          (current) =>
            current?.map((item) => (item.id === id ? filamentBrand : item)),
          { revalidate: false }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateFilamentBrands]
  );

  return {
    createFilamentBrand,
    error: error ? getErrorMessage(error) : null,
    fetchFilamentBrands: useCallback(
      () => mutateFilamentBrands(),
      [mutateFilamentBrands]
    ),
    filamentBrands: data ?? [],
    isLoading,
    updateFilamentBrand,
  };
}
