import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Variáveis de ambiente inválidas:\n${z.prettifyError(parsedEnv.error)}`
  );
}

export const env = parsedEnv.data;
