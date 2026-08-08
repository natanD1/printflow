import { Agent, fetch as undiciFetch } from "undici";
import { env } from "@/lib/env";
import type { ApiErrorResponse } from "@/types/auth";

/**
 * Sem keep-alive: o hostname `backend` (Docker DNS interno) pode trocar de IP
 * quando o container é recriado. Uma conexão HTTP mantida viva reaponta pra
 * um IP morto (ou reciclado por outro container) e passa a devolver respostas
 * erradas em vez de dar erro de conexão. Forçar conexão nova a cada request
 * garante um lookup de DNS fresco toda vez.
 */
const internalApiDispatcher = new Agent({
  keepAliveMaxTimeout: 1,
  keepAliveTimeout: 1,
});

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch<T>(
  path: string,
  { body, headers, ...init }: ApiFetchOptions = {}
): Promise<T> {
  const isFormData = body instanceof FormData;

  let requestBody: string | FormData | undefined;
  if (body === undefined) {
    requestBody = undefined;
  } else if (isFormData) {
    requestBody = body;
  } else {
    requestBody = JSON.stringify(body);
  }

  const response = await undiciFetch(`${env.API_URL}${path}`, {
    ...init,
    body: requestBody,
    cache: "no-store",
    dispatcher: internalApiDispatcher,
    headers: isFormData
      ? headers
      : {
          "Content-Type": "application/json",
          ...headers,
        },
    // undici tem sua própria declaração de FormData/BodyInit, incompatível
    // por tipagem (mas idêntica em runtime) com a global do lib.dom.
  } as Parameters<typeof undiciFetch>[1]);

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;
    throw new ApiError(
      response.status,
      errorBody?.message ?? "Erro inesperado ao comunicar com a API"
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
