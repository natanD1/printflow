"use client";

import { Calendar, Plus, RefreshCw, Search } from "lucide-react";
import { type ChangeEvent, useCallback } from "react";
import { ProductFormDialog } from "@/components/product-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductSchema } from "@/schemas/product-schema";

interface ProductsToolbarProps {
  onCreate: (data: ProductSchema) => Promise<void>;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  search: string;
}

export function ProductsToolbar({
  onCreate,
  onRefresh,
  onSearchChange,
  search,
}: ProductsToolbarProps) {
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
          placeholder="Buscar produto..."
          value={search}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button className="cursor-not-allowed" size="lg" disabled variant="outline">
          <Calendar />
          Período
        </Button>
        <Button onClick={onRefresh} size="lg" variant="outline">
          <RefreshCw />
          Atualizar
        </Button>
        <ProductFormDialog
          onSubmit={onCreate}
          trigger={
            <Button size="lg">
              <Plus />
              Adicionar produto
            </Button>
          }
        />
      </div>
    </div>
  );
}
