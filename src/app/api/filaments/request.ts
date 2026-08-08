import { api } from "@/lib/api";
import type { FilamentSchema } from "@/schemas/filament-schema";
import type { Filament } from "@/types/filament";

export async function getFilamentsRequest(): Promise<Filament[]> {
  const response = await api.get<Filament[]>("/filaments");

  return response.data;
}

export async function createFilamentRequest(
  data: FilamentSchema
): Promise<Filament> {
  const response = await api.post<Filament>("/filaments", data);

  return response.data;
}
