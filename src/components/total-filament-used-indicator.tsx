import { Flame } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatWeight } from "@/utils/format-weight";

export function TotalFilamentUsedIndicator({ grams }: { grams: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="size-4 text-rose-500 dark:text-rose-400" />
          Filamento gasto
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="font-heading font-semibold text-3xl text-rose-500 dark:text-rose-400">
          {formatWeight(grams)}
        </p>
        <CardDescription>Referente ao mês atual</CardDescription>
      </CardContent>
    </Card>
  );
}
