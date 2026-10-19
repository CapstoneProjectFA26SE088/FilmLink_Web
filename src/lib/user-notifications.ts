export type NotificationType =
  | "order_created"
  | "order_accepted"
  | "order_rejected"
  | "proposal_received"
  | "proposal_resolved"

export interface UserNotification {
  id: string
  orderId: string
  labName: string
  title: string
  message: string
  type: NotificationType
  createdAt: string
  isRead: boolean
}

const storageKey = "filmlink-user-notifications"
const updateEvent = "filmlink-user-notifications-updated"

export const userNotificationsUpdatedEvent = updateEvent

export function getUserNotifications(): UserNotification[] {
  try {
    const value = window.localStorage.getItem(storageKey)
    if (value) {
      return JSON.parse(value) as UserNotification[]
    }
  } catch {
    // fallback
  }

  // Initial seed notifications if none exist
  return [
    {
      id: "notif-seed-1",
      orderId: "ORD-8488",
      labName: "Croplab Hanoi",
      title: "Đơn hàng đã được duyệt",
      message: "Croplab Hanoi đã xác nhận đơn #ORD-8488 (Cinestill 800T). KTV đang tiến hành tẩy than remjet.",
      type: "order_accepted",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      isRead: false,
    },
    {
      id: "notif-seed-2",
      orderId: "ORD-8492",
      labName: "Croplab Hanoi",
      title: "Đơn tráng mới đã gửi",
      message: "Đơn tráng film #ORD-8492 (Kodak Portra 400) đã gửi thành công tới Croplab Hanoi.",
      type: "order_created",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      isRead: true,
    },
  ]
}

export function saveUserNotifications(notifications: UserNotification[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(notifications))
    window.dispatchEvent(new Event(updateEvent))
  } catch {
    // ignore
  }
}

export function addUserNotification(notification: Omit<UserNotification, "id" | "createdAt" | "isRead">) {
  const current = getUserNotifications()
  const newNotif: UserNotification = {
    ...notification,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false,
  }
  saveUserNotifications([newNotif, ...current])
}

export function markNotificationAsRead(id: string) {
  const current = getUserNotifications()
  saveUserNotifications(
    current.map((n) => (n.id === id ? { ...n, isRead: true } : n))
  )
}

export function markAllNotificationsAsRead() {
  const current = getUserNotifications()
  saveUserNotifications(current.map((n) => ({ ...n, isRead: true })))
}
