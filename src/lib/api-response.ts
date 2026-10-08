import { NextResponse } from "next/server"
import type { ApiResponse } from "@/types/api"

/**
 * Standardized Success Response Helper
 */
export function successResponse<T>(data: T, status = 200) {
  const body: ApiResponse<T> = {
    data,
    error: null,
    status,
    success: true,
  }
  return NextResponse.json(body, { status })
}

/**
 * Standardized Error Response Helper
 */
export function errorResponse(message: string, status = 400) {
  const body: ApiResponse<null> = {
    data: null,
    error: message,
    status,
    success: false,
  }
  return NextResponse.json(body, { status })
}
