"use client";

import { type ReactElement, useCallback, useState } from "react";
import { InviteCodeForm } from "@/components/invite-code-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { InviteCodeSchema } from "@/schemas/invite-code-schema";

interface InviteCodeFormDialogProps {
  onSubmit: (data: InviteCodeSchema) => Promise<void>;
  trigger: ReactElement;
}

export function InviteCodeFormDialog({
  onSubmit,
  trigger,
}: InviteCodeFormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(
    async (data: InviteCodeSchema) => {
      await onSubmit(data);
      setOpen(false);
    },
    [onSubmit]
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar convite</DialogTitle>
        </DialogHeader>
        <InviteCodeForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
