"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceShell } from "@/components/shared/layout/workspace-shell";
import type { Account } from "@/components/shared/model";
import { Button } from "@/components/ui/button";
import { LabOwnerOverview } from "./lab-owner-overview";
import { labOwnerNavigation, labOwnerNotifications, labOwnerSectionById, type LabOwnerSection } from "./dashboard-data";
import styles from "./lab-owner-dashboard.module.css";

type FilmLabProfile = {
	labName?: string;
	addressLine?: string;
	district?: string;
	province?: string;
	acceptingOrders?: boolean;
};

export function LabOwnerDashboard() {
	const router = useRouter();
	const [account, setAccount] = useState<Account | null>(null);
	const [lab, setLab] = useState<FilmLabProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [profileNotice, setProfileNotice] = useState<string | null>(null);
	const [active, setActive] = useState<LabOwnerSection>("overview");
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		async function loadWorkspace() {
			try {
				const accountResponse = await fetch("/api/auth/me", { cache: "no-store", signal: controller.signal });
				if (accountResponse.status === 401) {
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

				const labResponse = await fetch("/api/backend/film-labs/me", { cache: "no-store", signal: controller.signal });
				if (labResponse.status === 401) {
					router.replace("/login");
					return;
				}
				if (labResponse.status === 404) {
					setProfileNotice("Tài khoản chưa được gắn với hồ sơ Film Lab đã duyệt.");
					return;
				}
				if (!labResponse.ok) throw new Error("Không tải được hồ sơ Film Lab.");
				setLab((await labResponse.json()) as FilmLabProfile);
			} catch (cause) {
				if (!controller.signal.aborted) {
					setError(cause instanceof Error ? cause.message : "Không thể tải không gian Film Lab.");
				}
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		}

		void loadWorkspace();
		return () => controller.abort();
	}, [router]);

	if (loading) return <main className={styles.loading} role="status">Đang mở không gian Film Lab…</main>;
	if (error) {
		return <main className={styles.workspaceError} role="alert"><div><h1>Không thể mở Film Lab</h1><p>{error}</p></div></main>;
	}

	const labName = lab?.labName || "Film Lab của bạn";
	const address = [lab?.addressLine, lab?.district, lab?.province].filter(Boolean).join(", ");
	const initials = (lab?.labName || account?.fullName || "FL").split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

	async function logout() {
		const response = await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
		if (!response.ok) throw new Error("Chưa thể đăng xuất. Vui lòng thử lại.");
		router.replace("/login");
		router.refresh();
	}

	return (
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
			onNavigate={setActive}
		>
				{profileNotice && <p className={styles.profileNotice} role="status">{profileNotice}</p>}

				{active === "overview" ? (
					<LabOwnerOverview labName={labName} address={address} query={searchQuery} onQueryChange={setSearchQuery} onNavigate={setActive} />
				) : (
					<>
						<div className={styles.breadcrumb}><span>FilmLink</span><span aria-hidden="true">/</span><span>Film Lab</span><span aria-hidden="true">/</span><strong>{labOwnerSectionById[active]}</strong></div>
						<section className={styles.sectionPlaceholder}>
							<h1>{labOwnerSectionById[active]}</h1>
							<p>Màn hình này đang chờ API nghiệp vụ tương ứng từ backend. Hồ sơ lab hiện được tải trực tiếp từ tài khoản Film Lab đang đăng nhập.</p>
							<Button variant="outline" type="button" onClick={() => setActive("overview")}>Về tổng quan</Button>
						</section>
					</>
				)}

				<footer className={styles.workspaceFooter}>
					<span className={lab?.acceptingOrders ? styles.acceptingStatus : styles.pausedStatus} />
					{lab ? `${labName} · ${lab.acceptingOrders ? "Đang nhận đơn" : "Tạm ngưng nhận đơn"}` : "Đang xem dữ liệu prototype"}
				</footer>
		</WorkspaceShell>
	);
}
