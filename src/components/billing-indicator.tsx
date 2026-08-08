import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";

export function BillingIndicator({ value }: { value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="size-4 text-emerald-500 dark:text-emerald-400" />
          Faturamento
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="font-heading font-semibold text-3xl text-emerald-500 dark:text-emerald-400">
          {formatCurrency(value)}
        </p>
        <CardDescription>Referente ao mês atual</CardDescription>
      </CardContent>
    </Card>
  );
}
