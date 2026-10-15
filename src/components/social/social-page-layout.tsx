import type { ReactNode } from "react"
import { SocialChatbot } from "@/components/social/social-chatbot"
import { SocialSidebar } from "@/components/social/social-sidebar"

type SocialPageLayoutProps = {
  activePage: "feed" | "search"
  children: ReactNode
}

export function SocialPageLayout({ activePage, children }: SocialPageLayoutProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SocialSidebar activePage={activePage} />
      <div className="min-h-dvh pl-[72px] xl:pl-0">
        <div className="mx-auto flex min-h-dvh w-full max-w-[1088px] justify-center px-4 pt-0 pb-28 sm:px-6 lg:px-6 lg:pb-8">
          {children}
        </div>
      </div>
      <SocialChatbot />
    </div>
  )
}
