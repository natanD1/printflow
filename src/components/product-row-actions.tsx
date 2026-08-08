"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { ProductDetailDialog } from "@/components/product-detail-dialog";
import { ProductFormDialog } from "@/components/product-form-dialog";
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
    } finally {
      setIsDeleting(false);
    }
  }, [product.id, onDelete]);

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

      <AlertDialog onOpenChange={setIsDeleteOpen} open={isDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso vai remover “{product.productName}” permanentemente.
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
