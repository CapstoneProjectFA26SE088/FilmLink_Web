"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
	Building2,
	ChartNoAxesCombined,
	CircleDollarSign,
	ClipboardCheck,
	Cog,
	Database,
	Flag,
	Gauge,
	History,
	Layers3,
	Library,
	UsersRound,
	type LucideIcon,
} from "lucide-react";
import { WorkspaceShell } from "@/components/shared/layout/workspace-shell";
import type { Account } from "@/components/shared/model";
import type { WorkspaceNotification } from "@/components/shared/layout/workspace-notifications";
import styles from "./admin-pages.module.css";

export type AdminSection =
	| "overview"
	| "labs"
	| "experts"
	| "users"
	| "audit-logs"
	| "catalog"
	| "settings"
	| "subscriptions"
	| "payments"
	| "complaints"
	| "moderation"
	| "knowledge-base";

const navigationItems: { id: AdminSection; label: string; icon: LucideIcon }[] = [
	{ id: "overview", label: "Tổng quan", icon: Gauge },
	{ id: "labs", label: "Duyệt Film Lab", icon: Building2 },
	{ id: "experts", label: "Duyệt chuyên gia", icon: ClipboardCheck },
	{ id: "users", label: "Người dùng & vai trò", icon: UsersRound },
	{ id: "audit-logs", label: "Nhật ký hoạt động", icon: History },
	{ id: "catalog", label: "Dữ liệu danh mục", icon: Database },
	{ id: "settings", label: "Cấu hình hệ thống", icon: Cog },
	{ id: "subscriptions", label: "Gói đăng ký", icon: Layers3 },
	{ id: "payments", label: "Thanh toán & payout", icon: CircleDollarSign },
	{ id: "complaints", label: "Khiếu nại", icon: Flag },
	{ id: "moderation", label: "Kiểm duyệt nội dung", icon: ChartNoAxesCombined },
	{ id: "knowledge-base", label: "Knowledge Base", icon: Library },
];

const sectionByPath: Record<string, AdminSection> = {
	"/admin": "overview",
	"/admin/labs": "labs",
	"/admin/experts": "experts",
	"/admin/users": "users",
	"/admin/audit-logs": "audit-logs",
	"/admin/catalog": "catalog",
	"/admin/settings": "settings",
	"/admin/subscriptions": "subscriptions",
	"/admin/payments": "payments",
	"/admin/complaints": "complaints",
	"/admin/moderation": "moderation",
	"/admin/knowledge-base": "knowledge-base",
};

const pathBySection: Record<AdminSection, string> = {
	overview: "/admin",
	labs: "/admin/labs",
	experts: "/admin/experts",
	users: "/admin/users",
	"audit-logs": "/admin/audit-logs",
	catalog: "/admin/catalog",
	settings: "/admin/settings",
	subscriptions: "/admin/subscriptions",
	payments: "/admin/payments",
	complaints: "/admin/complaints",
	moderation: "/admin/moderation",
	"knowledge-base": "/admin/knowledge-base",
};

const adminNotifications: WorkspaceNotification[] = [
	{ id: "lab-review", title: "Hồ sơ Film Lab chờ duyệt", description: "Có hồ sơ mới cần xem xét.", time: "Vừa xong" },
	{ id: "expert-review", title: "Yêu cầu xác minh chuyên gia", description: "Kiểm tra hồ sơ và minh chứng chuyên môn.", time: "Hôm nay" },
	{ id: "report-review", title: "Báo cáo nội dung mới", description: "Một nội dung đang chờ kiểm duyệt.", time: "Hôm nay" },
];

export function AdminWorkspace({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [account, setAccount] = useState<Account | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const active = useMemo(() => sectionByPath[pathname] ?? "overview", [pathname]);
	const initials = (account?.fullName || account?.email || "AD").split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

	useEffect(() => {
		const controller = new AbortController();
		fetch("/api/auth/me", { cache: "no-store", signal: controller.signal })
			.then(async (response) => {
				if (response.status === 401) {
					router.replace("/login");
					return null;
				}
				if (!response.ok) throw new Error("Không thể xác thực tài khoản quản trị.");
				return (await response.json()) as Account;
			})
			.then((current) => {
				if (!current) return;
				if (current.role !== "ADMIN") {
					router.replace(current.role === "FILM_LAB_OWNER" ? "/lab-owner" : "/dashboard");
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
		if (!response.ok) throw new Error("Chưa thể đăng xuất. Vui lòng thử lại.");
		router.replace("/login");
		router.refresh();
	}

	if (loading) return <main className={styles.loading} role="status">Đang xác thực quyền quản trị…</main>;
	if (error) return <main className={styles.loading} role="alert">{error}</main>;
	if (!account) return null;

	return (
		<WorkspaceShell
			account={account}
			active={active}
			mode="admin"
			homeHref="/admin"
			accountRoleLabel="Quản trị viên"
			accountInitials={initials}
			navigationItems={navigationItems}
			communityNote={false}
			notifications={adminNotifications}
			notificationsPrototype
			onLogout={logout}
			onNavigate={(section) => router.push(pathBySection[section as AdminSection] ?? "/admin")}
		>
			{children}
		</WorkspaceShell>
	);
}
