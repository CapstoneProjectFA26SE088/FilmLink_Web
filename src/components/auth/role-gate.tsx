"use client"

import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"
import { getAccessTokenFromCookie, refreshSession } from "@/lib/auth/client"
import {
  type BackendRole,
  canRoleAccessPath,
  getRoleFromAccessToken,
  getRoleHome,
} from "@/lib/auth/roles"

type RoleGateProps = {
  children: ReactNode
  allowedRoles: readonly BackendRole[]
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkAccess() {
      let role = getRoleFromAccessToken(getAccessTokenFromCookie())
      if (!role) role = await refreshSession()
      if (cancelled) return

      if (!role) {
        const next = encodeURIComponent(`${pathname}${window.location.search}`)
        router.replace(`/login?from=${next}`)
        return
      }

      if (!allowedRoles.includes(role) || !canRoleAccessPath(role, pathname)) {
        router.replace(getRoleHome(role))
        return
      }

      setAuthorized(true)
    }

    void checkAccess()
    return () => {
      cancelled = true
    }
  }, [allowedRoles, pathname, router])

  if (!authorized) {
    return <div aria-busy="true" className="min-h-dvh bg-background" />
  }

  return children
}
