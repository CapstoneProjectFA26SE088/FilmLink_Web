import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionTokens } from "@/lib/server/auth-bff";
import { LabOwnerWorkspace } from "@/components/lab-owner/workspace";

export default async function LabOwnerLayout({ children }: { children: ReactNode }) {
	const { accessToken, refreshToken } = await getSessionTokens();
	if (!accessToken || !refreshToken) redirect("/login");

	return <LabOwnerWorkspace>{children}</LabOwnerWorkspace>;
}
