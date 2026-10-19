import type { ReactNode } from "react"
import { RoleGate } from "@/components/auth/role-gate"
import { MainLayout } from "@/components/common/main-layout"

const MODERATOR_ROLES = ["MODERATOR", "ADMIN"] as const

export default function ModeratorLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGate allowedRoles={MODERATOR_ROLES}>
      <MainLayout navRole="moderator">{children}</MainLayout>
    </RoleGate>
  )
}
