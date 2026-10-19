export type NavIconName =
  | "banknote"
  | "building"
  | "clipboard-list"
  | "gallery-vertical-end"
  | "home"
  | "map-pin"
  | "package"
  | "search"
  | "users"

export type NavItem = {
  label: string
  href?: string
  icon: NavIconName
}

export type NavRole = "user" | "lab-owner"

export const USER_NAV: NavItem[] = [
  { label: "Home", href: "/feed", icon: "home" },
  { label: "Search", href: "/search", icon: "search" },
  { label: "My Orders", href: "/orders", icon: "clipboard-list" },
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
