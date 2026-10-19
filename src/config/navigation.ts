export type NavIconName =
  | "banknote"
  | "building"
  | "clipboard-list"
  | "gallery-vertical-end"
  | "home"
  | "map-pin"
  | "package"
  | "search"
  | "shield-check"
  | "shield-user"
  | "users"

export type NavItem = {
  label: string
  href?: string
  icon: NavIconName
}

export type NavRole = "user" | "lab-owner" | "admin" | "moderator"

export const USER_NAV: NavItem[] = [
  { label: "Home", href: "/feed", icon: "home" },
  { label: "Search", href: "/search", icon: "search" },
]

export const LAB_OWNER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/film-lab-owner", icon: "building" },
  {
    label: "Customer Orders",
    href: "/film-lab-owner/customer-orders",
    icon: "clipboard-list",
  },
  { label: "Packages", icon: "package" },
  { label: "Lab Profile", icon: "map-pin" },
  { label: "Consignment Feed", icon: "gallery-vertical-end" },
  { label: "Customers", icon: "users" },
  { label: "Revenue", icon: "banknote" },
  { label: "Reports", icon: "clipboard-list" },
]

export const ADMIN_NAV: NavItem[] = [{ label: "Admin", href: "/admin", icon: "shield-check" }]

export const MODERATOR_NAV: NavItem[] = [{ label: "Moderation", href: "/mod", icon: "shield-user" }]
