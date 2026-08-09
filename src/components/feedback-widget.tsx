"use client";

import { MessageCircleHeart } from "lucide-react";
import { useCallback, useState } from "react";
import { FeedbackForm } from "@/components/feedback-form";
import { ModalCommunication } from "@/components/modal-communication";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSubmitFeedback } from "@/hooks/use-submit-feedback";
import type { FeedbackSchema } from "@/schemas/feedback-schema";

interface ResultModalState {
  description?: string;
  title: string;
  variant: "success" | "error";
}

export function FeedbackWidget() {
  const { submitFeedback } = useSubmitFeedback();
  const [open, setOpen] = useState(false);
  const [resultModal, setResultModal] = useState<ResultModalState | null>(null);

  const handleSubmit = useCallback(
    async (data: FeedbackSchema) => {
      try {
        await submitFeedback(data);
        setOpen(false);
        setResultModal({
          description:
            "Obrigado por ajudar a melhorar o sistema! Sua sugestão será avaliada.",
          title: "Feedback enviado",
          variant: "success",
        });
      } catch (caughtError) {
        setResultModal({
          description:
            caughtError instanceof Error
              ? caughtError.message
              : "Tente novamente em alguns instantes.",
          title: "Erro ao enviar feedback",
          variant: "error",
        });
      }
    },
    [submitFeedback]
  );

  const handleResultOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setResultModal(null);
    }
  }, []);

  return (
    <>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger
          render={
            <Button
              className="fixed right-4 bottom-4 z-40 size-12 rounded-full shadow-lg"
              size="icon-lg"
            />
          }
        >
          <MessageCircleHeart />
          <span className="sr-only">Dar feedback</span>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Enviar feedback</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <FeedbackForm onSubmit={handleSubmit} />
          </div>
        </SheetContent>
      </Sheet>

      <ModalCommunication
        description={resultModal?.description}
        extraAction={
          resultModal?.variant === "success"
            ? { href: "/doar", label: "Apoiar o projeto" }
            : undefined
        }
        onOpenChange={handleResultOpenChange}
        open={resultModal !== null}
        title={resultModal?.title ?? ""}
        variant={resultModal?.variant ?? "success"}
      />
    </>
  );
}
