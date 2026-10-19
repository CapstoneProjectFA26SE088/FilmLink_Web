import { NextResponse } from "next/server"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_PREFERENCE_COOKIE,
} from "@/lib/auth/cookies"
import { env } from "@/lib/env"

export {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_PREFERENCE_COOKIE,
} from "@/lib/auth/cookies"

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60

export interface BackendTokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export async function requestBackendAuth(path: string, body: unknown, accessToken?: string) {
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  })
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)

  const response = await fetch(
    `${env.BACKEND_API_BASE_URL.replace(/\/$/, "")}/api/v1/auth/${path}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    }
  )
  const contentType = response.headers.get("content-type") ?? ""
  const data = contentType.includes("json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "")
  return { response, data }
}

export function setSessionCookies(
  response: NextResponse,
  tokens: BackendTokenResponse,
  persistent: boolean
) {
  const secure = env.NODE_ENV === "production"
  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: Math.max(1, Number(tokens.expiresIn) || 900),
  })
  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    ...(persistent ? { maxAge: REFRESH_TOKEN_MAX_AGE } : {}),
  })
  response.cookies.set(SESSION_PREFERENCE_COOKIE, persistent ? "persistent" : "session", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    ...(persistent ? { maxAge: REFRESH_TOKEN_MAX_AGE } : {}),
  })
}

export function clearSessionCookies(response: NextResponse) {
  const secure = env.NODE_ENV === "production"
  for (const name of [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SESSION_PREFERENCE_COOKIE]) {
    response.cookies.set(name, "", {
      httpOnly: name !== ACCESS_TOKEN_COOKIE,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 0,
    })
  }
}

export function backendErrorResponse(data: unknown, status: number) {
  return NextResponse.json(data ?? { detail: "Backend request failed" }, { status })
}

export function isTokenResponse(value: unknown): value is BackendTokenResponse {
  if (!value || typeof value !== "object") return false
  const tokens = value as Partial<BackendTokenResponse>
  return (
    typeof tokens.accessToken === "string" &&
    typeof tokens.refreshToken === "string" &&
    typeof tokens.expiresIn === "number"
  )
}
