import { z } from "zod"

// 1. Server-only environment variables
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  AUTH_SECRET: z.string().optional().default(""),
  BACKEND_API_BASE_URL: z.string().url("Invalid Backend API URL").default("http://localhost:8080"),
})

// 2. Client-accessible environment variables (prefixed with NEXT_PUBLIC_)
const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url("Invalid Public API URL").default("http://localhost:8080"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1, "App name is required").default("FilmLink"),
})

const isServer = typeof window === "undefined"

const _serverEnv = isServer
  ? serverSchema.safeParse({
      NODE_ENV: process.env.NODE_ENV,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      AUTH_SECRET: process.env.AUTH_SECRET,
      BACKEND_API_BASE_URL: process.env.BACKEND_API_BASE_URL,
    })
  : ({ success: true, data: {} } as const)

const _clientEnv = clientSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
})

if (!_clientEnv.success || !_serverEnv.success) {
  console.error("❌ Invalid environment variables:")
  if (!_clientEnv.success) console.error(_clientEnv.error.format())
  if (!_serverEnv.success && "error" in _serverEnv) console.error(_serverEnv.error.format())
  throw new Error("Invalid environment variables")
}

export const env = {
  ...(_serverEnv.data as z.infer<typeof serverSchema>),
  ..._clientEnv.data,
}
