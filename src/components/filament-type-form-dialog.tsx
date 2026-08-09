"use client";

import { type ReactElement, useCallback, useState } from "react";
import { FilamentTypeForm } from "@/components/filament-type-form";
import { ModalCommunication } from "@/components/modal-communication";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FilamentTypeSchema } from "@/schemas/filament-type-schema";
import type { FilamentType } from "@/types/filament-type";

interface ResultModalState {
  description?: string;
  title: string;
  variant: "success" | "error";
}

interface FilamentTypeFormDialogProps {
  filamentType?: FilamentType;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: FilamentTypeSchema) => Promise<void>;
  open?: boolean;
  trigger?: ReactElement;
  triggerIsNativeButton?: boolean;
}

export function FilamentTypeFormDialog({
  filamentType,
  onOpenChange,
  onSubmit,
  open: controlledOpen,
  trigger,
  triggerIsNativeButton = true,
}: FilamentTypeFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [resultModal, setResultModal] = useState<ResultModalState | null>(null);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (onOpenChange ?? (() => undefined))
    : setInternalOpen;
  const isEditing = Boolean(filamentType);

  const handleSubmit = useCallback(
    async (data: FilamentTypeSchema) => {
      try {
        await onSubmit(data);
        setOpen(false);
        setResultModal({
          description: isEditing
            ? `"${data.name}" foi atualizado com sucesso.`
            : `"${data.name}" foi cadastrado.`,
          title: isEditing ? "Tipo atualizado" : "Tipo cadastrado",
          variant: "success",
        });
      } catch (caughtError) {
        setResultModal({
          description:
            caughtError instanceof Error
              ? caughtError.message
              : "Tente novamente em alguns instantes.",
          title: "Erro ao salvar tipo",
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
              {isEditing ? "Editar tipo" : "Adicionar tipo"}
            </DialogTitle>
          </DialogHeader>
          <FilamentTypeForm
            defaultValues={
              filamentType ? { name: filamentType.name } : undefined
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
