import { api } from "@/lib/api";
import type { FilamentTypeSchema } from "@/schemas/filament-type-schema";
import type { FilamentType } from "@/types/filament-type";

export async function getFilamentTypesRequest(): Promise<FilamentType[]> {
  const response = await api.get<FilamentType[]>("/filaments-type");

  return response.data;
}

export async function createFilamentTypeRequest(
  data: FilamentTypeSchema
): Promise<FilamentType> {
  const response = await api.post<FilamentType>("/filaments-type", data);

  return response.data;
}
