"use client";

import { type ReactElement, useCallback, useState } from "react";
import { FilamentForm } from "@/components/filament-form";
import { ModalCommunication } from "@/components/modal-communication";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FilamentSchema } from "@/schemas/filament-schema";
import type { Filament } from "@/types/filament";

interface ResultModalState {
  description?: string;
  title: string;
  variant: "success" | "error";
}

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
  const [resultModal, setResultModal] = useState<ResultModalState | null>(null);
  const isEditing = Boolean(filament);

  const handleSubmit = useCallback(
    async (data: FilamentSchema) => {
      try {
        await onSubmit(data);
        setOpen(false);
        setResultModal({
          description: isEditing
            ? `"${data.name}" foi atualizado com sucesso.`
            : `"${data.name}" foi adicionado ao estoque.`,
          title: isEditing ? "Filamento atualizado" : "Filamento cadastrado",
          variant: "success",
        });
      } catch (caughtError) {
        setResultModal({
          description:
            caughtError instanceof Error
              ? caughtError.message
              : "Tente novamente em alguns instantes.",
          title: "Erro ao salvar filamento",
          variant: "error",
        });
      }
    },
    [onSubmit, isEditing]
  );

  const handleResultOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setResultModal(null);
    }
  }, []);

  return (
    <>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger nativeButton={triggerIsNativeButton} render={trigger} />
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar filamento" : "Adicionar filamento"}
            </DialogTitle>
          </DialogHeader>
          <FilamentForm
            defaultValues={
              filament
                ? {
                    brandId: filament.brand.id,
                    colorHex: filament.colorHex,
                    filamentPrice: filament.filamentPrice,
                    name: filament.name,
                    typeId: filament.type.id,
                    weight: filament.weight,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            submitLabel={isEditing ? "Salvar" : "Adicionar"}
          />
        </DialogContent>
      </Dialog>

      <ModalCommunication
        description={resultModal?.description}
        onOpenChange={handleResultOpenChange}
        open={resultModal !== null}
        title={resultModal?.title ?? ""}
        variant={resultModal?.variant ?? "success"}
      />
    </>
  );
}
