import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies"
import { type BackendRole, getRoleFromAccessToken, isBackendRole } from "@/lib/auth/roles"

let refreshInFlight: Promise<BackendRole | null> | null = null

export function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null
  const item = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${ACCESS_TOKEN_COOKIE}=`))
  return item ? decodeURIComponent(item.slice(ACCESS_TOKEN_COOKIE.length + 1)) : null
}

export async function refreshSession(): Promise<BackendRole | null> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      })
      if (!response.ok) return null
      const data = (await response.json()) as { role?: unknown }
      const token = getAccessTokenFromCookie()
      const tokenRole = getRoleFromAccessToken(token)
      return tokenRole ?? (isBackendRole(data.role) ? data.role : null)
    } catch {
      return null
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

export async function postAuth<T>(
  path: string,
  body: unknown
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const response = await fetch(`/api/auth/${path}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify(body),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      const message =
        data && typeof data === "object"
          ? ((data as { detail?: string; message?: string; title?: string }).detail ??
            (data as { message?: string }).message ??
            (data as { title?: string }).title)
          : undefined
      return { ok: false, message: message || "Something went wrong. Please try again." }
    }
    return { ok: true, data: data as T }
  } catch {
    return {
      ok: false,
      message: "Unable to connect to the backend. Check that it is running and try again.",
    }
  }
}
