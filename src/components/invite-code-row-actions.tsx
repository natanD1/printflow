"use client";

import { Ban, MoreHorizontal } from "lucide-react";
import { useCallback, useState } from "react";
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
import type { InviteCode } from "@/types/invite-code";

interface InviteCodeRowActionsProps {
  inviteCode: InviteCode;
  onRevoke: (id: string) => Promise<void>;
}

export function InviteCodeRowActions({
  inviteCode,
  onRevoke,
}: InviteCodeRowActionsProps) {
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const canRevoke = inviteCode.status === "Available";

  const handleOpenRevoke = useCallback(() => {
    setIsRevokeOpen(true);
  }, []);

  const handleRevoke = useCallback(async () => {
    setIsRevoking(true);
    try {
      await onRevoke(inviteCode.id);
      setIsRevokeOpen(false);
    } finally {
      setIsRevoking(false);
    }
  }, [inviteCode.id, onRevoke]);

  if (!canRevoke) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon-xs" variant="ghost" />}>
          <span className="sr-only">Abrir ações</span>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleOpenRevoke} variant="destructive">
            <Ban />
            Revogar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog onOpenChange={setIsRevokeOpen} open={isRevokeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revogar convite?</AlertDialogTitle>
            <AlertDialogDescription>
              O código “{inviteCode.code}” deixará de poder ser usado pra
              cadastro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isRevoking}
              onClick={handleRevoke}
              variant="destructive"
            >
              Revogar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
