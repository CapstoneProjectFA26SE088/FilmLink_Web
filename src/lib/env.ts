/**
 * Validated Environment Configuration
 * Provides type-safe access to public and server environment variables.
 */

export const env = {
  // Public (available in browser and server)
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  NEXT_PUBLIC_APP_NAME:
    process.env.NEXT_PUBLIC_APP_NAME || "FilmLink",

  // Server-only (undefined in client)
  NODE_ENV: process.env.NODE_ENV || "development",
  AUTH_SECRET: process.env.AUTH_SECRET || "default_dev_secret_change_in_production",
  BACKEND_API_BASE_URL: process.env.BACKEND_API_BASE_URL || "http://localhost:8386/api",
} as const
