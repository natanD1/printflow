import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TotalProductsCount({ count }: { count: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="size-4 text-violet-500 dark:text-violet-400" />
          Produtos fabricados
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="font-heading font-semibold text-3xl text-violet-500 dark:text-violet-400">
          {count.toLocaleString("pt-BR")}
        </p>
        <CardDescription>Referente ao mês atual</CardDescription>
      </CardContent>
    </Card>
  );
}
