"use client";

import { Plus, RefreshCw, Search } from "lucide-react";
import { type ChangeEvent, useCallback } from "react";
import { FilamentTypeFormDialog } from "@/components/filament-type-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FilamentTypeSchema } from "@/schemas/filament-type-schema";

interface FilamentTypesToolbarProps {
  onCreate: (data: FilamentTypeSchema) => Promise<void>;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  search: string;
}

export function FilamentTypesToolbar({
  onCreate,
  onRefresh,
  onSearchChange,
  search,
}: FilamentTypesToolbarProps) {
  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onSearchChange(event.target.value);
    },
    [onSearchChange]
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          onChange={handleSearchChange}
          placeholder="Buscar tipo..."
          value={search}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onRefresh} size="lg" variant="outline">
          <RefreshCw />
          Atualizar
        </Button>
        <FilamentTypeFormDialog
          onSubmit={onCreate}
          trigger={
            <Button size="lg">
              <Plus />
              Adicionar tipo
            </Button>
          }
        />
      </div>
    </div>
  );
}
