"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { InviteCodeRowActions } from "@/components/invite-code-row-actions";
import { Badge } from "@/components/ui/badge";
import type { InviteCode, InviteCodeStatus } from "@/types/invite-code";
import { parseBrazilianDate } from "@/utils/parse-brazilian-date";

const STATUS_LABEL: Record<InviteCodeStatus, string> = {
  Available: "Disponível",
  Expired: "Expirado",
  Revoked: "Revogado",
  Used: "Usado",
};

const STATUS_CLASS_NAME: Record<InviteCodeStatus, string> = {
  Available:
    "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
  Expired: "border-border bg-muted text-muted-foreground",
  Revoked: "",
  Used: "",
};

function formatDateTime(value: string): string {
  return parseBrazilianDate(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function buildInviteCodesColumns(
  onRevoke: (id: string) => Promise<void>
): ColumnDef<InviteCode>[] {
  return [
    {
      accessorKey: "code",
      header: "Código",
    },
    {
      accessorKey: "status",
      cell: ({ row }) => {
        const { status } = row.original;
        const variant = status === "Revoked" ? "destructive" : "outline";

        return (
          <Badge className={STATUS_CLASS_NAME[status]} variant={variant}>
            {STATUS_LABEL[status]}
          </Badge>
        );
      },
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      cell: ({ row }) => formatDateTime(row.original.createdAt),
      header: "Gerado em",
    },
    {
      accessorKey: "expiresAt",
      cell: ({ row }) => formatDateTime(row.original.expiresAt),
      header: "Expira em",
    },
    {
      accessorKey: "usedBy",
      cell: ({ row }) => {
        const { usedByUserName, usedByUserEmail } = row.original;

        if (!usedByUserName) {
          return <span className="text-muted-foreground">—</span>;
        }

        return (
          <div className="flex flex-col">
            <span>{usedByUserName}</span>
            <span className="text-muted-foreground text-xs">
              {usedByUserEmail}
            </span>
          </div>
        );
      },
      header: "Utilizado por",
    },
    {
      cell: ({ row }) => (
        <InviteCodeRowActions inviteCode={row.original} onRevoke={onRevoke} />
      ),
      header: "Ações",
      id: "actions",
    },
  ];
}
