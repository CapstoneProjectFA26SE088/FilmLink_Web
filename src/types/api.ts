/**
 * Shared API and Data Contracts
 */

export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  status: number
  success: boolean
}

export interface ApiErrorDetails {
  message: string
  status: number
  code?: string
  details?: unknown
}

export interface UserSession {
  id: string
  email: string
  name?: string
  role?: "user" | "admin"
  avatarUrl?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}
