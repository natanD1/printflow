import { buildProductFormData } from "@/app/api/products/request";
import { api } from "@/lib/api";
import type { ProductSchema } from "@/schemas/product-schema";
import type { Product } from "@/types/product";

export async function getProductRequest(id: string): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);

  return response.data;
}

export async function updateProductRequest(
  id: string,
  data: ProductSchema
): Promise<Product> {
  const response = await api.put<Product>(
    `/products/${id}`,
    buildProductFormData(data)
  );

  return response.data;
}

export async function deleteProductRequest(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
