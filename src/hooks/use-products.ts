"use client";

import axios from "axios";
import { useCallback } from "react";
import useSWR from "swr";
import {
  deleteProductRequest,
  updateProductRequest,
} from "@/app/api/products/[id]/request";
import {
  createProductRequest,
  getProductsRequest,
} from "@/app/api/products/request";
import type { ProductSchema } from "@/schemas/product-schema";
import type { ApiErrorResponse } from "@/types/auth";
import type { Product } from "@/types/product";

const PRODUCTS_KEY = "products";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useProducts() {
  const {
    data,
    error,
    isLoading,
    mutate: mutateProducts,
  } = useSWR<Product[]>(PRODUCTS_KEY, getProductsRequest);

  const createProduct = useCallback(
    async (formData: ProductSchema) => {
      try {
        const product = await createProductRequest(formData);
        await mutateProducts((current) => [product, ...(current ?? [])], {
          revalidate: false,
        });
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateProducts]
  );

  const updateProduct = useCallback(
    async (id: string, formData: ProductSchema) => {
      try {
        const product = await updateProductRequest(id, formData);
        await mutateProducts(
          (current) =>
            current?.map((item) => (item.id === id ? product : item)),
          { revalidate: false }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateProducts]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        await deleteProductRequest(id);
        await mutateProducts(
          (current) => current?.filter((item) => item.id !== id),
          { revalidate: false }
        );
      } catch (caughtError) {
        throw new Error(getErrorMessage(caughtError), { cause: caughtError });
      }
    },
    [mutateProducts]
  );

  return {
    createProduct,
    deleteProduct,
    error: error ? getErrorMessage(error) : null,
    fetchProducts: useCallback(() => mutateProducts(), [mutateProducts]),
    isLoading,
    products: data ?? [],
    updateProduct,
  };
}
