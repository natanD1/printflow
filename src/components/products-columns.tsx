"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ProductRowActions } from "@/components/product-row-actions";
import type { ProductSchema } from "@/schemas/product-schema";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format-currency";
import { formatWeight } from "@/utils/format-weight";

export function buildProductsColumns(
  onDelete: (id: string) => Promise<void>,
  onUpdate: (id: string, data: ProductSchema) => Promise<void>
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "productName",
      header: "Nome do produto",
    },
    {
      accessorKey: "costPrice",
      cell: ({ row }) => formatCurrency(row.original.costPrice),
      header: "Custo de produção",
    },
    {
      accessorKey: "totalFilament",
      cell: ({ row }) => formatWeight(row.original.totalFilament),
      header: "Total de filamento",
    },
    {
      accessorKey: "salePrice",
      cell: ({ row }) => formatCurrency(row.original.salePrice),
      header: "Preço de venda",
    },
    {
      cell: ({ row }) => (
        <ProductRowActions
          onDelete={onDelete}
          onUpdate={onUpdate}
          product={row.original}
        />
      ),
      header: "Ações",
      id: "actions",
    },
  ];
}
