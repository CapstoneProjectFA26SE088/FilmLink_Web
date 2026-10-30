import type { ReactNode } from "react"
import { RoleGate } from "@/components/auth/role-gate"
import { MainLayout } from "@/components/common/main-layout"

const LAB_OWNER_ROLES = ["FILM_LAB_OWNER"] as const

export default function LabOwnerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGate allowedRoles={LAB_OWNER_ROLES}>
      <MainLayout navRole="lab-owner">{children}</MainLayout>
    </RoleGate>
  )
}
