"use client";

import { type ReactElement, useCallback, useState } from "react";
import { InviteCodeForm } from "@/components/invite-code-form";
import { ModalCommunication } from "@/components/modal-communication";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { InviteCodeSchema } from "@/schemas/invite-code-schema";

interface ResultModalState {
  description?: string;
  title: string;
  variant: "success" | "error";
}

interface InviteCodeFormDialogProps {
  onSubmit: (data: InviteCodeSchema) => Promise<void>;
  trigger: ReactElement;
}

export function InviteCodeFormDialog({
  onSubmit,
  trigger,
}: InviteCodeFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [resultModal, setResultModal] = useState<ResultModalState | null>(null);

  const handleSubmit = useCallback(
    async (data: InviteCodeSchema) => {
      try {
        await onSubmit(data);
        setOpen(false);
        setResultModal({
          description: `Convite gerado com sucesso pra "${data.ownerName}".`,
          title: "Convite gerado",
          variant: "success",
        });
      } catch (caughtError) {
        setResultModal({
          description:
            caughtError instanceof Error
              ? caughtError.message
              : "Tente novamente em alguns instantes.",
          title: "Erro ao gerar convite",
          variant: "error",
        });
      }
    },
    [onSubmit]
  );

  const handleResultOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setResultModal(null);
    }
  }, []);

  return (
    <>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger render={trigger} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar convite</DialogTitle>
          </DialogHeader>
          <InviteCodeForm onSubmit={handleSubmit} />
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
