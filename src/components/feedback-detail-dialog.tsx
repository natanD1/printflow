"use client";

import type { MouseEvent, ReactElement } from "react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Feedback, FeedbackStatus } from "@/types/feedback";
import { parseBrazilianDate } from "@/utils/parse-brazilian-date";

interface FeedbackDetailDialogProps {
  feedback: Feedback;
  onOpenChange?: (open: boolean) => void;
  onUpdateStatus: (id: string, status: FeedbackStatus) => Promise<void>;
  open?: boolean;
  trigger?: ReactElement;
  triggerIsNativeButton?: boolean;
}

const STATUS_LABEL: Record<FeedbackStatus, string> = {
  Approved: "Aprovar",
  Pending: "Marcar pendente",
  Rejected: "Rejeitar",
};

const STATUS_OPTIONS: FeedbackStatus[] = ["Pending", "Approved", "Rejected"];

export function FeedbackDetailDialog({
  feedback,
  onOpenChange,
  onUpdateStatus,
  open,
  trigger,
  triggerIsNativeButton = true,
}: FeedbackDetailDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdateStatus = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      const status = event.currentTarget.dataset.status as
        | FeedbackStatus
        | undefined;

      if (!status) {
        return;
      }

      setIsUpdating(true);
      setErrorMessage(null);
      try {
        await onUpdateStatus(feedback.id, status);
      } catch (caughtError) {
        setErrorMessage(
          caughtError instanceof Error ? caughtError.message : "Erro inesperado"
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [feedback.id, onUpdateStatus]
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {trigger ? (
        <DialogTrigger nativeButton={triggerIsNativeButton} render={trigger} />
      ) : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{feedback.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="whitespace-pre-wrap text-sm">{feedback.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">Enviado por</span>
              <p className="text-sm">{feedback.submittedByUserName}</p>
              <p className="text-muted-foreground text-xs">
                {feedback.submittedByUserEmail}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">Enviado em</span>
              <p className="text-sm">
                {parseBrazilianDate(feedback.createdAt).toLocaleString(
                  "pt-BR",
                  { dateStyle: "short", timeStyle: "short" }
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <Button
                data-status={status}
                disabled={isUpdating || feedback.status === status}
                key={status}
                onClick={handleUpdateStatus}
                size="sm"
                variant={feedback.status === status ? "default" : "outline"}
              >
                {STATUS_LABEL[status]}
              </Button>
            ))}
          </div>

          {errorMessage ? (
            <p className="text-destructive text-sm">{errorMessage}</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
