import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionTokens } from "@/lib/server/auth-bff";
import { UserWorkspace } from "@/components/user/user-workspace";

export default async function ExpertLayout({ children }: { children: ReactNode }) {
	const { accessToken, refreshToken } = await getSessionTokens();
	if (!accessToken || !refreshToken) redirect("/login");
	return <UserWorkspace mode="expert">{children}</UserWorkspace>;
}
