import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionTokens } from "@/lib/server/auth-bff";
import { ModeratorWorkspace } from "@/components/mod/moderator-workspace";

export default async function ModeratorLayout({ children }: { children: ReactNode }) {
	const { accessToken, refreshToken } = await getSessionTokens();
	if (!accessToken || !refreshToken) redirect("/login");
	return <ModeratorWorkspace>{children}</ModeratorWorkspace>;
}
