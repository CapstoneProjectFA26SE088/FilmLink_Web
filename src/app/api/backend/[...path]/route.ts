import { NextRequest, NextResponse } from "next/server"
import { validDamageNote } from "@/lib/roll-damage"
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
const MAX_ORDER_MULTIPART_BYTES = 50 * 1024 * 1024
const HANDOVER_IMAGE_TYPES = new Set(["image/jpeg", "image/png"])
const SCAN_IMAGE_TYPES = new Set(["image/jpeg"])
const PAYOUT_RECEIPT_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"])

type RouteContext = { params: Promise<{ path: string[] }> }
type OrderUpload = "receipt" | "scans" | "film-return" | "damage"

function orderUploadFor(path: string): OrderUpload | null {
  if (/^lab\/orders\/\d+\/rolls\/\d+\/damage$/.test(path)) return "damage"
  if (/^lab\/orders\/\d+\/rolls\/\d+\/scans$/.test(path)) return "scans"
  const action = /^lab\/orders\/\d+\/(receipt|film-return)$/.exec(path)?.[1]
  return action === "receipt" || action === "film-return" ? action : null
}

function uploadError(message: string, status = 400) {
  return NextResponse.json({ message }, { status })
}

function invalidFiles(files: FormDataEntryValue[], maxBytes: number, types: Set<string>) {
  return files.some((item) =>
    !(item instanceof File) || item.size === 0 || item.size > maxBytes || !types.has(item.type)
  )
}

async function prepareOrderMultipart(request: NextRequest, action: OrderUpload) {
  const contentType = request.headers.get("content-type")
  if (contentType?.split(";", 1)[0].trim().toLowerCase() !== "multipart/form-data") {
    return uploadError("Yêu cầu tải ảnh phải dùng multipart/form-data.", 415)
  }
  // Damage reports allow ten 10 MiB photos plus the JSON part and multipart framing.
  const maxBytes = action === "damage" ? 10 * MAX_LAB_IMAGE_BYTES + 1024 * 1024 : MAX_ORDER_MULTIPART_BYTES
  const tooLarge = () => uploadError(`Tổng dung lượng tải lên không được vượt quá ${maxBytes / 1024 / 1024} MB.`, 413)
  if (Number(request.headers.get("content-length")) > maxBytes) return tooLarge()
  if (!request.body) return uploadError("Dữ liệu tải lên không hợp lệ.")

  let incoming: FormData
  let count = 0
  const limitedBody = request.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      count += chunk.byteLength
      if (count > maxBytes) controller.error(new Error("Upload limit exceeded"))
      else controller.enqueue(chunk)
    },
  }))
  try {
    incoming = await new Response(limitedBody, { headers: { "content-type": contentType } }).formData()
  } catch {
    return count > maxBytes ? tooLarge() : uploadError("Dữ liệu tải lên không hợp lệ.")
  }

  if (action === "scans") {
    const files = incoming.getAll("files")
    if ([...incoming.keys()].some((key) => key !== "files")) {
      return uploadError("Trường tải ảnh scan không hợp lệ.")
    }
    if (files.length < 1 || files.length > 40 || invalidFiles(files, 5 * 1024 * 1024, SCAN_IMAGE_TYPES)) {
      return uploadError("Chọn 1–40 ảnh JPEG, tối đa 5 MB mỗi ảnh.")
    }
    return incoming
  }

  const data = incoming.get("data")
  if (
    !(data instanceof File) || data.type.split(";", 1)[0] !== "application/json"
    || data.size === 0 || data.size > 64_000 || incoming.getAll("data").length !== 1
    || [...incoming.keys()].some((key) => key !== "data" && key !== "photos")
  ) {
    return uploadError("Phần data JSON không hợp lệ.")
  }
  let metadata: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(await data.text())
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return uploadError("Phần data JSON không hợp lệ.")
    }
    metadata = parsed as Record<string, unknown>
  } catch {
    return uploadError("Phần data JSON không hợp lệ.")
  }
  if (action === "damage" && !validDamageNote(metadata.damageNote)) {
    return uploadError("Mô tả tình trạng hỏng phải có từ 1 đến 500 ký tự.")
  }
  const photos = incoming.getAll("photos")
  const needsPhotos = action === "receipt" || action === "damage" || metadata.keepNegativesAtLab === false
  if (
    (needsPhotos && photos.length === 0) || photos.length > 10
    || invalidFiles(photos, MAX_LAB_IMAGE_BYTES, HANDOVER_IMAGE_TYPES)
  ) {
    return uploadError("Chọn từ 1–10 ảnh bằng chứng JPG/PNG, tối đa 10 MB mỗi ảnh.")
  }
  return incoming
}

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
    const orderUpload = method === "POST" ? orderUploadFor(backendPath) : null
    if (orderUpload) {
      const prepared = await prepareOrderMultipart(request, orderUpload)
      if (prepared instanceof NextResponse) return prepared
      body = prepared
    } else if (method === "POST" && /^admin\/payouts\/\d+\/paid$/.test(backendPath)) {
      const length = Number(request.headers.get("content-length") || 0)
      if (length > MAX_LAB_IMAGE_BYTES + 64 * 1024) {
        return NextResponse.json({ message: "Biên lai không được vượt quá 10 MB." }, { status: 413 })
      }
      let incoming: FormData
      try {
        incoming = await request.formData()
      } catch {
        return NextResponse.json({ message: "Dữ liệu tải biên lai không hợp lệ." }, { status: 400 })
      }
      const receipt = incoming.get("receipt")
      if (!(receipt instanceof File) || receipt.size === 0) {
        return NextResponse.json(
          { message: "Vui lòng chọn tệp biên lai chi trả (JPG, PNG hoặc PDF)." },
          { status: 400 }
        )
      }
      if (receipt.size > MAX_LAB_IMAGE_BYTES) {
        return NextResponse.json({ message: "Biên lai không được vượt quá 10 MB." }, { status: 413 })
      }
      if (!PAYOUT_RECEIPT_TYPES.has(receipt.type)) {
        return NextResponse.json(
          { message: "Biên lai chỉ nhận tệp JPG, PNG hoặc PDF." },
          { status: 400 }
        )
      }
      const outgoing = new FormData()
      outgoing.append("receipt", receipt, receipt.name)
      body = outgoing
    } else if (method === "POST" && backendPath === "film-labs/me/images") {
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
