import { NextRequest, NextResponse } from "next/server"
import {
  csrfRejected,
  forwardJson,
  isTokenPayload,
  publicBackendError,
  readJson,
  requestJsonObject,
  requestFailed,
  sameOriginRequest,
  selectRequestFields,
  sessionResponse,
  storeSessionCookies,
} from "@/lib/server/auth-bff"

export async function POST(request: NextRequest) {
  if (!sameOriginRequest(request)) return csrfRejected()

  const body = await requestJsonObject(request)
  if (!body) {
    return NextResponse.json(
      { errorCode: "INVALID_REQUEST", message: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 }
    )
  }

  try {
    const backendResponse = await forwardJson(
      "/api/v1/auth/login",
      selectRequestFields(body, ["email", "password"])
    )
    const data = await readJson(backendResponse)
    if (!backendResponse.ok) return publicBackendError(backendResponse, data)
    if (!isTokenPayload(data)) return requestFailed()

    const response = sessionResponse(data)
    await storeSessionCookies(response, data)
    return response
  } catch {
    return requestFailed()
  }
}
