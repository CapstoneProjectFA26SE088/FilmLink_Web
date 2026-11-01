import { NextRequest, NextResponse } from "next/server"
import {
  apiUrl,
  clearSessionCookies,
  csrfRejected,
  forwardJson,
  getOlderRefreshToken,
  getSessionTokens,
  isTokenPayload,
  readJson,
} from "@/lib/server/auth-bff"

export async function POST(request: NextRequest) {
  if (!request.headers.get("origin") || request.headers.get("origin") !== request.nextUrl.origin) {
    return csrfRejected()
  }

  const tokens = await getSessionTokens(request)
  const accessToken = tokens.accessToken
  const refreshToken = tokens.refreshToken
  const olderRefreshToken = getOlderRefreshToken(request)

  async function callLogout(token: string, bearer: string) {
    return fetch(apiUrl("/api/v1/auth/logout"), {
      method: "POST",
      headers: {
        authorization: `Bearer ${bearer}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    })
  }

  async function rotateAndRevoke(token: string) {
    const refreshResponse = await forwardJson("/api/v1/auth/refresh", {
      refreshToken: token,
    })
    const refreshed = await readJson(refreshResponse)
    if (refreshResponse.ok && isTokenPayload(refreshed)) {
      await callLogout(refreshed.refreshToken, refreshed.accessToken)
    }
  }

  try {
    if (accessToken && refreshToken) {
      const logoutResponse = await callLogout(refreshToken, accessToken)
      if (logoutResponse.status === 401) await rotateAndRevoke(refreshToken)
    } else if (refreshToken) {
      await rotateAndRevoke(refreshToken)
    }

    if (olderRefreshToken && olderRefreshToken !== refreshToken) {
      await rotateAndRevoke(olderRefreshToken)
    }
  } catch {
    // Xóa cookie phía trình duyệt cả khi backend tạm thời không phản hồi.
  }

  const response = new NextResponse(null, { status: 204 })
  clearSessionCookies(response)
  return response
}
