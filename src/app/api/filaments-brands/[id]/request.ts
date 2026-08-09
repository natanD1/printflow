import { buildFilamentBrandFormData } from "@/app/api/filaments-brands/request";
import { api } from "@/lib/api";
import type { FilamentBrandSchema } from "@/schemas/filament-brand-schema";
import type { FilamentBrand } from "@/types/filament-brand";

export async function updateFilamentBrandRequest(
  id: string,
  data: FilamentBrandSchema,
  isActive: boolean
): Promise<FilamentBrand> {
  const response = await api.put<FilamentBrand>(
    `/filaments-brands/${id}`,
    buildFilamentBrandFormData(data, isActive)
  );

  return response.data;
}
