import { NextRequest, NextResponse } from "next/server"
import {
  csrfRejected,
  forwardJson,
  publicBackendError,
  readJson,
  requestJsonObject,
  requestFailed,
  sameOriginRequest,
  selectRequestFields,
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
      "/api/v1/auth/resend-otp",
      selectRequestFields(body, ["email", "purpose"])
    )
    if (!backendResponse.ok) {
      return publicBackendError(backendResponse, await readJson(backendResponse))
    }
    return new NextResponse(null, { status: backendResponse.status })
  } catch {
    return requestFailed()
  }
}
