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
  sameOriginRequest,
  storeSessionCookies,
} from "@/lib/server/auth-bff"

const METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"])
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])
const MAX_JSON_BYTES = 1_000_000
const MAX_LAB_IMAGE_BYTES = 10 * 1024 * 1024

type RouteContext = { params: Promise<{ path: string[] }> }

async function callBackend(
  url: URL,
  method: string,
  accessToken: string,
  contentType: string | null,
  body: BodyInit | undefined
) {
  const headers = new Headers({
    authorization: `Bearer ${accessToken}`,
    accept: "application/json",
  })
  if (contentType) headers.set("content-type", contentType)

  return fetch(url, {
    method,
    headers,
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  })
}

async function proxy(request: NextRequest, context: RouteContext) {
  const method = request.method.toUpperCase()
  if (!METHODS.has(method)) {
    return NextResponse.json({ message: "Phương thức không được hỗ trợ." }, { status: 405 })
  }
  if (WRITE_METHODS.has(method) && !sameOriginRequest(request)) {
    return NextResponse.json(
      { errorCode: "CSRF_REJECTED", message: "Yêu cầu không hợp lệ." },
      { status: 403 }
    )
  }

  const { path } = await context.params
  if (
    !path.length ||
    path.some((part) => !/^[A-Za-z0-9._~-]+$/.test(part) || part === "." || part === "..") ||
    path[0]?.toLowerCase() === "auth"
  ) {
    return NextResponse.json({ message: "Đường dẫn API không hợp lệ." }, { status: 404 })
  }

  const { accessToken, refreshToken } = await getSessionTokens(request)
  if (!accessToken) {
    return NextResponse.json(
      { errorCode: "AUTHENTICATION_REQUIRED", message: "Bạn chưa đăng nhập." },
      { status: 401 }
    )
  }

  let body: BodyInit | undefined
  let contentType: string | null = null
  if (
    WRITE_METHODS.has(method) &&
    (method !== "DELETE" || Number(request.headers.get("content-length") || 0) > 0)
  ) {
    const backendPath = path.join("/")
    if (method === "POST" && backendPath === "film-labs/me/images") {
      const length = Number(request.headers.get("content-length") || 0)
      if (length > MAX_LAB_IMAGE_BYTES + 64 * 1024) {
        return NextResponse.json({ message: "Ảnh không được vượt quá 10 MB." }, { status: 413 })
      }
      let incoming: FormData
      try {
        incoming = await request.formData()
      } catch {
        return NextResponse.json({ message: "Dữ liệu tải ảnh không hợp lệ." }, { status: 400 })
      }
      const file = incoming.get("file")
      if (!(file instanceof File) || file.size === 0 || file.size > MAX_LAB_IMAGE_BYTES) {
        return NextResponse.json(
          { message: "Vui lòng chọn một ảnh JPG hoặc PNG tối đa 10 MB." },
          { status: 400 }
        )
      }
      const outgoing = new FormData()
      outgoing.append("file", file, file.name)
      body = outgoing
    } else {
      const length = Number(request.headers.get("content-length") || 0)
      if (length > MAX_JSON_BYTES) {
        return NextResponse.json({ message: "Request body vượt quá giới hạn." }, { status: 413 })
      }
      contentType = request.headers.get("content-type")
      if (contentType?.toLowerCase().split(";", 1)[0].trim() !== "application/json") {
        return NextResponse.json(
          { message: "BFF hiện chỉ nhận JSON; tải tệp cần endpoint chuyên biệt." },
          { status: 415 }
        )
      }
      body = await request.text()
      if (new TextEncoder().encode(body).byteLength > MAX_JSON_BYTES) {
        return NextResponse.json({ message: "Request body vượt quá giới hạn." }, { status: 413 })
      }
    }
  }

  try {
    const target = apiUrl(`/api/v1/${path.map(encodeURIComponent).join("/")}`)
    target.search = request.nextUrl.search
    let backendResponse = await callBackend(target, method, accessToken, contentType, body)
    let rotatedTokens = null

    if (backendResponse.status === 401 && refreshToken) {
      const refreshResponse = await forwardJson("/api/v1/auth/refresh", { refreshToken })
      const refreshData = await readJson(refreshResponse)
      if (refreshResponse.ok && isTokenPayload(refreshData)) {
        rotatedTokens = refreshData
        backendResponse = await callBackend(
          target,
          method,
          refreshData.accessToken,
          contentType,
          body
        )
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

    const headers = new Headers({ "cache-control": "no-store" })
    for (const header of ["content-type", "content-disposition"]) {
      const value = backendResponse.headers.get(header)
      if (value) headers.set(header, value)
    }
    const response = new NextResponse(
      backendResponse.status === 204 || backendResponse.status === 304
        ? null
        : backendResponse.body,
      { status: backendResponse.status, headers }
    )
    const passwordChanged =
      method === "PUT" && path.join("/") === "accounts/me/password" && backendResponse.ok
    if (passwordChanged) {
      clearSessionCookies(response)
    } else if (rotatedTokens) {
      await storeSessionCookies(response, rotatedTokens)
    }
    return response
  } catch {
    return requestFailed()
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, context)
}
