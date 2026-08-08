"use client";

import type { ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format-currency";
import { formatDuration } from "@/utils/format-duration";
import { formatWeight } from "@/utils/format-weight";

interface ProductDetailDialogProps {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  product: Product;
  trigger?: ReactElement;
  triggerIsNativeButton?: boolean;
}

export function ProductDetailDialog({
  onOpenChange,
  open,
  product,
  trigger,
  triggerIsNativeButton = true,
}: ProductDetailDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {trigger ? (
        <DialogTrigger nativeButton={triggerIsNativeButton} render={trigger} />
      ) : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product.productName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {product.productPhoto ? (
            // biome-ignore lint/performance/noImgElement: preview de base64 vindo da API, sem otimização de imagem aplicável
            <img
              alt={product.productName}
              className="h-40 w-40 rounded-lg object-cover"
              height={160}
              src={`data:image/jpeg;base64,${product.productPhoto}`}
              width={160}
            />
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">
                Horas de impressão
              </span>
              <p className="text-sm">{formatDuration(product.totalHours)}</p>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">
                Total de filamento
              </span>
              <p className="text-sm">{formatWeight(product.totalFilament)}</p>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">
                Custo de produção
              </span>
              <p className="text-sm">{formatCurrency(product.costPrice)}</p>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">
                Preço sugerido
              </span>
              <p className="text-sm">
                {formatCurrency(product.suggestedSalePrice)}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">
                Preço de venda final
              </span>
              <p className="font-medium text-sm">
                {formatCurrency(product.salePrice)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs">
              Filamentos usados
            </span>
            {product.filaments.length ? (
              <ul className="flex flex-col gap-2">
                {product.filaments.map((filament) => (
                  <li
                    className="flex items-center gap-2 text-sm"
                    key={filament.filamentId}
                  >
                    <span
                      className="size-4 shrink-0 rounded-full ring-1 ring-foreground/10"
                      style={{ backgroundColor: filament.colorHex }}
                    />
                    {filament.name} ({filament.brand}) —{" "}
                    {formatWeight(filament.gramsUsed)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhum filamento vinculado.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
