import type { ReactNode } from "react"
import { MainLayout } from "@/components/common/main-layout"

export default function LabOwnerLayout({ children }: { children: ReactNode }) {
  return <MainLayout navRole="lab-owner">{children}</MainLayout>
}
