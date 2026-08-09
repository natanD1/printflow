"use client";

import { CircleCheck, Ghost, MoreHorizontal, Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { FilamentBrandFormDialog } from "@/components/filament-brand-form-dialog";
import { ModalCommunication } from "@/components/modal-communication";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FilamentBrandSchema } from "@/schemas/filament-brand-schema";
import type { FilamentBrand } from "@/types/filament-brand";

interface FilamentBrandRowActionsProps {
  filamentBrand: FilamentBrand;
  onUpdate: (
    id: string,
    data: FilamentBrandSchema,
    isActive: boolean
  ) => Promise<void>;
}

export function FilamentBrandRowActions({
  filamentBrand,
  onUpdate,
}: FilamentBrandRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenEdit = useCallback(() => {
    setIsEditOpen(true);
  }, []);

  const handleEdit = useCallback(
    (data: FilamentBrandSchema) =>
      onUpdate(filamentBrand.id, data, filamentBrand.isActive),
    [filamentBrand.id, filamentBrand.isActive, onUpdate]
  );

  const handleToggleActive = useCallback(async () => {
    setIsToggling(true);
    try {
      await onUpdate(
        filamentBrand.id,
        { image: null, nameBrand: filamentBrand.nameBrand },
        !filamentBrand.isActive
      );
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error ? caughtError.message : "Erro inesperado"
      );
    } finally {
      setIsToggling(false);
    }
  }, [filamentBrand, onUpdate]);

  const handleErrorOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setErrorMessage(null);
    }
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon-xs" variant="ghost" />}>
          <span className="sr-only">Abrir ações</span>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleOpenEdit}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isToggling} onClick={handleToggleActive}>
            {filamentBrand.isActive ? <Ghost /> : <CircleCheck />}
            {filamentBrand.isActive ? "Desativar" : "Ativar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FilamentBrandFormDialog
        filamentBrand={filamentBrand}
        onOpenChange={setIsEditOpen}
        onSubmit={handleEdit}
        open={isEditOpen}
      />

      <ModalCommunication
        description={errorMessage ?? undefined}
        onOpenChange={handleErrorOpenChange}
        open={errorMessage !== null}
        title="Erro ao atualizar marca"
        variant="error"
      />
    </>
  );
}
