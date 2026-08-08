"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { buildProductsColumns } from "@/components/products-columns";
import { ProductsToolbar } from "@/components/products-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductSchema } from "@/schemas/product-schema";
import type { Product } from "@/types/product";

interface ProductsTableProps {
  createProduct: (data: ProductSchema) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  error: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  products: Product[];
  updateProduct: (id: string, data: ProductSchema) => Promise<void>;
}

export function ProductsTable({
  createProduct,
  deleteProduct,
  error,
  isLoading,
  onRefresh,
  products,
  updateProduct,
}: ProductsTableProps) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) =>
      product.productName.toLowerCase().includes(term)
    );
  }, [products, search]);

  const columns = useMemo(
    () => buildProductsColumns(deleteProduct, updateProduct),
    [deleteProduct, updateProduct]
  );

  return (
    <div className="flex flex-col gap-4">
      <ProductsToolbar
        onCreate={createProduct}
        onRefresh={onRefresh}
        onSearchChange={setSearch}
        search={search}
      />

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable columns={columns} data={filteredProducts} pageSize={10} />
      )}
    </div>
  );
}
