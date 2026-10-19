import { errorResponse, successResponse } from "@/lib/api-response"

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET() {
  try {
    return successResponse({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Service Unavailable"
    return errorResponse(message, 503)
  }
}
