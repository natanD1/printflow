"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { FeedbackRowActions } from "@/components/feedback-row-actions";
import { Badge } from "@/components/ui/badge";
import type { Feedback, FeedbackStatus } from "@/types/feedback";
import { parseBrazilianDate } from "@/utils/parse-brazilian-date";

const STATUS_LABEL: Record<FeedbackStatus, string> = {
  Approved: "Aprovado",
  Pending: "Pendente",
  Rejected: "Rejeitado",
};

const STATUS_CLASS_NAME: Record<FeedbackStatus, string> = {
  Approved:
    "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
  Pending: "border-border bg-muted text-muted-foreground",
  Rejected: "",
};

function formatDateTime(value: string): string {
  return parseBrazilianDate(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function buildFeedbacksColumns(
  onUpdateStatus: (id: string, status: FeedbackStatus) => Promise<void>
): ColumnDef<Feedback>[] {
  return [
    {
      accessorKey: "title",
      header: "Título",
    },
    {
      accessorKey: "submittedBy",
      cell: ({ row }) => {
        const { submittedByUserName, submittedByUserEmail } = row.original;

        return (
          <div className="flex flex-col">
            <span>{submittedByUserName}</span>
            <span className="text-muted-foreground text-xs">
              {submittedByUserEmail}
            </span>
          </div>
        );
      },
      header: "Enviado por",
    },
    {
      accessorKey: "createdAt",
      cell: ({ row }) => formatDateTime(row.original.createdAt),
      header: "Enviado em",
    },
    {
      accessorKey: "status",
      cell: ({ row }) => {
        const { status } = row.original;
        const variant = status === "Rejected" ? "destructive" : "outline";

        return (
          <Badge className={STATUS_CLASS_NAME[status]} variant={variant}>
            {STATUS_LABEL[status]}
          </Badge>
        );
      },
      header: "Status",
    },
    {
      cell: ({ row }) => (
        <FeedbackRowActions
          feedback={row.original}
          onUpdateStatus={onUpdateStatus}
        />
      ),
      header: "Ações",
      id: "actions",
    },
  ];
}
