export const BACKEND_ROLES = [
  "PHOTOGRAPHER",
  "PHOTOGRAPHY_EXPERT",
  "FILM_LAB_OWNER",
  "MODERATOR",
  "ADMIN",
] as const

export type BackendRole = (typeof BACKEND_ROLES)[number]

export function isBackendRole(value: unknown): value is BackendRole {
  return typeof value === "string" && BACKEND_ROLES.includes(value as BackendRole)
}

export function getRoleFromAccessToken(token: string | undefined | null): BackendRole | null {
  if (!token) return null

  try {
    const payload = token.split(".")[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    const decoded = new TextDecoder().decode(
      Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
    )
    const claims = JSON.parse(decoded) as { role?: unknown }
    return isBackendRole(claims.role) ? claims.role : null
  } catch {
    return null
  }
}

export function getRoleHome(role: BackendRole): string {
  switch (role) {
    case "FILM_LAB_OWNER":
      return "/film-lab-owner"
    case "MODERATOR":
      return "/mod"
    case "ADMIN":
      return "/admin"
    case "PHOTOGRAPHER":
    case "PHOTOGRAPHY_EXPERT":
      return "/feed"
  }
}

export function canRoleAccessPath(role: BackendRole, pathname: string): boolean {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return role === "ADMIN"
  if (pathname === "/mod" || pathname.startsWith("/mod/")) {
    return role === "MODERATOR" || role === "ADMIN"
  }
  if (pathname === "/film-lab-owner" || pathname.startsWith("/film-lab-owner/")) {
    return role === "FILM_LAB_OWNER"
  }
  if (["/feed", "/search"].some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return role === "PHOTOGRAPHER" || role === "PHOTOGRAPHY_EXPERT"
  }
  return true
}

export function isSafeReturnPath(value: string | null, role: BackendRole): value is string {
  if (!value?.startsWith("/") || value.startsWith("//")) return false
  if (value.includes("\\") || value.includes("\r") || value.includes("\n")) return false
  try {
    const parsed = new URL(value, "http://localhost")
    return parsed.origin === "http://localhost" && canRoleAccessPath(role, parsed.pathname)
  } catch {
    return false
  }
}
