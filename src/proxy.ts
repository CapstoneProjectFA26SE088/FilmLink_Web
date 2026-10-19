import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookies"
import { canRoleAccessPath, getRoleFromAccessToken, getRoleHome } from "@/lib/auth/roles"

const AUTH_PATHS = new Set(["/login", "/register"])

function isProtectedPath(pathname: string) {
  return ["/feed", "/search", "/film-lab-owner", "/admin", "/mod"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  return response
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    /\.(?:avif|css|gif|ico|jpeg|jpg|js|png|svg|webp|woff2?)$/i.test(pathname)
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/auth/")) return NextResponse.next()

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const hasRefreshToken = Boolean(request.cookies.get(REFRESH_TOKEN_COOKIE)?.value)
  const role = getRoleFromAccessToken(accessToken)

  if (AUTH_PATHS.has(pathname) && role) {
    return withSecurityHeaders(NextResponse.redirect(new URL(getRoleHome(role), request.url)))
  }

  if (isProtectedPath(pathname)) {
    if (!role && !hasRefreshToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("from", `${pathname}${request.nextUrl.search}`)
      return withSecurityHeaders(NextResponse.redirect(loginUrl))
    }

    // The access token is short lived; client guards can use the HttpOnly refresh cookie.
    if (!role) return withSecurityHeaders(NextResponse.next())

    if (!canRoleAccessPath(role, pathname)) {
      return withSecurityHeaders(NextResponse.redirect(new URL(getRoleHome(role), request.url)))
    }
  }

  return withSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
