"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { ModalCommunication } from "@/components/modal-communication";
import { ProductDetailDialog } from "@/components/product-detail-dialog";
import { ProductFormDialog } from "@/components/product-form-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductSchema } from "@/schemas/product-schema";
import type { Product } from "@/types/product";

interface ProductRowActionsProps {
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: ProductSchema) => Promise<void>;
  product: Product;
}

export function ProductRowActions({
  onDelete,
  onUpdate,
  product,
}: ProductRowActionsProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdate = useCallback(
    (data: ProductSchema) => onUpdate(product.id, data),
    [product.id, onUpdate]
  );

  const handleOpenView = useCallback(() => {
    setIsViewOpen(true);
  }, []);

  const handleOpenEdit = useCallback(() => {
    setIsEditOpen(true);
  }, []);

  const handleOpenDelete = useCallback(() => {
    setIsDeleteOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onDelete(product.id);
      setIsDeleteOpen(false);
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error ? caughtError.message : "Erro inesperado"
      );
    } finally {
      setIsDeleting(false);
    }
  }, [product.id, onDelete]);

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
          <DropdownMenuItem onClick={handleOpenView}>
            <Eye />
            Visualizar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenEdit}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenDelete} variant="destructive">
            <Trash2 />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductDetailDialog
        onOpenChange={setIsViewOpen}
        open={isViewOpen}
        product={product}
      />

      <ProductFormDialog
        onOpenChange={setIsEditOpen}
        onSubmit={handleUpdate}
        open={isEditOpen}
        product={product}
      />

      <ModalCommunication
        confirmLabel="Excluir"
        description={`Isso vai remover "${product.productName}" permanentemente.`}
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onOpenChange={setIsDeleteOpen}
        open={isDeleteOpen}
        title="Excluir produto?"
        variant="warning"
      />

      <ModalCommunication
        description={errorMessage ?? undefined}
        onOpenChange={handleErrorOpenChange}
        open={errorMessage !== null}
        title="Erro ao excluir produto"
        variant="error"
      />
    </>
  );
}
