"use client";

import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type ModalCommunicationVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

interface ModalCommunicationProps {
  actionLabel?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  description?: string;
  /** Ação extra (link) mostrada ao lado do botão de fechar, só no modo sem confirmação (sem `onConfirm`). */
  extraAction?: { href: string; label: string };
  /** Esconde o botão "Cancelar" no modo confirmação (ex: sessão expirada, onde não faz sentido cancelar). */
  hideCancel?: boolean;
  isConfirming?: boolean;
  onConfirm?: () => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
  variant: ModalCommunicationVariant;
}

const variantConfig = {
  error: { className: "bg-destructive/10 text-destructive", icon: XCircle },
  info: { className: "bg-primary/10 text-primary", icon: Info },
  success: {
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  warning: {
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: TriangleAlert,
  },
} as const;

export function ModalCommunication({
  actionLabel,
  cancelLabel,
  confirmLabel,
  description,
  extraAction,
  hideCancel,
  isConfirming,
  onConfirm,
  onOpenChange,
  open,
  title,
  variant,
}: ModalCommunicationProps) {
  const { className, icon: Icon } = variantConfig[variant];
  const isConfirmMode = Boolean(onConfirm);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-row items-start gap-3 text-left">
          <AlertDialogMedia className={`mb-0 shrink-0 ${className}`}>
            <Icon />
          </AlertDialogMedia>
          <div className="flex flex-col gap-1.5">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description ? (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            ) : null}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isConfirmMode ? (
            <>
              {hideCancel ? null : (
                <AlertDialogCancel>
                  {cancelLabel ?? "Cancelar"}
                </AlertDialogCancel>
              )}
              <AlertDialogAction
                disabled={isConfirming}
                onClick={onConfirm}
                variant={variant === "warning" ? "destructive" : "default"}
              >
                {confirmLabel ?? "Confirmar"}
              </AlertDialogAction>
            </>
          ) : (
            <>
              {extraAction ? (
                <Button
                  nativeButton={false}
                  render={<Link href={extraAction.href} />}
                  variant="outline"
                >
                  {extraAction.label}
                </Button>
              ) : null}
              <AlertDialogAction onClick={handleClose}>
                {actionLabel ?? "Ok"}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
