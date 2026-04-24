import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const envFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  ".env"
);
const rootEnvFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  ".env"
);

dotenv.config({ path: rootEnvFilePath });
dotenv.config({ path: envFilePath });

const runtimeEnv = { ...process.env };
const isProduction = runtimeEnv.NODE_ENV === "production";
const defaultPythonBin = process.platform === "win32" ? "python" : "python3";

if (!isProduction) {
  runtimeEnv.MONGODB_URI ||= "mongodb://127.0.0.1:27017/prism-grid-dev";
  runtimeEnv.JWT_SECRET ||= "dev-only-change-this-secret-please";
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  CLIENT_ORIGINS: z.string().optional(),
  PYTHON_BIN: z.string().default(defaultPythonBin),
});

const parsedEnv = envSchema.safeParse(runtimeEnv);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid backend environment variables:\n${issues}`);
}

export const env = parsedEnv.data;
