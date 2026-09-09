import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  DB_URL: z.string().min(1).default("mongodb://127.0.0.1:27017/socialguard"),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  CORS_ORIGINS: z.string().optional().default(""),
  JWT_ACCESS_SECRET: z
    .string()
    .min(16)
    .default("dev-access-secret-socialguard-123"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16)
    .default("dev-refresh-secret-socialguard-456"),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

export const ENV = schema.parse(process.env);
export const env = ENV;
