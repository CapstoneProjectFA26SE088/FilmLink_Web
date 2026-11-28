"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { navigation, type Account, type Section } from "../model";
import { WorkspaceNotifications, type WorkspaceNotification } from "./workspace-notifications";
import { WorkspaceSidebar } from "./workspace-sidebar";

type NavigationItem = { id: string; label: string; icon: LucideIcon };

export function WorkspaceShell<T extends string = Section>({
	account,
	active,
	mode,
	orderCount,
	homeHref,
	accountRoleLabel,
	accountInitials,
	navigationItems,
	communityNote = true,
	notifications = [],
	notificationsPrototype = false,
	onLogout,
	onNavigate,
	children,
}: {
	account: Account | null;
	active: T;
	mode: "guest" | "user" | "expert" | "lab-owner" | "admin";
	orderCount?: number;
	homeHref?: string;
	accountRoleLabel?: string;
	accountInitials?: string;
	navigationItems?: readonly NavigationItem[];
	communityNote?: boolean;
	notifications?: readonly WorkspaceNotification[];
	notificationsPrototype?: boolean;
	onLogout?: () => void;
	onNavigate: (section: T) => void;
	children: ReactNode;
}) {
	const [communityNoteVisible, setCommunityNoteVisible] = useState(true);
	const [mobileMenu, setMobileMenu] = useState(false);
	const [logoutPending, setLogoutPending] = useState(false);
	const [logoutError, setLogoutError] = useState<string | null>(null);

	async function handleLogout() {
		if (!onLogout || logoutPending) return;
		setLogoutPending(true);
		setLogoutError(null);
		try {
			await onLogout();
		} catch {
			setLogoutError("Chưa thể đăng xuất. Vui lòng thử lại.");
		} finally {
			setLogoutPending(false);
		}
	}

	const sectionLabel = (navigationItems ?? navigation).find((item) => item.id === active)?.label;

	useEffect(() => {
		if (!mobileMenu) return;
		const desktop = window.matchMedia("(min-width: 761px)");
		function closeOnDesktop() {
			if (desktop.matches) setMobileMenu(false);
		}
		desktop.addEventListener("change", closeOnDesktop);
		return () => desktop.removeEventListener("change", closeOnDesktop);
	}, [mobileMenu]);

	function sidebar(onClose?: () => void) {
		return (
			<WorkspaceSidebar
				active={active}
				account={account}
				homeHref={homeHref ?? (mode === "user" || mode === "expert" ? "/dashboard" : mode === "lab-owner" ? "/lab-owner" : mode === "admin" ? "/admin" : "/")}
				orderCount={orderCount}
				showOrderCount={(mode === "user" || mode === "expert") && orderCount !== undefined}
				navigationItems={navigationItems}
				accountRoleLabel={accountRoleLabel}
				accountInitials={accountInitials}
				onLogout={mode !== "guest" ? handleLogout : undefined}
				logoutPending={logoutPending}
				logoutError={logoutError}
				marketplaceEnabled={mode === "user" || mode === "expert"}
				onClose={onClose}
				onNavigate={(section) => onNavigate(section as T)}
				onDismissCommunityNote={() => setCommunityNoteVisible(false)}
				communityNoteVisible={communityNote && communityNoteVisible}
			/>
		);
	}

	return (
		<div className="user-app">
			<a href="#workspace-content" className="workspace-skip">Đi đến nội dung chính</a>
			<aside className="user-sidebar">{sidebar()}</aside>

			<main className="user-main">
				<header className="user-topbar">
					<Dialog.Root open={mobileMenu} onOpenChange={setMobileMenu}>
						<Dialog.Trigger className="mobile-menu-trigger" aria-label="Mở điều hướng">
							<Menu aria-hidden="true" />
						</Dialog.Trigger>
						<Dialog.Portal>
							<Dialog.Backdrop className="mobile-menu-layer" />
							<Dialog.Popup className="mobile-menu-panel">
								<div className="mobile-menu-top">
									<Dialog.Title>Điều hướng</Dialog.Title>
									<Dialog.Close className="mobile-menu-close" aria-label="Đóng điều hướng">
										<X aria-hidden="true" />
									</Dialog.Close>
								</div>
								{sidebar(() => setMobileMenu(false))}
							</Dialog.Popup>
						</Dialog.Portal>
					</Dialog.Root>
					{sectionLabel && <span className="workspace-location">{sectionLabel}</span>}
					<div className="topbar-actions">
						{account ? (
							<>
								<WorkspaceNotifications items={notifications} prototype={notificationsPrototype} />
								<span className="topbar-signin">Xin chào, {account.fullName || account.email}</span>
							</>
						) : mode === "guest" ? (
							<>
								<Link className="topbar-signin" href="/login">
									Đăng nhập
								</Link>
								<Link className="topbar-signup" href="/register">
									Tạo tài khoản <ArrowRight aria-hidden="true" />
								</Link>
							</>
						) : null}
					</div>
				</header>
				<div id="workspace-content" tabIndex={-1} className="page-content">{children}</div>
			</main>
		</div>
	);
}
