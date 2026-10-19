import type { ReactNode } from "react"
import { MainSidebar } from "@/components/common/main-sidebar"
import type { NavRole } from "@/config/navigation"

type MainLayoutProps = {
  children: ReactNode
  navRole: NavRole
}

export function MainLayout({ children, navRole }: MainLayoutProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <MainSidebar role={navRole} />
      <div className="min-h-dvh pl-[72px]">
        <div className="mx-auto flex min-h-dvh w-full max-w-[1088px] justify-center px-4 pt-0 pb-28 sm:px-6 lg:px-6 lg:pb-8">
          {children}
        </div>
      </div>
    </div>
  )
}
