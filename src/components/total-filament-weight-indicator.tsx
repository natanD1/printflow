import { Weight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TotalFilamentWeightIndicator({
  kilograms,
}: {
  kilograms: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Weight className="size-4 text-amber-500 dark:text-amber-400" />
          Total em estoque
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="font-heading font-semibold text-3xl text-amber-500 dark:text-amber-400">
          {kilograms.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg
        </p>
        <CardDescription>Soma de todos os filamentos</CardDescription>
      </CardContent>
    </Card>
  );
}
