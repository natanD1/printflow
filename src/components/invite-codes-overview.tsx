"use client";

import { CheckCircle2, Plus, RefreshCw, Ticket } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { InviteCodeFormDialog } from "@/components/invite-code-form-dialog";
import { buildInviteCodesColumns } from "@/components/invite-codes-columns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInviteCodes } from "@/hooks/use-invite-codes";

export function InviteCodesOverview() {
  const {
    createInviteCode,
    error,
    fetchInviteCodes,
    inviteCodes,
    isLoading,
    revokeInviteCode,
  } = useInviteCodes();

  const { availableCount, usedCount } = useMemo(
    () => ({
      availableCount: inviteCodes.filter((i) => i.status === "Available")
        .length,
      usedCount: inviteCodes.filter((i) => i.status === "Used").length,
    }),
    [inviteCodes]
  );

  const columns = useMemo(
    () => buildInviteCodesColumns(revokeInviteCode),
    [revokeInviteCode]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="size-4 text-sky-500 dark:text-sky-400" />
              Convites gerados
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="font-heading font-semibold text-3xl text-sky-500 dark:text-sky-400">
              {inviteCodes.length.toLocaleString("pt-BR")}
            </p>
            <CardDescription>Total emitido</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500 dark:text-emerald-400" />
              Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="font-heading font-semibold text-3xl text-emerald-500 dark:text-emerald-400">
              {availableCount.toLocaleString("pt-BR")}
            </p>
            <CardDescription>Ainda não utilizados</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="size-4 text-violet-500 dark:text-violet-400" />
              Utilizados
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="font-heading font-semibold text-3xl text-violet-500 dark:text-violet-400">
              {usedCount.toLocaleString("pt-BR")}
            </p>
            <CardDescription>Já usados no cadastro</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button onClick={fetchInviteCodes} size="lg" variant="outline">
          <RefreshCw />
          Atualizar
        </Button>
        <InviteCodeFormDialog
          onSubmit={createInviteCode}
          trigger={
            <Button size="lg">
              <Plus />
              Gerar convite
            </Button>
          }
        />
      </div>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={inviteCodes}
          emptyMessage="Nenhum convite gerado."
          pageSize={10}
        />
      )}
    </div>
  );
}
