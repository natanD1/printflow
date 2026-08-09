"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { buildFilamentTypesColumns } from "@/components/filament-types-columns";
import { FilamentTypesToolbar } from "@/components/filament-types-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilamentTypes } from "@/hooks/use-filament-types";

export function FilamentTypesOverview() {
  const {
    createFilamentType,
    error,
    fetchFilamentTypes,
    filamentTypes,
    isLoading,
    updateFilamentType,
  } = useFilamentTypes();
  const [search, setSearch] = useState("");

  const filteredFilamentTypes = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return filamentTypes;
    }

    return filamentTypes.filter((type) =>
      type.name.toLowerCase().includes(term)
    );
  }, [filamentTypes, search]);

  const columns = useMemo(
    () => buildFilamentTypesColumns(updateFilamentType),
    [updateFilamentType]
  );

  return (
    <div className="flex flex-col gap-4">
      <FilamentTypesToolbar
        onCreate={createFilamentType}
        onRefresh={fetchFilamentTypes}
        onSearchChange={setSearch}
        search={search}
      />

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={filteredFilamentTypes}
          emptyMessage="Nenhum tipo cadastrado."
          pageSize={10}
        />
      )}
    </div>
  );
}
