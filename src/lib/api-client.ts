import { getAccessTokenFromCookie, refreshSession } from "@/lib/auth/client"
import { env } from "@/lib/env"
import type { ApiResponse } from "@/types/api"

export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.details = details
  }
}

export interface FetchOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>
  body?: unknown
  timeoutMs?: number
}

function errorMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object") {
    const body = data as { detail?: unknown; message?: unknown; title?: unknown }
    for (const value of [body.detail, body.message, body.title]) {
      if (typeof value === "string" && value.trim()) return value
    }
  }
  return fallback || "Request failed"
}

async function readResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return null
  const text = await response.text()
  if (!text) return null
  if (response.headers.get("content-type")?.includes("json")) {
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }
  return text
}

function isAuthEndpoint(pathname: string) {
  return pathname.includes("/api/auth/") || pathname.includes("/api/v1/auth/")
}

function redirectToLogin() {
  if (typeof window === "undefined") return
  const pathname = window.location.pathname
  const isProtectedPath = ["/feed", "/search", "/film-lab-owner", "/admin", "/mod"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
  if (!isProtectedPath) return
  const from = encodeURIComponent(`${pathname}${window.location.search}`)
  window.location.assign(`/login?from=${from}`)
}

/** Typed fetch client with bearer auth and one reactive refresh/retry on 401. */
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, body, timeoutMs = 15000, headers, ...customConfig } = options
  const baseUrl = endpoint.startsWith("http") ? "" : env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  const url = new URL(baseUrl ? `${baseUrl}/${endpoint.replace(/^\//, "")}` : endpoint)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.append(key, String(value))
    })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData
  const requestHeaders = new Headers(headers)
  if (!isFormData && body !== undefined && body !== null && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json")
  }
  if (!requestHeaders.has("Accept")) requestHeaders.set("Accept", "application/json")

  const performRequest = (token?: string | null) => {
    const attemptHeaders = new Headers(requestHeaders)
    if (token && !attemptHeaders.has("Authorization"))
      attemptHeaders.set("Authorization", `Bearer ${token}`)
    return fetch(url.toString(), {
      ...customConfig,
      headers: attemptHeaders,
      signal: controller.signal,
      body: isFormData
        ? (body as FormData)
        : body === undefined || body === null
          ? undefined
          : JSON.stringify(body),
    })
  }

  try {
    const accessToken = getAccessTokenFromCookie()
    let response = await performRequest(accessToken)

    if (response.status === 401 && !isAuthEndpoint(url.pathname)) {
      const role = await refreshSession()
      if (role) {
        response = await performRequest(getAccessTokenFromCookie())
      } else {
        redirectToLogin()
      }
    }

    const responseData = await readResponse(response)
    if (!response.ok) {
      const message = errorMessage(responseData, response.statusText)
      throw new ApiError(message, response.status, undefined, responseData)
    }

    return {
      data: responseData as T,
      error: null,
      status: response.status,
      success: true,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return { data: null, error: error.message, status: error.status, success: false }
    }
    if (error instanceof Error && error.name === "AbortError") {
      return {
        data: null,
        error: `Request timed out after ${timeoutMs}ms`,
        status: 408,
        success: false,
      }
    }
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 500,
      success: false,
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

export const api = {
  get: <T>(url: string, options?: FetchOptions) => apiClient<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: "POST", body }),
  put: <T>(url: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: "PUT", body }),
  patch: <T>(url: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: "PATCH", body }),
  delete: <T>(url: string, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: "DELETE" }),
}
