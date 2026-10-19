import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getRoleFromAccessToken } from "@/lib/auth/roles"
import {
  backendErrorResponse,
  clearSessionCookies,
  isTokenResponse,
  REFRESH_TOKEN_COOKIE,
  requestBackendAuth,
  SESSION_PREFERENCE_COOKIE,
  setSessionCookies,
} from "@/lib/auth/server"

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value
  if (!refreshToken) {
    const result = NextResponse.json(
      { detail: "Session expired. Please sign in again." },
      { status: 401 }
    )
    clearSessionCookies(result)
    return result
  }

  try {
    const { response: backendResponse, data } = await requestBackendAuth("refresh", {
      refreshToken,
    })
    if (!backendResponse.ok) {
      const result = backendErrorResponse(data, backendResponse.status)
      if (backendResponse.status === 401) clearSessionCookies(result)
      return result
    }
    if (!isTokenResponse(data)) {
      return NextResponse.json(
        { detail: "Backend returned an invalid token response" },
        { status: 502 }
      )
    }

    const role = getRoleFromAccessToken(data.accessToken)
    if (!role)
      return NextResponse.json(
        { detail: "The access token has no supported role" },
        { status: 502 }
      )

    const persistent = cookieStore.get(SESSION_PREFERENCE_COOKIE)?.value === "persistent"
    const result = NextResponse.json({ success: true, role })
    setSessionCookies(result, data, persistent)
    return result
  } catch {
    return NextResponse.json({ detail: "Unable to connect to the backend" }, { status: 502 })
  }
}
