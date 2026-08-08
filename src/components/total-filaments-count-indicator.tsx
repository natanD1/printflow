import { Layers } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TotalFilamentsCountIndicator({ count }: { count: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="size-4 text-sky-500 dark:text-sky-400" />
          Filamentos cadastrados
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="font-heading font-semibold text-3xl text-sky-500 dark:text-sky-400">
          {count.toLocaleString("pt-BR")}
        </p>
        <CardDescription>Total no estoque</CardDescription>
      </CardContent>
    </Card>
  );
}
