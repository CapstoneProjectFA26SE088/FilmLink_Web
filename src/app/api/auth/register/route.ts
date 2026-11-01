import { NextRequest, NextResponse } from "next/server"
import {
  apiUrl,
  csrfRejected,
  publicBackendError,
  readJson,
  requestJsonObject,
  requestFailed,
  sameOriginRequest,
  selectRequestFields,
} from "@/lib/server/auth-bff"

const ACCOUNT_FIELDS = [
  "id",
  "email",
  "fullName",
  "phoneNumber",
  "role",
  "status",
  "emailVerifiedAt",
  "createdAt",
]

export async function POST(request: NextRequest) {
  if (!sameOriginRequest(request)) return csrfRejected()

  const requestBody = await requestJsonObject(request)
  if (!requestBody) {
    return NextResponse.json(
      { errorCode: "INVALID_REQUEST", message: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(apiUrl("/api/v1/auth/register"), {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(
        selectRequestFields(requestBody, [
          "email",
          "password",
          "fullName",
          "phoneNumber",
          "termsAccepted",
        ])
      ),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    })
    const data = await readJson(response)

    if (!response.ok) return publicBackendError(response, data)

    const account = Object.fromEntries(
      ACCOUNT_FIELDS.filter((key) => data[key] !== undefined).map((key) => [key, data[key]])
    )
    return NextResponse.json(account, {
      status: response.status,
      headers: { "cache-control": "no-store" },
    })
  } catch {
    return requestFailed()
  }
}
