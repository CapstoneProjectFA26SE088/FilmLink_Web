import { type NextRequest, NextResponse } from "next/server"
import { getRoleFromAccessToken } from "@/lib/auth/roles"
import {
  backendErrorResponse,
  isTokenResponse,
  requestBackendAuth,
  setSessionCookies,
} from "@/lib/auth/server"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown
    password?: unknown
    keepSignedIn?: unknown
  } | null
  if (typeof body?.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ detail: "Email and password are required" }, { status: 400 })
  }

  try {
    const { response: backendResponse, data } = await requestBackendAuth("login", {
      email: body.email,
      password: body.password,
    })
    if (!backendResponse.ok) return backendErrorResponse(data, backendResponse.status)
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

    const result = NextResponse.json({ success: true, role })
    setSessionCookies(result, data, body.keepSignedIn === true)
    return result
  } catch {
    return NextResponse.json({ detail: "Unable to connect to the backend" }, { status: 502 })
  }
}
