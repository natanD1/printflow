"use client";

import { KeyRound, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export function ProfileCard() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-4 text-sky-500 dark:text-sky-400" />
          Perfil
        </CardTitle>
        <CardDescription>Dados da sua conta</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Nome</span>
          {user ? (
            <p className="text-sm">{user.name}</p>
          ) : (
            <Skeleton className="h-5 w-40" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">E-mail</span>
          {user ? (
            <p className="text-sm">{user.email}</p>
          ) : (
            <Skeleton className="h-5 w-56" />
          )}
        </div>
        <Button className="w-fit" disabled variant="outline">
          <KeyRound />
          Trocar senha
        </Button>
      </CardContent>
    </Card>
  );
}
