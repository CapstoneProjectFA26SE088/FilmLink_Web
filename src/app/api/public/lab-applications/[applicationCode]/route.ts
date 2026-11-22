import { NextResponse } from "next/server"
import {
  apiUrl,
  publicBackendError,
  readJson,
  requestFailed,
} from "@/lib/server/auth-bff"

type RouteContext = { params: Promise<{ applicationCode: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { applicationCode } = await context.params
  if (!/^[A-Za-z0-9]+$/.test(applicationCode)) {
    return NextResponse.json({ message: "Mã hồ sơ không hợp lệ." }, { status: 400 })
  }

  try {
    const response = await fetch(
      apiUrl(`/api/v1/public/lab-applications/${encodeURIComponent(applicationCode)}`),
      {
        headers: { accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      },
    )
    if (!response.ok) return publicBackendError(response, await readJson(response))
    const contentType = response.headers.get("content-type") || "application/json"
    return new NextResponse(response.body, {
      status: response.status,
      headers: { "cache-control": "no-store", "content-type": contentType },
    })
  } catch {
    return requestFailed()
  }
}
