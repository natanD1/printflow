import { LoaderIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <LoaderIcon
      aria-label="Carregando"
      className={cn("size-4 animate-spin", className)}
      role="status"
      {...props}
    />
  );
}

export { Spinner };
