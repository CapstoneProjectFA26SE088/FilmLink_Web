"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WorkspaceShell } from "@/components/shared/layout/workspace-shell";
import type { Account } from "@/components/shared/model";
import { labOwnerNavigation, labOwnerNotifications, type LabOwnerSection } from "./dashboard-data";
import styles from "./lab-owner-dashboard.module.css";

type FilmLabProfile = {
	id?: number;
	labName?: string;
	description?: string;
	addressLine?: string;
	district?: string;
	province?: string;
	latitude?: number | null;
	longitude?: number | null;
	contactEmail?: string;
	contactPhone?: string;
	acceptingOrders?: boolean;
	qcBufferHours?: number;
	expressDailyCapPercent?: number | null;
	openingHours?: { dayOfWeek: number; closed: boolean; opensAt?: string | null; closesAt?: string | null }[];
	images?: { id: number; displayOrder: number; url: string }[];
};

type LabOwnerWorkspaceValue = { lab: FilmLabProfile | null; setLab: (profile: FilmLabProfile) => void; labName: string; address: string; profileNotice: string | null };
const LabOwnerWorkspaceContext = createContext<LabOwnerWorkspaceValue | null>(null);

export function useLabOwnerWorkspace() {
	const value = useContext(LabOwnerWorkspaceContext);
	if (!value) throw new Error("useLabOwnerWorkspace must be used within LabOwnerWorkspace.");
	return value;
}

const sectionByPath: Record<string, LabOwnerSection | ""> = {
	"/lab-owner": "overview",
	"/lab-owner/orders": "orders",
	"/lab-owner/services": "services",
	"/lab-owner/machines": "machines",
	"/lab-owner/consignments": "consignments",
	"/lab-owner/revenue": "revenue",
	"/lab-owner/customers": "customers",
	"/lab-owner/settlements": "settlements",
	"/lab-owner/profile": "profile",
};

const pathBySection: Record<LabOwnerSection, string> = {
	overview: "/lab-owner",
	orders: "/lab-owner/orders",
	services: "/lab-owner/services",
	machines: "/lab-owner/machines",
	consignments: "/lab-owner/consignments",
	revenue: "/lab-owner/revenue",
	customers: "/lab-owner/customers",
	settlements: "/lab-owner/settlements",
	profile: "/lab-owner/profile",
};

export function LabOwnerWorkspace({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [account, setAccount] = useState<Account | null>(null);
	const [lab, setLab] = useState<FilmLabProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [profileNotice, setProfileNotice] = useState<string | null>(null);
	const active = useMemo<LabOwnerSection | "">(() => pathname.startsWith("/lab-owner/orders") ? "orders" : sectionByPath[pathname] ?? "overview", [pathname]);
	const labName = lab?.labName || "Film Lab của bạn";
	const initials = (lab?.labName || account?.fullName || "FL").split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
	const address = [lab?.addressLine, lab?.district, lab?.province].filter(Boolean).join(", ");

	useEffect(() => {
		const controller = new AbortController();
		async function loadWorkspace() {
			try {
				const [accountResponse, labResponse] = await Promise.all([
					fetch("/api/auth/me", { cache: "no-store", signal: controller.signal }),
					fetch("/api/backend/film-labs/me", { cache: "no-store", signal: controller.signal }),
				]);
				if (accountResponse.status === 401 || labResponse.status === 401) {
					router.replace("/login");
					return;
				}
				if (!accountResponse.ok) throw new Error("Không thể xác thực tài khoản.");
				const currentAccount = (await accountResponse.json()) as Account;
				if (currentAccount.role !== "FILM_LAB_OWNER") {
					router.replace("/dashboard");
					return;
				}
				setAccount(currentAccount);
				if (labResponse.status === 404) {
					setProfileNotice("Tài khoản chưa được gắn với hồ sơ Film Lab đã duyệt. Các số liệu dưới đây là dữ liệu minh họa.");
					return;
				}
				if (!labResponse.ok) throw new Error("Không tải được hồ sơ Film Lab.");
				setLab((await labResponse.json()) as FilmLabProfile);
			} catch (cause) {
				if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Không thể tải không gian Film Lab.");
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		}
		void loadWorkspace();
		return () => controller.abort();
	}, [router]);

	async function logout() {
		const response = await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
		if (!response.ok) throw new Error("Chưa thể đăng xuất. Vui lòng thử lại.");
		router.replace("/login");
		router.refresh();
	}

	if (loading) return <main className={styles.loading} role="status">Đang mở không gian Film Lab…</main>;
	if (error) return <main className={styles.workspaceError} role="alert"><div><h1>Không thể mở Film Lab</h1><p>{error}</p></div></main>;

	return (
		<LabOwnerWorkspaceContext.Provider value={{ lab, setLab, labName, address, profileNotice }}>
		<WorkspaceShell
			account={account}
			active={active}
			mode="lab-owner"
			homeHref="/lab-owner"
			accountRoleLabel="Chủ lab"
			accountInitials={initials}
			navigationItems={labOwnerNavigation}
			communityNote={false}
			notifications={labOwnerNotifications}
			notificationsPrototype
			onLogout={logout}
			onNavigate={(section) => router.push(pathBySection[section as LabOwnerSection] ?? "/lab-owner")}
		>
			<div className={styles.workspaceFrame}>
				{profileNotice && <p className={styles.profileNotice} role="status">{profileNotice}</p>}
				{children}
				<footer className={styles.workspaceFooter}>
					<span className={lab?.acceptingOrders ? styles.acceptingStatus : styles.pausedStatus} />
					{lab ? `${labName} · ${lab.acceptingOrders ? "Đang nhận đơn" : "Tạm ngưng nhận đơn"}` : "Dữ liệu nghiệp vụ đang ở chế độ minh họa"}
					{address && <span className={styles.footerAddress}>{address}</span>}
				</footer>
			</div>
		</WorkspaceShell>
		</LabOwnerWorkspaceContext.Provider>
	);
}
