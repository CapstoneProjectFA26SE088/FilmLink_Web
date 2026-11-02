"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenCheck, ClipboardList, Gauge, UsersRound } from "lucide-react";
import { WorkspaceShell } from "@/components/shared/layout/workspace-shell";
import type { Account } from "@/components/shared/model";
import styles from "./moderator-workspace.module.css";

const navigationItems = [
	{ id: "overview", label: "Tổng quan", icon: Gauge },
	{ id: "reports", label: "Báo cáo nội dung", icon: ClipboardList },
	{ id: "knowledge-base", label: "Knowledge Base", icon: BookOpenCheck },
	{ id: "community", label: "Theo dõi cộng đồng", icon: UsersRound },
] as const;

function activeSection(pathname: string) {
	if (pathname.includes("/reports")) return "reports";
	if (pathname.includes("/knowledge-base")) return "knowledge-base";
	if (pathname.includes("/community")) return "community";
	return "overview";
}

export function ModeratorWorkspace({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [account, setAccount] = useState<Account | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		fetch("/api/auth/me", { cache: "no-store", signal: controller.signal })
			.then(async (response) => {
				if (response.status === 401) {
					router.replace("/login");
					return null;
				}
				if (!response.ok) throw new Error("Không thể xác thực tài khoản Moderator.");
				return await response.json() as Account;
			})
			.then((current) => {
				if (!current) return;
				if (current.role !== "MODERATOR") {
					const destination = current.role === "ADMIN"
						? "/admin"
						: current.role === "PHOTOGRAPHY_EXPERT" || current.role === "EXPERT"
							? "/dashboard"
							: current.role === "FILM_LAB_OWNER" ? "/lab-owner" : "/dashboard";
					router.replace(destination);
					return;
				}
				setAccount(current);
			})
			.catch((cause) => {
				if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Không thể xác thực tài khoản.");
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});
		return () => controller.abort();
	}, [router]);

	async function logout() {
		const response = await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
		if (!response.ok) throw new Error("Chưa thể đăng xuất.");
		router.replace("/login");
		router.refresh();
	}

	if (loading) return <main className={styles.authState} role="status">Đang xác thực quyền Moderator…</main>;
	if (error) return <main className={styles.authState} role="alert">{error}</main>;
	if (!account) return null;

	return (
		<WorkspaceShell
			account={account}
			active={activeSection(pathname)}
			mode="admin"
			homeHref="/moderation"
			navigationItems={navigationItems}
			accountRoleLabel="Kiểm duyệt viên"
			communityNote={false}
			onLogout={logout}
			onNavigate={(section) => router.push(section === "overview" ? "/moderation" : `/moderation/${section}`)}
		>
			{children}
		</WorkspaceShell>
	);
}
