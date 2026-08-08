"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProductsRequest();
      setProducts(result);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: ProductSchema) => {
    setError(null);
    try {
      const product = await createProductRequest(data);
      setProducts((current) => [product, ...current]);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: ProductSchema) => {
    setError(null);
    try {
      const product = await updateProductRequest(id, data);
      setProducts((current) =>
        current.map((item) => (item.id === id ? product : item))
      );
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteProductRequest(id);
      setProducts((current) => current.filter((item) => item.id !== id));
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    createProduct,
    deleteProduct,
    error,
    fetchProducts,
    isLoading,
    products,
    updateProduct,
  };
}
