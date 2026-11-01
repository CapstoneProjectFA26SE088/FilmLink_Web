"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Account, Section } from "../model";
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
	mode: "guest" | "user" | "lab-owner";
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

	return (
		<div className="user-app">
			<aside className="user-sidebar">
				<WorkspaceSidebar
					active={active}
					account={account}
					homeHref={homeHref ?? (mode === "user" ? "/dashboard" : mode === "lab-owner" ? "/lab-owner" : "/")}
					orderCount={orderCount}
					showOrderCount={mode === "user"}
					navigationItems={navigationItems}
					accountRoleLabel={accountRoleLabel}
					accountInitials={accountInitials}
					onLogout={mode !== "guest" ? handleLogout : undefined}
					logoutPending={logoutPending}
					logoutError={logoutError}
					marketplaceEnabled={mode === "user"}
					onNavigate={(section) => onNavigate(section as T)}
					onDismissCommunityNote={() => setCommunityNoteVisible(false)}
					communityNoteVisible={communityNote && communityNoteVisible}
				/>
			</aside>

			{mobileMenu && (
				<div className="mobile-menu-layer">
					<aside className="mobile-menu-panel" aria-label="Menu điều hướng">
						<div className="mobile-menu-top">
							<span>Menu</span>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="mobile-menu-close"
								onClick={() => setMobileMenu(false)}
								aria-label="Đóng menu"
							>
								<X />
							</Button>
						</div>
						<WorkspaceSidebar
							active={active}
							account={account}
							homeHref={homeHref ?? (mode === "user" ? "/dashboard" : mode === "lab-owner" ? "/lab-owner" : "/")}
							orderCount={orderCount}
							showOrderCount={mode === "user"}
							navigationItems={navigationItems}
							accountRoleLabel={accountRoleLabel}
							accountInitials={accountInitials}
							onLogout={mode !== "guest" ? handleLogout : undefined}
							logoutPending={logoutPending}
							logoutError={logoutError}
							marketplaceEnabled={mode === "user"}
							onNavigate={(section) => onNavigate(section as T)}
							onDismissCommunityNote={() => setCommunityNoteVisible(false)}
							communityNoteVisible={communityNote && communityNoteVisible}
							onClose={() => setMobileMenu(false)}
						/>
					</aside>
				</div>
			)}

			<main className="user-main">
				<header className="user-topbar">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="mobile-menu-trigger"
						onClick={() => setMobileMenu(true)}
						aria-label="Mở menu"
					>
						<Menu />
					</Button>
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
				<div className="page-content">{children}</div>
			</main>
		</div>
	);
}
