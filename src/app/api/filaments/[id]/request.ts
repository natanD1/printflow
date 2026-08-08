import { api } from "@/lib/api";
import type { FilamentSchema } from "@/schemas/filament-schema";
import type { Filament } from "@/types/filament";

export async function updateFilamentRequest(
  id: string,
  data: FilamentSchema
): Promise<Filament> {
  const response = await api.put<Filament>(`/filaments/${id}`, data);

  return response.data;
}

export async function deleteFilamentRequest(id: string): Promise<void> {
  await api.delete(`/filaments/${id}`);
}
