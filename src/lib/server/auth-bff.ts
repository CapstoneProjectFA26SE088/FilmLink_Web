import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"

const production = process.env.NODE_ENV === "production"
const secureCookies =
  production || process.env.AUTH_COOKIE_SECURE?.toLowerCase() === "true"

export const SESSION_COOKIE = production
  ? "__Host-filmlink_session"
  : "filmlink_session"
export const LEGACY_ACCESS_COOKIE = production
  ? "__Host-filmlink_access"
  : "filmlink_access"
export const LEGACY_REFRESH_COOKIE = production
  ? "__Host-filmlink_refresh"
  : "filmlink_refresh"
const OLDER_REFRESH_COOKIE = "filmlink_refresh_token"

const DEFAULT_REFRESH_MAX_AGE = 7 * 24 * 60 * 60
const SESSION_IV_BYTES = 12

export type TokenPayload = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

type SessionPayload = Pick<TokenPayload, "accessToken" | "refreshToken" | "expiresIn">

function sessionEncryptionKey() {
  const encodedKey = process.env.AUTH_SESSION_ENCRYPTION_KEY
  if (!encodedKey) {
    throw new Error("Cần cấu hình AUTH_SESSION_ENCRYPTION_KEY phía server.")
  }

  const key = Buffer.from(encodedKey, "base64")
  if (key.byteLength !== 32) {
    throw new Error("AUTH_SESSION_ENCRYPTION_KEY phải là Base64 của đúng 32 byte.")
  }
  return key
}

function encryptSession(payload: SessionPayload) {
  const iv = randomBytes(SESSION_IV_BYTES)
  const cipher = createCipheriv("aes-256-gcm", sessionEncryptionKey(), iv)
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  return ["v1", iv.toString("base64url"), tag.toString("base64url"), ciphertext.toString("base64url")].join(".")
}

function decryptSession(value: string | undefined): SessionPayload | null {
  if (!value) return null
  try {
    const [version, encodedIv, encodedTag, encodedCiphertext, extra] = value.split(".")
    if (version !== "v1" || !encodedIv || !encodedTag || !encodedCiphertext || extra) {
      return null
    }
    const decipher = createDecipheriv(
      "aes-256-gcm",
      sessionEncryptionKey(),
      Buffer.from(encodedIv, "base64url")
    )
    decipher.setAuthTag(Buffer.from(encodedTag, "base64url"))
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(encodedCiphertext, "base64url")),
      decipher.final(),
    ]).toString("utf8")
    const parsed: unknown = JSON.parse(plaintext)
    if (!parsed || typeof parsed !== "object") return null
    const candidate = parsed as Record<string, unknown>
    if (
      typeof candidate.accessToken !== "string" ||
      typeof candidate.refreshToken !== "string" ||
      typeof candidate.expiresIn !== "number"
    ) {
      return null
    }
    return candidate as SessionPayload
  } catch {
    return null
  }
}

export function apiUrl(path: string) {
  const base =
    process.env.FILMLINK_API_BASE_URL ||
    (production ? "" : "http://localhost:8080")
  if (!base) throw new Error("Cần cấu hình FILMLINK_API_BASE_URL ở server.")
  let url: URL

  try {
    url = new URL(base)
  } catch {
    throw new Error("FILMLINK_API_BASE_URL phải là URL hợp lệ.")
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error("FILMLINK_API_BASE_URL có cấu hình không hợp lệ.")
  }

  const prefix = url.pathname.replace(/\/+$/, "")
  url.pathname = `${prefix}${path.startsWith("/") ? path : `/${path}`}`
  return url
}

export function sameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin")
  return origin !== null && origin === request.nextUrl.origin
}

export function csrfRejected() {
  return NextResponse.json(
    { errorCode: "CSRF_REJECTED", message: "Yêu cầu không hợp lệ." },
    { status: 403, headers: { "cache-control": "no-store" } }
  )
}

export async function forwardJson(path: string, body: unknown) {
  return fetch(apiUrl(path), {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  })
}

export async function requestJsonObject(request: Request) {
  const mediaType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase()
  if (mediaType !== "application/json") {
    return null
  }
  const contentLength = Number(request.headers.get("content-length") || 0)
  if (contentLength > 64_000) return null

  try {
    const text = await request.text()
    if (new TextEncoder().encode(text).byteLength > 64_000) return null
    const value: unknown = JSON.parse(text)
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

export function selectRequestFields(
  value: Record<string, unknown>,
  allowedFields: string[]
) {
  return Object.fromEntries(
    allowedFields
      .filter((field) => value[field] !== undefined)
      .map((field) => [field, value[field]])
  )
}

export async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json()
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {}
  } catch {
    return {}
  }
}

export function publicBackendError(
  response: Response,
  body: Record<string, unknown>
) {
  const safeBody: Record<string, unknown> = {}

  if (response.status >= 500) {
    safeBody.errorCode = "SERVICE_UNAVAILABLE"
    safeBody.message = "Dịch vụ đang gặp sự cố. Vui lòng thử lại sau."
  } else {
    for (const key of ["errorCode", "messageCode", "message", "errors"]) {
      if (body[key] !== undefined) safeBody[key] = body[key]
    }
    if (!safeBody.message && typeof body.detail === "string") {
      safeBody.message = body.detail
    }
    if (!safeBody.message) safeBody.message = "Yêu cầu chưa thể thực hiện."
  }

  return NextResponse.json(safeBody, {
    status: response.status,
    headers: { "cache-control": "no-store" },
  })
}

export function requestFailed() {
  return NextResponse.json(
    {
      errorCode: "BACKEND_UNAVAILABLE",
      message: "Không kết nối được máy chủ. Vui lòng thử lại sau.",
    },
    { status: 502, headers: { "cache-control": "no-store" } }
  )
}

function refreshMaxAge() {
  const configured = Number(process.env.AUTH_REFRESH_COOKIE_MAX_AGE_SECONDS)
  return Number.isSafeInteger(configured) && configured > 0
    ? configured
    : DEFAULT_REFRESH_MAX_AGE
}

export async function storeSessionCookies(
  response: NextResponse,
  tokens: TokenPayload
) {
  if (
    !tokens.accessToken ||
    !tokens.refreshToken ||
    !Number.isSafeInteger(Math.floor(tokens.expiresIn)) ||
    tokens.expiresIn <= 0
  ) {
    throw new Error("Backend trả về cặp token không hợp lệ.")
  }

  const common = {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "lax" as const,
    path: "/",
  }

  response.cookies.set(SESSION_COOKIE, encryptSession(tokens), {
    ...common,
    maxAge: refreshMaxAge(),
  })
  clearLegacyAuthCookies(response)
}

function clearLegacyAuthCookies(response: NextResponse) {
  const common = {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "lax" as const,
    path: "/",
  }

  response.cookies.set(LEGACY_ACCESS_COOKIE, "", { ...common, maxAge: 0 })
  response.cookies.set(LEGACY_REFRESH_COOKIE, "", { ...common, maxAge: 0 })
  response.cookies.set(OLDER_REFRESH_COOKIE, "", { ...common, maxAge: 0 })
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  clearLegacyAuthCookies(response)
}

export async function getSessionTokens(request?: NextRequest) {
  const store = request?.cookies ?? (await cookies())
  const sealedSession = decryptSession(store.get(SESSION_COOKIE)?.value)
  if (sealedSession) return sealedSession

  return {
    accessToken: store.get(LEGACY_ACCESS_COOKIE)?.value,
    refreshToken: store.get(LEGACY_REFRESH_COOKIE)?.value,
  }
}

export function getOlderRefreshToken(request: NextRequest) {
  return request.cookies.get(OLDER_REFRESH_COOKIE)?.value
}

export function isTokenPayload(value: Record<string, unknown>): value is TokenPayload {
  return (
    typeof value.accessToken === "string" &&
    typeof value.refreshToken === "string" &&
    typeof value.expiresIn === "number"
  )
}

export function sessionResponse(tokens: TokenPayload) {
  return NextResponse.json({
    authenticated: true,
    expiresIn: tokens.expiresIn,
  }, { headers: { "cache-control": "no-store" } })
}
