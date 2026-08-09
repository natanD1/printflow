import { api } from "@/lib/api";
import type { FilamentTypeSchema } from "@/schemas/filament-type-schema";
import type { FilamentType } from "@/types/filament-type";

export async function updateFilamentTypeRequest(
  id: string,
  data: FilamentTypeSchema,
  isActive: boolean
): Promise<FilamentType> {
  const response = await api.put<FilamentType>(`/filaments-type/${id}`, {
    ...data,
    isActive,
  });

  return response.data;
}
