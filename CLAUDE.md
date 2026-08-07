# PrintFlow

## Convenções

- Nomenclatura de arquivos: **kebab-case** (ex: `login-form.tsx`, `use-auth.ts`, `login-schema.ts`).
- Linting/formatação: Biome via Ultracite (`pnpm lint`, `pnpm lint:fix`).
- Gerenciador de pacotes: pnpm.
- Fonte padrão: **Manrope** (`src/app/layout.tsx`, variável `--font-sans`).
- Todo botão (`<button>` ou componente que renderize um) deve ter `cursor-pointer`. Já aplicado no `Button` base (`src/components/ui/button.tsx`); qualquer botão customizado fora dele deve seguir a mesma regra. Motivo: deixa explícito pro usuário quando um elemento é clicável.

## Estrutura

- `src/app` — rotas (App Router). Cada tela fica em sua própria pasta de rota:
  - `src/app/auth` — tela de login/cadastro (pública).
  - `src/app/home` — tela inicial (protegida, exige login).
  - `src/app/page.tsx` — raiz `/`, apenas redireciona para `/auth`.
  - `src/app/api` — endpoints de API (route handlers). Obrigatoriamente dentro de `app/`, é exigência do Next.js — não pode ficar fora dele.
- `src/components` — componentes React sem subpastas por escopo (ex: `login-form.tsx`, `auth-card.tsx` direto em `src/components`). `src/components/ui` é exceção, reservada aos componentes do shadcn/ui.
- `src/schemas` — validações de formulário com Zod (`*-schema.ts`).
- `src/hooks` — hooks customizados (ex: `use-auth.ts`).
- `src/context` — contextos React (ex: `auth-context.tsx`, fonte da lógica de login/logout/register).
- `src/lib` — utilitários, clientes HTTP e validação de env (`src/lib/env.ts`).
- `src/types` — tipos compartilhados.
- `src/proxy.ts` — proxy do Next.js (equivalente ao antigo `middleware.ts` a partir do Next 16) que protege rotas: bloqueia `/home` sem cookie de sessão (redireciona pra `/auth`) e bloqueia `/auth` com sessão ativa (redireciona pra `/home`).

## Rotas protegidas

- Rotas autenticadas ficam listadas em `protectedRoutes` dentro de `src/proxy.ts`.
- A verificação é feita pela presença do cookie httpOnly definido em `src/lib/auth-cookie.ts` (`AUTH_COOKIE_NAME`), setado pelas rotas de `src/app/api/auth/login` e `.../register`.
- Novas telas que exigem login: criar a rota em `src/app/<rota>` e adicionar `/<rota>` em `protectedRoutes` no `src/proxy.ts`.

## Dupla camada: client (browser) vs server (route.ts)

O projeto tem dois lados separados de propósito, cada um com seu próprio cliente HTTP e sua própria variável de ambiente:

```
Browser --(/api/auth/login)--> Next.js route.ts --(API_URL)--> Backend real
   ^                                  |
   |___________ cookie httpOnly ______|
```

- **Client (browser)** — `src/lib/api.ts` (`baseURL: "/api"`). O browser só fala com o próprio Next.js, nunca com o backend real. Usado pelos `request.ts`.
- **Server (`route.ts`)** — `src/lib/api-client.ts` (`apiFetch`), com `baseURL` vindo de `env.API_URL` (`src/lib/env.ts`, lido do `.env.development`). Só o `route.ts` fala com o backend real.

Por que não simplificar em uma camada só (browser chamando `API_URL` direto):

- `env.ts` valida `process.env` no server. `API_URL` sem prefixo `NEXT_PUBLIC_` não existe no bundle do browser — viraria `undefined` se usado em `src/lib/api.ts`.
- O token que o backend devolve no login vira cookie **httpOnly** dentro do `route.ts` — o browser nunca tem acesso a esse token via JS, só o navegador manda o cookie automaticamente. Se o browser chamasse o backend direto, o token precisaria ficar exposto no client (menos seguro) e o backend precisaria de CORS liberado pro navegador.

Regra: `API_URL` só pode ser usado dentro de `route.ts` (via `api-client.ts`). `src/lib/api.ts` nunca aponta pro backend real, só pra `/api`.

## Padrão de consumo de API (client-side)

A função que chama um endpoint fica **dentro da própria pasta do endpoint**, em `src/app/api/<dominio>/<endpoint>/request.ts`, ao lado do `route.ts` correspondente. Next.js só trata `route.ts`, `page.tsx`, `layout.tsx` etc. como arquivos especiais — qualquer outro nome (como `request.ts`) na mesma pasta não vira rota, só fica colocado junto da lógica que ele chama.

Exemplo já aplicado em `src/app/api/auth/login/`:

```
src/app/api/auth/login/
  route.ts     # server: recebe o POST, valida, chama o backend, seta cookie
  request.ts   # client: função que o front chama pra bater nesse endpoint
```

A chamada usa a instância Axios centralizada em `src/lib/api.ts` (`baseURL: "/api"`) — nunca `axios` direto nem `fetch`:

```ts
// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});
```

```ts
// src/app/api/<dominio>/<endpoint>/request.ts
import { api } from "@/lib/api";
import type { AlgumSchema } from "@/schemas/algum-schema";
import type { AlgumaResponse } from "@/types/<dominio>";

export async function algumaRequest(
  credentials: AlgumSchema
): Promise<AlgumaResponse> {
  const response = await api.post<AlgumaResponse>(
    "/<dominio>/<endpoint>",
    credentials
  );

  return response.data;
}
```

Regras:

- Um `request.ts` por endpoint, sempre ao lado do `route.ts` que ele chama.
- Uma função por `request.ts`, nomeada `<acao>Request` (ex: `loginRequest`, `logoutRequest`), tipada com o schema de entrada (`src/schemas`) e o tipo de resposta (`src/types`). Usa `api.get/post/put/delete<TResponse>(...)` e retorna `response.data`.
- `request.ts` só importa `api` de `@/lib/api` — não importar nada server-only (`src/lib/env.ts`, `src/lib/api-client.ts`, `src/lib/auth-cookie.ts`), isso é exclusivo do `route.ts`.
- Erro é tratado com `axios.isAxiosError<ApiErrorResponse>(error)` (ver `src/context/auth-context.tsx`), lendo `error.response?.data.message` — não criar classe de erro própria.
- Hooks e contexts (ex: `src/context/auth-context.tsx`) importam essas funções direto de `@/app/api/<dominio>/<endpoint>/request` e só chamam elas; a lógica de estado (loading/error/dados) fica no hook/context, nunca a montagem da chamada HTTP.
