"use client";

import { CircleCheck, Ghost, MoreHorizontal, Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { FilamentTypeFormDialog } from "@/components/filament-type-form-dialog";
import { ModalCommunication } from "@/components/modal-communication";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FilamentTypeSchema } from "@/schemas/filament-type-schema";
import type { FilamentType } from "@/types/filament-type";

interface FilamentTypeRowActionsProps {
  filamentType: FilamentType;
  onUpdate: (
    id: string,
    data: FilamentTypeSchema,
    isActive: boolean
  ) => Promise<void>;
}

export function FilamentTypeRowActions({
  filamentType,
  onUpdate,
}: FilamentTypeRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenEdit = useCallback(() => {
    setIsEditOpen(true);
  }, []);

  const handleEdit = useCallback(
    (data: FilamentTypeSchema) =>
      onUpdate(filamentType.id, data, filamentType.isActive),
    [filamentType.id, filamentType.isActive, onUpdate]
  );

  const handleToggleActive = useCallback(async () => {
    setIsToggling(true);
    try {
      await onUpdate(
        filamentType.id,
        { name: filamentType.name },
        !filamentType.isActive
      );
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error ? caughtError.message : "Erro inesperado"
      );
    } finally {
      setIsToggling(false);
    }
  }, [filamentType, onUpdate]);

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
            {filamentType.isActive ? <Ghost /> : <CircleCheck />}
            {filamentType.isActive ? "Desativar" : "Ativar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FilamentTypeFormDialog
        filamentType={filamentType}
        onOpenChange={setIsEditOpen}
        onSubmit={handleEdit}
        open={isEditOpen}
      />

      <ModalCommunication
        description={errorMessage ?? undefined}
        onOpenChange={handleErrorOpenChange}
        open={errorMessage !== null}
        title="Erro ao atualizar tipo"
        variant="error"
      />
    </>
  );
}
