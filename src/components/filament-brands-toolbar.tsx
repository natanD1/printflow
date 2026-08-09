"use client";

import { Plus, RefreshCw, Search } from "lucide-react";
import { type ChangeEvent, useCallback } from "react";
import { FilamentBrandFormDialog } from "@/components/filament-brand-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FilamentBrandSchema } from "@/schemas/filament-brand-schema";

interface FilamentBrandsToolbarProps {
  onCreate: (data: FilamentBrandSchema) => Promise<void>;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  search: string;
}

export function FilamentBrandsToolbar({
  onCreate,
  onRefresh,
  onSearchChange,
  search,
}: FilamentBrandsToolbarProps) {
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
          placeholder="Buscar marca..."
          value={search}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onRefresh} size="lg" variant="outline">
          <RefreshCw />
          Atualizar
        </Button>
        <FilamentBrandFormDialog
          onSubmit={onCreate}
          trigger={
            <Button size="lg">
              <Plus />
              Adicionar marca
            </Button>
          }
        />
      </div>
    </div>
  );
}
