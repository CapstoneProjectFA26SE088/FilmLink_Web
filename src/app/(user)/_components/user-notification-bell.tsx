"use client"

import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  X,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type UserNotification,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  userNotificationsUpdatedEvent,
} from "@/lib/user-notifications"

export function UserNotificationBell() {
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sync = () => {
      setNotifications(getUserNotifications())
    }
    sync()
    window.addEventListener("storage", sync)
    window.addEventListener(userNotificationsUpdatedEvent, sync)
    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener(userNotificationsUpdatedEvent, sync)
    }
  }, [])

  // Đóng khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="relative" ref={containerRef}>
      {/* Nút thông báo ở góc trên bên phải màn hình */}
      <button
        aria-label="Thông báo đơn hàng"
        className="fixed top-4 right-4 sm:top-5 sm:right-6 z-40 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background/95 px-3.5 text-xs font-semibold text-foreground shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-muted active:scale-95 cursor-pointer ring-1 ring-foreground/10 hover:ring-[rgb(74,93,249)]/50"
        onClick={() => setIsOpen(!isOpen)}
        title="Thông báo đơn hàng Film Lab"
        type="button"
      >
        <div className="relative flex items-center gap-1.5">
          <Bell className="size-4 text-foreground" />
          <span className="hidden sm:inline font-medium">Thông báo</span>
          {unreadCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Popover thông báo từ góc trên bên phải */}
      {isOpen && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 flex h-[480px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex h-12 items-center justify-between border-b px-4 bg-muted/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Thông báo đơn hàng</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-[10px]">
                  {unreadCount} mới
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  className="text-[11px] text-[rgb(74,93,249)] hover:underline cursor-pointer"
                  onClick={markAllNotificationsAsRead}
                  type="button"
                >
                  Đọc tất cả
                </button>
              )}
              <button
                className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Bell className="size-8 text-muted-foreground/50 mb-2" />
                <p className="text-xs font-medium text-foreground">Chưa có thông báo nào</p>
                <p className="text-[11px] text-muted-foreground">
                  Cập nhật về duyệt đơn và đề xuất từ Lab sẽ hiển thị ở đây.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  className={`flex flex-col gap-1 rounded-xl p-3 border transition-colors cursor-pointer ${
                    !n.isRead
                      ? "bg-[rgb(74,93,249)]/5 border-[rgb(74,93,249)]/30 hover:bg-[rgb(74,93,249)]/10"
                      : "bg-card border-border/60 hover:bg-muted/30"
                  }`}
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {n.type === "order_accepted" && (
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                      )}
                      {n.type === "proposal_received" && (
                        <AlertCircle className="size-3.5 text-purple-600" />
                      )}
                      {n.type === "order_rejected" && (
                        <XCircle className="size-3.5 text-destructive" />
                      )}
                      <span className="font-semibold text-xs text-foreground">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {n.orderId}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-2.5 bg-muted/20 flex items-center justify-center">
            <Link
              className="text-xs font-semibold text-[rgb(74,93,249)] hover:underline flex items-center gap-1"
              href="/orders"
              onClick={() => setIsOpen(false)}
            >
              Xem trang Đơn hàng của tôi <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
