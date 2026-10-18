import type { ReactNode } from "react"
import { MainLayout } from "@/components/common/main-layout"

export default function UserLayout({ children }: { children: ReactNode }) {
  return <MainLayout navRole="user">{children}</MainLayout>
}
