"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { buildFilamentBrandsColumns } from "@/components/filament-brands-columns";
import { FilamentBrandsToolbar } from "@/components/filament-brands-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilamentBrands } from "@/hooks/use-filament-brands";

export function FilamentBrandsOverview() {
  const {
    createFilamentBrand,
    error,
    fetchFilamentBrands,
    filamentBrands,
    isLoading,
    updateFilamentBrand,
  } = useFilamentBrands();
  const [search, setSearch] = useState("");

  const filteredFilamentBrands = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return filamentBrands;
    }

    return filamentBrands.filter((brand) =>
      brand.nameBrand.toLowerCase().includes(term)
    );
  }, [filamentBrands, search]);

  const columns = useMemo(
    () => buildFilamentBrandsColumns(updateFilamentBrand),
    [updateFilamentBrand]
  );

  return (
    <div className="flex flex-col gap-4">
      <FilamentBrandsToolbar
        onCreate={createFilamentBrand}
        onRefresh={fetchFilamentBrands}
        onSearchChange={setSearch}
        search={search}
      />

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={filteredFilamentBrands}
          emptyMessage="Nenhuma marca cadastrada."
          pageSize={10}
        />
      )}
    </div>
  );
}
