"use client";

import { Ban, MoreHorizontal } from "lucide-react";
import { useCallback, useState } from "react";
import { ModalCommunication } from "@/components/modal-communication";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const canRevoke = inviteCode.status === "Available";

  const handleOpenRevoke = useCallback(() => {
    setIsRevokeOpen(true);
  }, []);

  const handleRevoke = useCallback(async () => {
    setIsRevoking(true);
    try {
      await onRevoke(inviteCode.id);
      setIsRevokeOpen(false);
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error ? caughtError.message : "Erro inesperado"
      );
    } finally {
      setIsRevoking(false);
    }
  }, [inviteCode.id, onRevoke]);

  const handleErrorOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setErrorMessage(null);
    }
  }, []);

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

      <ModalCommunication
        confirmLabel="Revogar"
        description={`O código "${inviteCode.code}" deixará de poder ser usado pra cadastro.`}
        isConfirming={isRevoking}
        onConfirm={handleRevoke}
        onOpenChange={setIsRevokeOpen}
        open={isRevokeOpen}
        title="Revogar convite?"
        variant="warning"
      />

      <ModalCommunication
        description={errorMessage ?? undefined}
        onOpenChange={handleErrorOpenChange}
        open={errorMessage !== null}
        title="Erro ao revogar convite"
        variant="error"
      />
    </>
  );
}
