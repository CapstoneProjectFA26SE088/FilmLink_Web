import { NextRequest, NextResponse } from "next/server"
import {
  clearSessionCookies,
  csrfRejected,
  forwardJson,
  getSessionTokens,
  isTokenPayload,
  publicBackendError,
  readJson,
  requestFailed,
  sameOriginRequest,
  sessionResponse,
  storeSessionCookies,
} from "@/lib/server/auth-bff"

export async function POST(request: NextRequest) {
  if (!sameOriginRequest(request)) return csrfRejected()

  const { refreshToken } = await getSessionTokens(request)
  if (!refreshToken) {
    const response = NextResponse.json(
      { errorCode: "AUTHENTICATION_REQUIRED", message: "Phiên đăng nhập đã hết hạn." },
      { status: 401 }
    )
    clearSessionCookies(response)
    return response
  }

  try {
    const backendResponse = await forwardJson("/api/v1/auth/refresh", { refreshToken })
    const data = await readJson(backendResponse)
    if (!backendResponse.ok) {
      const response = publicBackendError(backendResponse, data)
      if (backendResponse.status === 401) clearSessionCookies(response)
      return response
    }
    if (!isTokenPayload(data)) return requestFailed()

    const response = sessionResponse(data)
    await storeSessionCookies(response, data)
    return response
  } catch {
    return requestFailed()
  }
}
