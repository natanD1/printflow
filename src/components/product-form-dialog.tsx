"use client";

import { type ReactElement, useCallback, useState } from "react";
import { ModalCommunication } from "@/components/modal-communication";
import { ProductForm } from "@/components/product-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProductSchema } from "@/schemas/product-schema";
import type { Product } from "@/types/product";

interface ResultModalState {
  description?: string;
  title: string;
  variant: "success" | "error";
}

interface ProductFormDialogProps {
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: ProductSchema) => Promise<void>;
  open?: boolean;
  product?: Product;
  trigger?: ReactElement;
  triggerIsNativeButton?: boolean;
}

export function ProductFormDialog({
  onOpenChange,
  onSubmit,
  open: controlledOpen,
  product,
  trigger,
  triggerIsNativeButton = true,
}: ProductFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [resultModal, setResultModal] = useState<ResultModalState | null>(null);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (onOpenChange ?? (() => undefined))
    : setInternalOpen;
  const isEditing = Boolean(product);

  const handleSubmit = useCallback(
    async (data: ProductSchema) => {
      try {
        await onSubmit(data);
        setOpen(false);
        setResultModal({
          description: isEditing
            ? `"${data.productName}" foi atualizado com sucesso.`
            : `"${data.productName}" foi adicionado ao catálogo.`,
          title: isEditing ? "Produto atualizado" : "Produto cadastrado",
          variant: "success",
        });
      } catch (caughtError) {
        setResultModal({
          description:
            caughtError instanceof Error
              ? caughtError.message
              : "Tente novamente em alguns instantes.",
          title: "Erro ao salvar produto",
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar produto" : "Adicionar produto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            defaultValues={
              product
                ? {
                    filaments: product.filaments.map((f) => ({
                      filamentId: f.filamentId,
                      gramsUsed: f.gramsUsed,
                    })),
                    photo: null,
                    productName: product.productName,
                    salePriceOverride: null,
                    totalHours: product.totalHours,
                  }
                : undefined
            }
            existingPhotoPreview={product?.productPhoto ?? null}
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
