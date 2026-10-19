import { type NextRequest, NextResponse } from "next/server"
import { requestBackendAuth } from "@/lib/auth/server"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown
    password?: unknown
    fullName?: unknown
    phoneNumber?: unknown
    termsAccepted?: unknown
  } | null
  if (
    typeof body?.email !== "string" ||
    typeof body.password !== "string" ||
    typeof body.fullName !== "string" ||
    body.termsAccepted !== true
  ) {
    return NextResponse.json(
      { detail: "Name, email, password, and accepted terms are required" },
      { status: 400 }
    )
  }

  try {
    const { response, data } = await requestBackendAuth("register", {
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      ...(typeof body.phoneNumber === "string" && body.phoneNumber
        ? { phoneNumber: body.phoneNumber }
        : {}),
      termsAccepted: true,
    })
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ detail: "Unable to connect to the backend" }, { status: 502 })
  }
}
