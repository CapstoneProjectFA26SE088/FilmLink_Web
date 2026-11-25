import { NextRequest, NextResponse } from "next/server"
import {
  apiUrl,
  publicBackendError,
  readJson,
  requestFailed,
} from "@/lib/server/auth-bff"

type RouteContext = { params: Promise<{ path: string[] }> }

function validPath(path: string[]) {
  return path.length > 0 && path.every((part) => /^[A-Za-z0-9._~-]+$/.test(part))
}

function allowedGetPath(path: string[]) {
  const joined = path.join("/")
  return (
    joined === "film-processes" ||
    joined === "film-formats" ||
    joined === "service-types" ||
    joined === "film-stocks" ||
    joined === "film-labs" ||
    /^film-labs\/\d+$/.test(joined)
  )
}

function backendPath(path: string[]) {
  const joined = path.join("/")
  return joined === "film-labs" || joined.startsWith("film-labs/")
    ? `public/${joined}`
    : joined
}

async function backendResponse(response: Response) {
  if (!response.ok) return publicBackendError(response, await readJson(response))

  const headers = new Headers({ "cache-control": "no-store" })
  const contentType = response.headers.get("content-type")
  if (contentType) headers.set("content-type", contentType)
  return new NextResponse(response.status === 204 ? null : response.body, {
    status: response.status,
    headers,
  })
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  if (!validPath(path) || !allowedGetPath(path)) {
    return NextResponse.json({ message: "Đường dẫn API công khai không hợp lệ." }, { status: 404 })
  }

  try {
    const target = apiUrl(`/api/v1/${backendPath(path.map(encodeURIComponent))}`)
    target.search = request.nextUrl.search
    const response = await fetch(target, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    })
    return backendResponse(response)
  } catch {
    return requestFailed()
  }
}
