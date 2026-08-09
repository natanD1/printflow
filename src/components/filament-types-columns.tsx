"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Ghost } from "lucide-react";
import { FilamentTypeRowActions } from "@/components/filament-type-row-actions";
import type { FilamentTypeSchema } from "@/schemas/filament-type-schema";
import type { FilamentType } from "@/types/filament-type";
import { parseBrazilianDate } from "@/utils/parse-brazilian-date";

function formatDate(value: string): string {
  return parseBrazilianDate(value).toLocaleDateString("pt-BR");
}

export function buildFilamentTypesColumns(
  onUpdate: (
    id: string,
    data: FilamentTypeSchema,
    isActive: boolean
  ) => Promise<void>
): ColumnDef<FilamentType>[] {
  return [
    {
      accessorKey: "name",
      header: "Tipo",
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
        <FilamentTypeRowActions
          filamentType={row.original}
          onUpdate={onUpdate}
        />
      ),
      header: "Ações",
      id: "actions",
    },
  ];
}
