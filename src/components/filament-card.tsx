"use client";

import { Trash2 } from "lucide-react";
import { type MouseEvent, useCallback, useState } from "react";
import { FilamentFormDialog } from "@/components/filament-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    } finally {
      setIsDeleting(false);
    }
  }, [filament.id, onDelete]);

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
                <p className="text-muted-foreground text-xs">
                  {filament.brand}
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

      <AlertDialog onOpenChange={setIsDeleteOpen} open={isDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir filamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso vai remover “{filament.name}” do estoque permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
              variant="destructive"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
