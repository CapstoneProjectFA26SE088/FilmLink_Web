import { NextRequest, NextResponse } from "next/server"
import {
  csrfRejected,
  forwardJson,
  publicBackendError,
  readJson,
  requestFailed,
  requestJsonObject,
  sameOriginRequest,
} from "@/lib/server/auth-bff"

export async function POST(request: NextRequest) {
  if (!sameOriginRequest(request)) return csrfRejected()
  const body = await requestJsonObject(request)
  if (!body || typeof body.email !== "string" || typeof body.otp !== "string") {
    return NextResponse.json({ message: "Email hoặc OTP không hợp lệ." }, { status: 400 })
  }
  try {
    const response = await forwardJson("/api/v1/auth/verify-password-reset-otp", {
      email: body.email,
      otp: body.otp,
    })
    const data = await readJson(response)
    if (!response.ok) return publicBackendError(response, data)
    if (typeof data.resetToken !== "string") return requestFailed()
    return NextResponse.json(
      { resetToken: data.resetToken },
      { status: 200, headers: { "cache-control": "no-store" } },
    )
  } catch {
    return requestFailed()
  }
}
