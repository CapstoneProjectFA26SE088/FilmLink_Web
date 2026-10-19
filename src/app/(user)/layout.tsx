import type { ReactNode } from "react"
import { MainLayout } from "@/components/common/main-layout"
import { SocialChatbot } from "./_components/social-chatbot"

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MainLayout navRole="user">{children}</MainLayout>
      <SocialChatbot />
    </>
  )
}
