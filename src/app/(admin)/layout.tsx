import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionTokens } from "@/lib/server/auth-bff";
import { AdminWorkspace } from "@/components/admin/admin-workspace";

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const { accessToken, refreshToken } = await getSessionTokens();
	if (!accessToken || !refreshToken) redirect("/login");
	return <AdminWorkspace>{children}</AdminWorkspace>;
}
