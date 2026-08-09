"use client";

import { Eye, MoreHorizontal } from "lucide-react";
import { useCallback, useState } from "react";
import { FeedbackDetailDialog } from "@/components/feedback-detail-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Feedback, FeedbackStatus } from "@/types/feedback";

interface FeedbackRowActionsProps {
  feedback: Feedback;
  onUpdateStatus: (id: string, status: FeedbackStatus) => Promise<void>;
}

export function FeedbackRowActions({
  feedback,
  onUpdateStatus,
}: FeedbackRowActionsProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = useCallback(() => {
    setIsDetailOpen(true);
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon-xs" variant="ghost" />}>
          <span className="sr-only">Abrir ações</span>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleOpenDetail}>
            <Eye />
            Ver detalhes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FeedbackDetailDialog
        feedback={feedback}
        onOpenChange={setIsDetailOpen}
        onUpdateStatus={onUpdateStatus}
        open={isDetailOpen}
      />
    </>
  );
}
