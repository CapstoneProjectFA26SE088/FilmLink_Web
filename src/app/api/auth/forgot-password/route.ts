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
  if (!body || typeof body.email !== "string") {
    return NextResponse.json({ message: "Email không hợp lệ." }, { status: 400 })
  }
  try {
    const response = await forwardJson("/api/v1/auth/forgot-password", { email: body.email })
    if (!response.ok) return publicBackendError(response, await readJson(response))
    return new NextResponse(null, { status: 204, headers: { "cache-control": "no-store" } })
  } catch {
    return requestFailed()
  }
}
