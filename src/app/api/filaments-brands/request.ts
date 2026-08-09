import { api } from "@/lib/api";
import type { FilamentBrandSchema } from "@/schemas/filament-brand-schema";
import type { FilamentBrand } from "@/types/filament-brand";

export function buildFilamentBrandFormData(
  data: FilamentBrandSchema,
  isActive?: boolean
): FormData {
  const formData = new FormData();

  formData.append("NameBrand", data.nameBrand);

  if (data.image) {
    formData.append("ImageBrand", data.image);
  }

  if (isActive !== undefined) {
    formData.append("IsActive", String(isActive));
  }

  return formData;
}

export async function getFilamentBrandsRequest(): Promise<FilamentBrand[]> {
  const response = await api.get<FilamentBrand[]>("/filaments-brands");

  return response.data;
}

export async function createFilamentBrandRequest(
  data: FilamentBrandSchema
): Promise<FilamentBrand> {
  const response = await api.post<FilamentBrand>(
    "/filaments-brands",
    buildFilamentBrandFormData(data)
  );

  return response.data;
}
