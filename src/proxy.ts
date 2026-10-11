import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

/**
 * Public routes that do not require authentication
 */
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/api/auth"]

/**
 * Next.js 16 Proxy / Middleware
 * Executes before requests complete to handle auth guard, security headers & routing.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Skip static assets, Next internals and favicon
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // 2. Authentication Verification (Sample check using auth token cookie)
  const token = request.cookies.get("auth_token")?.value
  const isAuthRoute = PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  // If visiting protected route without token, redirect to login
  const isProtectedRoute = !isAuthRoute && pathname.startsWith("/dashboard")
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If already logged in and visiting login, redirect to home/dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // 3. Security Headers
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
