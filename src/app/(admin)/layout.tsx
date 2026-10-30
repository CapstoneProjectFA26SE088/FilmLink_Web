import type { ReactNode } from "react"
import { RoleGate } from "@/components/auth/role-gate"
import { MainLayout } from "@/components/common/main-layout"

const ADMIN_ROLES = ["ADMIN"] as const

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGate allowedRoles={ADMIN_ROLES}>
      <MainLayout navRole="admin">{children}</MainLayout>
    </RoleGate>
  )
}
