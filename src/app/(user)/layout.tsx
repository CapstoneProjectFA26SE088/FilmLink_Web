import type { ReactNode } from "react"
import { RoleGate } from "@/components/auth/role-gate"
import { MainLayout } from "@/components/common/main-layout"
import type { BackendRole } from "@/lib/auth/roles"
import { SocialChatbot } from "./_components/social-chatbot"

const USER_ROLES: BackendRole[] = ["PHOTOGRAPHER", "PHOTOGRAPHY_EXPERT"]

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGate allowedRoles={USER_ROLES}>
      <MainLayout navRole="user">{children}</MainLayout>
      <SocialChatbot />
    </RoleGate>
  )
}
