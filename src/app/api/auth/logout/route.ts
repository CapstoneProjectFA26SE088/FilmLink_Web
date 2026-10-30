import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  ACCESS_TOKEN_COOKIE,
  clearSessionCookies,
  REFRESH_TOKEN_COOKIE,
  requestBackendAuth,
} from "@/lib/auth/server"

export async function POST() {
  const cookieStore = await cookies()
  let accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
  let refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

  if (refreshToken) {
    try {
      if (!accessToken) {
        const refreshed = await requestBackendAuth("refresh", { refreshToken })
        if (refreshed.response.ok && refreshed.data && typeof refreshed.data === "object") {
          accessToken = (refreshed.data as { accessToken?: string }).accessToken
          refreshToken = (refreshed.data as { refreshToken?: string }).refreshToken ?? refreshToken
        }
      }
      if (accessToken) {
        const logout = await requestBackendAuth("logout", { refreshToken }, accessToken)
        if (logout.response.status === 401) {
          const refreshed = await requestBackendAuth("refresh", { refreshToken })
          if (refreshed.response.ok && refreshed.data && typeof refreshed.data === "object") {
            const tokens = refreshed.data as { accessToken?: string; refreshToken?: string }
            if (tokens.accessToken) {
              await requestBackendAuth(
                "logout",
                { refreshToken: tokens.refreshToken ?? refreshToken },
                tokens.accessToken
              )
            }
          }
        }
      }
    } catch {
      // The local session is cleared even when the backend cannot be reached.
    }
  }

  const result = new NextResponse(null, { status: 204 })
  clearSessionCookies(result)
  return result
}
