"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { loginRequest } from "@/app/api/auth/login/request";
import { logoutRequest } from "@/app/api/auth/logout/request";
import { getCurrentUserRequest } from "@/app/api/auth/me/request";
import { registerRequest } from "@/app/api/auth/register/request";
import { ModalCommunication } from "@/components/modal-communication";
import { setUnauthorizedHandler } from "@/lib/api";
import type { LoginSchema } from "@/schemas/login-schema";
import type { RegisterSchema } from "@/schemas/register-schema";
import type { ApiErrorResponse, AuthUser } from "@/types/auth";

export interface AuthContextValue {
  error: string | null;
  isLoading: boolean;
  login: (data: LoginSchema) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterSchema) => Promise<void>;
  user: AuthUser | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? "Erro inesperado";
  }

  return "Erro inesperado";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const login = useCallback(async (data: LoginSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginRequest(data);
      setUser(result.user);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerRequest(data);
      setUser(result.user);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logoutRequest();
      setUser(null);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUserRequest()
      .then(setUser)
      .catch(() => null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => setIsSessionExpired(true));
    return () => setUnauthorizedHandler(null);
  }, []);

  const handleSessionExpiredConfirm = useCallback(async () => {
    setIsSessionExpired(false);
    await logout().catch(() => null);
    router.push("/auth");
  }, [logout, router]);

  return (
    <AuthContext
      value={{
        error,
        isLoading,
        login,
        logout,
        register,
        user,
      }}
    >
      {children}

      <ModalCommunication
        confirmLabel="Ir para login"
        description="Sua sessão expirou. Faça login novamente pra continuar."
        hideCancel
        onConfirm={handleSessionExpiredConfirm}
        onOpenChange={setIsSessionExpired}
        open={isSessionExpired}
        title="Sessão expirada"
        variant="warning"
      />
    </AuthContext>
  );
}
