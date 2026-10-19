"use client"

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Film,
  HelpCircle,
  Info,
  Package,
  RotateCcw,
  Sparkles,
  Truck,
  X,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type CustomerOrder,
  customerOrdersUpdatedEvent,
  getCustomerOrders,
  updateCustomerOrder,
} from "@/lib/customer-orders"
import { addUserNotification } from "@/lib/user-notifications"

function formatCreatedAt(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Ngày không khả dụng"
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

export function MyOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    const sync = () => {
      setOrders(getCustomerOrders())
    }
    sync()
    window.addEventListener("storage", sync)
    window.addEventListener(customerOrdersUpdatedEvent, sync)
    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener(customerOrdersUpdatedEvent, sync)
    }
  }, [])

  // User accepts lab proposal
  const handleAcceptProposal = (order: CustomerOrder) => {
    if (!order.proposal) return

    updateCustomerOrder(order.id, {
      status: "accepted",
      process: order.proposal.suggestedProcess || order.process,
      pushPull: order.proposal.suggestedPushPull || order.pushPull,
      proposalResponse: "accepted",
    })

    addUserNotification({
      orderId: order.id,
      labName: order.labName,
      title: "Đã chấp nhận đề xuất của Lab",
      message: `Bạn đã đồng ý chuyển sang quy trình ${order.proposal.suggestedProcess} cho đơn #${order.id}. Lab đang tiến hành xử lý.`,
      type: "proposal_resolved",
    })

    toast.success("Bạn đã đồng ý với đề xuất của Lab. Đơn hàng đang được tiến hành xử lý!")
  }

  // User declines lab proposal and cancels
  const handleDeclineProposal = (order: CustomerOrder) => {
    updateCustomerOrder(order.id, {
      status: "cancelled",
      proposalResponse: "declined",
    })

    addUserNotification({
      orderId: order.id,
      labName: order.labName,
      title: "Đã hủy đơn hàng",
      message: `Bạn đã từ chối đề xuất và hủy đơn #${order.id}.`,
      type: "proposal_resolved",
    })

    toast.info("Bạn đã từ chối đề xuất và hủy đơn hàng.")
  }

  const changeProposedCount = orders.filter((o) => o.status === "change_proposed").length

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "all") return true
    if (filterStatus === "change_proposed") return o.status === "change_proposed"
    if (filterStatus === "pending") return o.status === "pending"
    if (filterStatus === "accepted") return o.status === "accepted"
    if (filterStatus === "other") return o.status === "rejected" || o.status === "cancelled"
    return true
  })

  return (
    <div className="w-full max-w-[720px] pb-16 pt-3">
      {/* Status Filter Tabs & Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: `Tất cả (${orders.length})` },
            {
              id: "change_proposed",
              label: `Cần phản hồi (${changeProposedCount})`,
              highlight: changeProposedCount > 0,
            },
            {
              id: "pending",
              label: `Chờ duyệt (${orders.filter((o) => o.status === "pending").length})`,
            },
            {
              id: "accepted",
              label: `Đang xử lý (${orders.filter((o) => o.status === "accepted").length})`,
            },
            {
              id: "other",
              label: `Từ chối / Đã hủy (${
                orders.filter((o) => o.status === "rejected" || o.status === "cancelled").length
              })`,
            },
          ].map((tab) => (
            <button
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? tab.highlight
                    ? "bg-purple-600 text-white"
                    : "bg-foreground text-background"
                  : tab.highlight
                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link href="/search">
          <Button
            className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90 text-xs h-8 rounded-xl"
            size="sm"
          >
            <Film className="size-3.5 mr-1" />
            Gửi cuộn mới
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <Card className="min-h-56 rounded-2xl border-dashed shadow-none p-6 text-center flex flex-col items-center justify-center gap-2">
            <Package className="size-8 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Chưa có đơn hàng nào trong mục này</p>
            <p className="text-xs text-muted-foreground">
              Hãy chọn Film Lab từ danh bạ để đặt đơn tráng scan cuộn film của bạn.
            </p>
            <Link className="mt-2" href="/search">
              <Button size="sm" variant="outline">
                Khám phá Film Lab
              </Button>
            </Link>
          </Card>
        ) : (
          <ul aria-label="Danh sách đơn hàng của bạn" className="flex flex-col gap-4 p-0 list-none m-0">
            {filteredOrders.map((order) => {
              const isProposal = order.status === "change_proposed" && order.proposal

              return (
                <li key={order.id}>
                  <Card
                    className={`rounded-2xl border shadow-none transition-all ${
                      isProposal
                        ? "border-purple-500/60 ring-2 ring-purple-500/20 bg-purple-500/5"
                        : "border-border"
                    }`}
                  >
                    <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between pb-3">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">
                            Đơn #{order.id}
                          </span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs font-semibold text-[rgb(74,93,249)]">
                            {order.labName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatCreatedAt(order.createdAt)} · {order.delivery === "mail-in" ? "Gửi bưu điện" : "Mang trực tiếp"}
                        </span>
                      </div>

                      <div>
                        {order.status === "pending" && (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                            <Clock className="size-3 mr-1" />
                            Chờ Lab xác nhận
                          </Badge>
                        )}
                        {order.status === "accepted" && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                            <CheckCircle2 className="size-3 mr-1" />
                            Lab đã xác nhận &amp; Đang xử lý
                          </Badge>
                        )}
                        {order.status === "change_proposed" && (
                          <Badge className="bg-purple-600 text-white text-xs animate-pulse">
                            <Edit3 className="size-3 mr-1" />
                            Lab đề xuất thay đổi
                          </Badge>
                        )}
                        {order.status === "rejected" && (
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                            <XCircle className="size-3 mr-1" />
                            Lab từ chối
                          </Badge>
                        )}
                        {order.status === "cancelled" && (
                          <Badge className="bg-muted text-muted-foreground text-xs">
                            Đã hủy
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-3 text-xs pt-0 pb-4">
                      {/* Film roll info */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-background/80 p-3 border border-border/50">
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Tên loại phim</span>
                          <span className="font-semibold text-foreground">{order.filmName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Định dạng</span>
                          <span className="font-semibold text-foreground">{order.format}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Quy trình tráng</span>
                          <span className="font-semibold text-foreground">{order.process}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Số cuộn &amp; ISO</span>
                          <span className="font-semibold text-foreground">
                            {order.rollCount} cuộn · {order.pushPull}
                          </span>
                        </div>
                      </div>

                      {/* LAB CHANGE PROPOSAL CALLOUT */}
                      {isProposal && order.proposal && (
                        <div className="flex flex-col gap-3 rounded-xl border border-purple-500/40 bg-purple-500/10 p-4">
                          <div className="flex items-start gap-2.5">
                            <AlertCircle className="size-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                            <div className="flex-1 flex flex-col gap-1">
                              <span className="font-bold text-sm text-purple-900 dark:text-purple-200">
                                Lab {order.labName} đề xuất thay đổi cho cuộn phim này:
                              </span>
                              <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                                {order.proposal.reason}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                            <div className="rounded-lg bg-background p-2.5 border border-purple-500/20">
                              <span className="text-muted-foreground block text-[11px]">Quy trình đề xuất mới:</span>
                              <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                                {order.proposal.suggestedProcess}
                              </span>
                              <span className="text-[11px] text-muted-foreground block line-through">
                                Ban đầu: {order.process}
                              </span>
                            </div>

                            <div className="rounded-lg bg-background p-2.5 border border-purple-500/20">
                              <span className="text-muted-foreground block text-[11px]">Phụ phí chênh lệch:</span>
                              <span className="font-bold text-foreground text-sm">
                                {order.proposal.priceAdjustmentFormatted}
                              </span>
                              <span className="text-[11px] text-muted-foreground block">
                                Sẽ thanh toán sau khi nhận file
                              </span>
                            </div>
                          </div>

                          {order.proposal.notes && (
                            <p className="text-[11px] italic text-muted-foreground border-t border-purple-500/20 pt-2">
                              Lời nhắn KTV: {order.proposal.notes}
                            </p>
                          )}

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-500/20">
                            <Button
                              className="text-xs h-8 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeclineProposal(order)}
                              size="sm"
                              variant="outline"
                            >
                              Từ chối &amp; Hủy đơn
                            </Button>
                            <Button
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 font-semibold"
                              onClick={() => handleAcceptProposal(order)}
                              size="sm"
                            >
                              <Check className="size-3.5 mr-1" />
                              Đồng ý với thay đổi này
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* LAB REJECT CALLOUT */}
                      {order.status === "rejected" && order.rejectReason && (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs flex flex-col gap-1">
                          <span className="font-semibold text-destructive flex items-center gap-1.5">
                            <XCircle className="size-4" />
                            Lý do Lab từ chối:
                          </span>
                          <p className="text-foreground leading-relaxed pl-5">
                            {order.rejectReason}
                          </p>
                        </div>
                      )}

                      {/* ACCEPTED WORKFLOW STATUS */}
                      {order.status === "accepted" && (
                        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20">
                          <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-medium text-emerald-900 dark:text-emerald-200">
                              Đơn hàng đã được duyệt và đang chạy trên dây chuyền tráng.
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                            Giai đoạn {order.workflowStage + 1}/4
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
