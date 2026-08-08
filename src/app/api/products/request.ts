import { api } from "@/lib/api";
import type { ProductSchema } from "@/schemas/product-schema";
import type { Product } from "@/types/product";

export function buildProductFormData(data: ProductSchema): FormData {
  const formData = new FormData();

  formData.append("ProductName", data.productName);
  formData.append("TotalHours", String(data.totalHours));

  if (data.salePriceOverride !== null) {
    formData.append("SalePriceOverride", String(data.salePriceOverride));
  }

  if (data.photo) {
    formData.append("ProductPhoto", data.photo);
  }

  data.filaments.forEach((filament, index) => {
    formData.append(`Filaments[${index}].FilamentId`, filament.filamentId);
    formData.append(
      `Filaments[${index}].GramsUsed`,
      String(filament.gramsUsed)
    );
  });

  return formData;
}

export async function getProductsRequest(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products");

  return response.data;
}

export async function createProductRequest(
  data: ProductSchema
): Promise<Product> {
  const response = await api.post<Product>(
    "/products",
    buildProductFormData(data)
  );

  return response.data;
}
