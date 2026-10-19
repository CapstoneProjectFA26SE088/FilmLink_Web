import type { ReactNode } from "react"
import { MainLayout } from "@/components/common/main-layout"
import { SocialChatbot } from "./_components/social-chatbot"
import { UserNotificationBell } from "./_components/user-notification-bell"

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MainLayout navRole="user">{children}</MainLayout>
      <UserNotificationBell />
      <SocialChatbot />
    </>
  )
}
