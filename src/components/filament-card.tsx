"use client";

import { Trash2 } from "lucide-react";
import { type MouseEvent, useCallback, useState } from "react";
import { FilamentFormDialog } from "@/components/filament-form-dialog";
import { ModalCommunication } from "@/components/modal-communication";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FilamentSchema } from "@/schemas/filament-schema";
import type { Filament } from "@/types/filament";

interface FilamentCardProps {
  filament: Filament;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: FilamentSchema) => Promise<void>;
}

export function FilamentCard({
  filament,
  onDelete,
  onUpdate,
}: FilamentCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdate = useCallback(
    (data: FilamentSchema) => onUpdate(filament.id, data),
    [filament.id, onUpdate]
  );

  const handleDeleteTriggerClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setIsDeleteOpen(true);
    },
    []
  );

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onDelete(filament.id);
      setIsDeleteOpen(false);
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error ? caughtError.message : "Erro inesperado"
      );
    } finally {
      setIsDeleting(false);
    }
  }, [filament.id, onDelete]);

  const handleErrorOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setErrorMessage(null);
    }
  }, []);

  return (
    <>
      <FilamentFormDialog
        filament={filament}
        onSubmit={handleUpdate}
        trigger={
          <Card className="group/filament-card relative cursor-pointer transition-colors hover:bg-muted/50">
            <Button
              className="absolute top-2 right-2 opacity-0 transition-opacity group-hover/filament-card:opacity-100"
              onClick={handleDeleteTriggerClick}
              size="icon-xs"
              variant="ghost"
            >
              <Trash2 className="text-destructive" />
              <span className="sr-only">Excluir filamento</span>
            </Button>
            <CardContent className="flex items-center gap-3">
              <span
                className="size-10 shrink-0 rounded-full ring-1 ring-foreground/10"
                style={{ backgroundColor: filament.colorHex }}
              />
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-sm">{filament.name}</p>
                <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  {filament.brand.nameBrand} · {filament.type.name}
                </p>
                <p className="text-xs">
                  {filament.weight.toLocaleString("pt-BR", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  kg
                </p>
              </div>
            </CardContent>
          </Card>
        }
        triggerIsNativeButton={false}
      />

      <ModalCommunication
        confirmLabel="Excluir"
        description={`Isso vai remover "${filament.name}" do estoque permanentemente.`}
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onOpenChange={setIsDeleteOpen}
        open={isDeleteOpen}
        title="Excluir filamento?"
        variant="warning"
      />

      <ModalCommunication
        description={errorMessage ?? undefined}
        onOpenChange={handleErrorOpenChange}
        open={errorMessage !== null}
        title="Erro ao excluir filamento"
        variant="error"
      />
    </>
  );
}
