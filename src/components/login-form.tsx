"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { type LoginSchema, loginSchema } from "@/schemas/login-schema";

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await login(data)
      .then(() => router.push("/home"))
      .catch(() => null);
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          autoComplete="email"
          id="email"
          type="email"
          value={"admin@printflow.com"}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Senha</Label>
        <Input
          autoComplete="current-password"
          id="password"
          type="password"
          value={"Admin@123"}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <FieldError message={error ?? undefined} />

      <Button className="w-full" disabled={isLoading} type="submit">
        Entrar
      </Button>

      <Button
        className="w-full"
        onClick={onToggleMode}
        type="button"
        variant="link"
      >
        Cadastra-se
      </Button>
    </form>
  );
}
