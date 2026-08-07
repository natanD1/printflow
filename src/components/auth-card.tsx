"use client";

import { useCallback, useState } from "react";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthMode = "login" | "register";

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>("login");

  const toggleMode = useCallback(() => {
    setMode((current) => (current === "login" ? "register" : "login"));
  }, []);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Entrar" : "Criar conta"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Entre com seu usuário e senha"
            : "Preencha os dados para se cadastrar"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === "login" ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <RegisterForm onToggleMode={toggleMode} />
        )}
      </CardContent>
    </Card>
  );
}
