import { Heart } from "lucide-react";
import Link from "next/link";
import { AuthCard } from "@/components/auth-card";

export default function AuthPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center p-4">
      <AuthCard />
      <Link
        aria-label="Apoie o PrintFlow"
        className="absolute right-4 bottom-4 flex size-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-rose-500"
        href="/doar"
        title="Apoie o PrintFlow"
      >
        <Heart className="size-5" />
      </Link>
    </main>
  );
}
