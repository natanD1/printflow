import { api } from "@/lib/api";
import type { SettingsSchema } from "@/schemas/settings-schema";
import type { Settings } from "@/types/settings";

export async function getSettingsRequest(): Promise<Settings> {
  const response = await api.get<Settings>("/settings");

  return response.data;
}

export async function updateSettingsRequest(
  data: SettingsSchema
): Promise<Settings> {
  const response = await api.put<Settings>("/settings", data);

  return response.data;
}
