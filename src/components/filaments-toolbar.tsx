"use client";

import { Plus, RefreshCw, Search } from "lucide-react";
import { type ChangeEvent, useCallback } from "react";
import { FilamentFormDialog } from "@/components/filament-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FilamentSchema } from "@/schemas/filament-schema";

interface FilamentsToolbarProps {
  onCreate: (data: FilamentSchema) => Promise<void>;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  search: string;
}

export function FilamentsToolbar({
  onCreate,
  onRefresh,
  onSearchChange,
  search,
}: FilamentsToolbarProps) {
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
          placeholder="Buscar filamento..."
          value={search}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onRefresh} size="lg" variant="outline">
          <RefreshCw />
          Atualizar
        </Button>
        <FilamentFormDialog
          onSubmit={onCreate}
          trigger={
            <Button size="lg">
              <Plus />
              Adicionar filamento
            </Button>
          }
        />
      </div>
    </div>
  );
}
