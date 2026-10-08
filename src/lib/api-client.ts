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

/**
 * Enterprise typed fetch client
 * - Automatic JSON parsing & serialization
 * - Timeout handling via AbortController
 * - Unified error normalization
 * - Standardized headers
 */
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, body, timeoutMs = 15000, headers, ...customConfig } = options

  // 1. Build URL with query params
  const baseUrl = endpoint.startsWith("http")
    ? ""
    : env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  const url = new URL(baseUrl ? `${baseUrl}/${endpoint.replace(/^\//, "")}` : endpoint)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  // 2. Setup Timeout Controller
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  // 3. Prepare Headers and Body
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData
  const requestHeaders = new Headers(headers)

  if (!isFormData && body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json")
  }
  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json")
  }

  try {
    const response = await fetch(url.toString(), {
      ...customConfig,
      headers: requestHeaders,
      signal: controller.signal,
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    })

    clearTimeout(timeoutId)

    // Parse Response
    const contentType = response.headers.get("content-type")
    const isJson = contentType && contentType.includes("application/json")
    const responseData = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const errorMessage =
        (typeof responseData === "object" && responseData !== null && "message" in responseData
          ? (responseData as { message: string }).message
          : response.statusText) || "Request failed"

      throw new ApiError(errorMessage, response.status, undefined, responseData)
    }

    return {
      data: responseData as T,
      error: null,
      status: response.status,
      success: true,
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiError) {
      return {
        data: null,
        error: error.message,
        status: error.status,
        success: false,
      }
    }

    if (error instanceof Error && error.name === "AbortError") {
      return {
        data: null,
        error: `Request timed out after ${timeoutMs}ms`,
        status: 408,
        success: false,
      }
    }

    const message = error instanceof Error ? error.message : "Network error"
    return {
      data: null,
      error: message,
      status: 500,
      success: false,
    }
  }
}

/** Convenience HTTP methods */
export const api = {
  get: <T>(url: string, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: "POST", body }),
  put: <T>(url: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: "PUT", body }),
  patch: <T>(url: string, body?: unknown, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: "PATCH", body }),
  delete: <T>(url: string, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: "DELETE" }),
}
