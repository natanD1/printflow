"use client";

import { type ReactElement, useCallback, useState } from "react";
import { FilamentBrandForm } from "@/components/filament-brand-form";
import { ModalCommunication } from "@/components/modal-communication";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FilamentBrandSchema } from "@/schemas/filament-brand-schema";
import type { FilamentBrand } from "@/types/filament-brand";

interface ResultModalState {
  description?: string;
  title: string;
  variant: "success" | "error";
}

interface FilamentBrandFormDialogProps {
  filamentBrand?: FilamentBrand;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: FilamentBrandSchema) => Promise<void>;
  open?: boolean;
  trigger?: ReactElement;
  triggerIsNativeButton?: boolean;
}

export function FilamentBrandFormDialog({
  filamentBrand,
  onOpenChange,
  onSubmit,
  open: controlledOpen,
  trigger,
  triggerIsNativeButton = true,
}: FilamentBrandFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [resultModal, setResultModal] = useState<ResultModalState | null>(null);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (onOpenChange ?? (() => undefined))
    : setInternalOpen;
  const isEditing = Boolean(filamentBrand);

  const handleSubmit = useCallback(
    async (data: FilamentBrandSchema) => {
      try {
        await onSubmit(data);
        setOpen(false);
        setResultModal({
          description: isEditing
            ? `"${data.nameBrand}" foi atualizada com sucesso.`
            : `"${data.nameBrand}" foi cadastrada.`,
          title: isEditing ? "Marca atualizada" : "Marca cadastrada",
          variant: "success",
        });
      } catch (caughtError) {
        setResultModal({
          description:
            caughtError instanceof Error
              ? caughtError.message
              : "Tente novamente em alguns instantes.",
          title: "Erro ao salvar marca",
          variant: "error",
        });
      }
    },
    [onSubmit, setOpen, isEditing]
  );

  const handleResultOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setResultModal(null);
    }
  }, []);

  return (
    <>
      <Dialog onOpenChange={setOpen} open={open}>
        {trigger ? (
          <DialogTrigger
            nativeButton={triggerIsNativeButton}
            render={trigger}
          />
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar marca" : "Adicionar marca"}
            </DialogTitle>
          </DialogHeader>
          <FilamentBrandForm
            defaultValues={
              filamentBrand
                ? { image: null, nameBrand: filamentBrand.nameBrand }
                : undefined
            }
            existingImagePreview={filamentBrand?.imageBrand}
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
