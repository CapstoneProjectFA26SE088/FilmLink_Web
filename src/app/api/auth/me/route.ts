import { NextRequest, NextResponse } from "next/server"
import {
  apiUrl,
  clearSessionCookies,
  forwardJson,
  getSessionTokens,
  isTokenPayload,
  publicBackendError,
  readJson,
  requestFailed,
  storeSessionCookies,
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

async function getAccount(accessToken: string) {
  return fetch(apiUrl("/api/v1/accounts/me"), {
    headers: { authorization: `Bearer ${accessToken}`, accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  })
}

export async function GET(_request: NextRequest) {
  const tokens = await getSessionTokens()
  if (!tokens.accessToken) {
    return NextResponse.json(
      { errorCode: "AUTHENTICATION_REQUIRED", message: "Bạn chưa đăng nhập." },
      { status: 401 }
    )
  }

  try {
    let backendResponse = await getAccount(tokens.accessToken)
    let rotatedTokens = null

    if (backendResponse.status === 401 && tokens.refreshToken) {
      const refreshResponse = await forwardJson("/api/v1/auth/refresh", {
        refreshToken: tokens.refreshToken,
      })
      const refreshData = await readJson(refreshResponse)

      if (refreshResponse.ok && isTokenPayload(refreshData)) {
        rotatedTokens = refreshData
        backendResponse = await getAccount(refreshData.accessToken)
      } else {
        const response = publicBackendError(refreshResponse, refreshData)
        if (refreshResponse.status === 401) clearSessionCookies(response)
        return response
      }
    }

    if (!backendResponse.ok) {
      const response = publicBackendError(backendResponse, await readJson(backendResponse))
      if (backendResponse.status === 401) clearSessionCookies(response)
      if (rotatedTokens && backendResponse.status !== 401) {
        await storeSessionCookies(response, rotatedTokens)
      }
      return response
    }

    const data = await readJson(backendResponse)
    const account = Object.fromEntries(
      ACCOUNT_FIELDS.filter((key) => data[key] !== undefined).map((key) => [key, data[key]])
    )
    const response = NextResponse.json(account, {
      headers: { "cache-control": "no-store" },
    })
    if (rotatedTokens) await storeSessionCookies(response, rotatedTokens)
    return response
  } catch {
    return requestFailed()
  }
}
