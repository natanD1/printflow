"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  getSettingsRequest,
  updateSettingsRequest,
} from "@/app/api/settings/request";
import type { SettingsSchema } from "@/schemas/settings-schema";
import type { ApiErrorResponse } from "@/types/auth";
import type { Settings } from "@/types/settings";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSettingsRequest();
      setSettings(result);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: SettingsSchema) => {
    setError(null);
    try {
      const result = await updateSettingsRequest(data);
      setSettings(result);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { error, fetchSettings, isLoading, settings, updateSettings };
}
