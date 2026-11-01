import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionTokens } from "@/lib/server/auth-bff";
import { UserWorkspace } from "@/components/user/user-workspace";

export default async function UserLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { accessToken, refreshToken } = await getSessionTokens();

	if (!accessToken || !refreshToken) {
		redirect("/login");
	}

	return <UserWorkspace>{children}</UserWorkspace>;
}
