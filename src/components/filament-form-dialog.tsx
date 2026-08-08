"use client";

import { type ReactElement, useCallback, useState } from "react";
import { FilamentForm } from "@/components/filament-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FilamentSchema } from "@/schemas/filament-schema";
import type { Filament } from "@/types/filament";

interface FilamentFormDialogProps {
  filament?: Filament;
  onSubmit: (data: FilamentSchema) => Promise<void>;
  trigger: ReactElement;
  triggerIsNativeButton?: boolean;
}

export function FilamentFormDialog({
  filament,
  onSubmit,
  trigger,
  triggerIsNativeButton = true,
}: FilamentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = Boolean(filament);

  const handleSubmit = useCallback(
    async (data: FilamentSchema) => {
      await onSubmit(data);
      setOpen(false);
    },
    [onSubmit]
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger nativeButton={triggerIsNativeButton} render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar filamento" : "Adicionar filamento"}
          </DialogTitle>
        </DialogHeader>
        <FilamentForm
          defaultValues={
            filament
              ? {
                  brand: filament.brand,
                  colorHex: filament.colorHex,
                  filamentPrice: filament.filamentPrice,
                  name: filament.name,
                  weight: filament.weight,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          submitLabel={isEditing ? "Salvar" : "Adicionar"}
        />
      </DialogContent>
    </Dialog>
  );
}
