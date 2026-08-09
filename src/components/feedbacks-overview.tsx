"use client";

import { RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { buildFeedbacksColumns } from "@/components/feedbacks-columns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeedbacks } from "@/hooks/use-feedbacks";

export function FeedbacksOverview() {
  const { error, feedbacks, fetchFeedbacks, isLoading, updateFeedbackStatus } =
    useFeedbacks();

  const columns = useMemo(
    () => buildFeedbacksColumns(updateFeedbackStatus),
    [updateFeedbackStatus]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button onClick={fetchFeedbacks} size="lg" variant="outline">
          <RefreshCw />
          Atualizar
        </Button>
      </div>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={feedbacks}
          emptyMessage="Nenhum feedback recebido ainda."
          pageSize={10}
        />
      )}
    </div>
  );
}
