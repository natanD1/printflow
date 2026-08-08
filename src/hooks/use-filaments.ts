"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useFilaments() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilaments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFilamentsRequest();
      setFilaments(result);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFilament = useCallback(async (data: FilamentSchema) => {
    setError(null);
    try {
      const filament = await createFilamentRequest(data);
      setFilaments((current) => [filament, ...current]);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    }
  }, []);

  const updateFilament = useCallback(
    async (id: string, data: FilamentSchema) => {
      setError(null);
      try {
        const filament = await updateFilamentRequest(id, data);
        setFilaments((current) =>
          current.map((item) => (item.id === id ? filament : item))
        );
      } catch (caughtError) {
        setError(getErrorMessage(caughtError));
        throw caughtError;
      }
    },
    []
  );

  const deleteFilament = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteFilamentRequest(id);
      setFilaments((current) => current.filter((item) => item.id !== id));
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    }
  }, []);

  useEffect(() => {
    fetchFilaments();
  }, [fetchFilaments]);

  return {
    createFilament,
    deleteFilament,
    error,
    fetchFilaments,
    filaments,
    isLoading,
    updateFilament,
  };
}
