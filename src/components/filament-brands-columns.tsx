"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Ghost } from "lucide-react";
import { FilamentBrandRowActions } from "@/components/filament-brand-row-actions";
import type { FilamentBrandSchema } from "@/schemas/filament-brand-schema";
import type { FilamentBrand } from "@/types/filament-brand";
import { parseBrazilianDate } from "@/utils/parse-brazilian-date";

function formatDate(value: string): string {
  return parseBrazilianDate(value).toLocaleDateString("pt-BR");
}

export function buildFilamentBrandsColumns(
  onUpdate: (
    id: string,
    data: FilamentBrandSchema,
    isActive: boolean
  ) => Promise<void>
): ColumnDef<FilamentBrand>[] {
  return [
    {
      accessorKey: "nameBrand",
      cell: ({ row }) => {
        const { nameBrand, imageBrand } = row.original;

        return (
          <div className="flex items-center gap-2">
            {imageBrand ? (
              // biome-ignore lint/performance/noImgElement: preview de base64 vindo da API, sem otimização de imagem aplicável
              <img
                alt={nameBrand}
                className="size-8 rounded-full border border-input object-cover"
                height={32}
                src={`data:image/png;base64,${imageBrand}`}
                width={32}
              />
            ) : (
              <div className="size-8 rounded-full bg-muted" />
            )}
            <span>{nameBrand}</span>
          </div>
        );
      },
      header: "Marca",
    },
    {
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt),
      header: "Criado em",
    },
    {
      accessorKey: "isActive",
      cell: ({ row }) =>
        row.original.isActive ? (
          <CircleCheck className="size-4 text-emerald-500 dark:text-emerald-400" />
        ) : (
          <Ghost className="size-4 text-sky-500 dark:text-sky-400" />
        ),
      header: "Status",
    },
    {
      cell: ({ row }) => (
        <FilamentBrandRowActions
          filamentBrand={row.original}
          onUpdate={onUpdate}
        />
      ),
      header: "Ações",
      id: "actions",
    },
  ];
}
