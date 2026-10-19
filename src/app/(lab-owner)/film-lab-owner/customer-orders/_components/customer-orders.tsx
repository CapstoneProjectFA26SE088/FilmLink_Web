"use client"

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Eye,
  FileCheck,
  FlaskConical,
  RotateCcw,
  Scan,
  ScanLine,
  Sparkles,
  Upload,
  UserCheck,
  Zap,
} from "lucide-react"
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
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  type CustomerOrder,
  customerOrdersUpdatedEvent,
  getCustomerOrders,
  saveCustomerOrder,
  updateCustomerOrder,
} from "@/lib/customer-orders"
import {
  MOCK_AI_QUALITY_REPORTS,
  MOCK_LAB_CUSTOMER_ORDERS,
  MOCK_PROCESSING_LINES,
  type ProcessingLine,
} from "../../../mock_data"

const workflowSteps = [
  "Chi tiết đơn hàng",
  "Phân bổ dây chuyền",
  "Tiến độ xử lý tráng",
  "Tải ảnh scan & AI QC",
]

function displayValue(value: string) {
  return value?.trim() || "—"
}

function formatCreatedAt(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Ngày không khả dụng"
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

function OrderField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl border bg-background px-3 py-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="break-words text-sm font-medium">{displayValue(value)}</span>
    </div>
  )
}

function OrderCard({
  order,
  onReject,
  onApprove,
  onContinue,
}: {
  order: CustomerOrder
  onReject: (id: string) => void
  onApprove: (order: CustomerOrder) => void
  onContinue: (order: CustomerOrder) => void
}) {
  return (
    <Card className="rounded-2xl border-border shadow-none ring-1 ring-foreground/5 hover:ring-foreground/10 transition-all">
      <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between pb-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">
              Đơn hàng #{order.id.slice(-8).toUpperCase()}
            </CardTitle>
            {order.id.startsWith("TEST") && (
              <Badge className="text-[10px]" variant="secondary">
                TEST ORDER
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">{formatCreatedAt(order.createdAt)}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={`text-xs ${
              order.status === "rejected"
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : order.status === "accepted"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
            variant="outline"
          >
            {order.status === "pending"
              ? "Chờ duyệt"
              : order.status === "accepted"
              ? "Đã duyệt / Đang xử lý"
              : "Từ chối"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2 pt-0 pb-3">
        <OrderField label="Khách hàng" value={order.senderName} />
        <OrderField label="Số điện thoại" value={order.phone} />
        <OrderField
          label="Loại phim & Quy trình"
          value={[order.filmName, order.format, order.process, order.pushPull].filter(Boolean).join(" · ")}
        />
        <OrderField label="Số lượng & Hình thức gửi" value={`${order.rollCount} cuộn · ${order.delivery === "mail-in" ? "Bưu điện (Mail-in)" : "Mang trực tiếp"}`} />
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 border-t pt-3 sm:flex-row sm:justify-end">
        {order.status === "pending" && (
          <>
            <Button
              className="text-xs h-8"
              onClick={() => onReject(order.id)}
              variant="outline"
            >
              Từ chối đơn
            </Button>
            <Button
              className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90 text-xs h-8"
              onClick={() => onApprove(order)}
            >
              <Check className="size-3.5 mr-1" />
              Duyệt đơn &amp; Bắt đầu
            </Button>
          </>
        )}
        {order.status === "accepted" && (
          <Button
            className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90 text-xs h-8"
            onClick={() => onContinue(order)}
          >
            Mở quy trình xử lý (Bước {order.workflowStage + 1}/4)
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        )}
        {order.status === "rejected" && (
          <span className="text-xs text-muted-foreground italic">
            Đơn này đã được từ chối tiếp nhận
          </span>
        )}
      </CardFooter>
    </Card>
  )
}

function OrderDetails({ order }: { order: CustomerOrder }) {
  return (
    <div className="flex flex-col gap-5 text-sm">
      <section aria-labelledby="customer-info-title" className="flex flex-col gap-2">
        <h3
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          id="customer-info-title"
        >
          1. Thông tin khách hàng
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <OrderField label="Họ tên người gửi" value={order.senderName} />
          <OrderField label="Số điện thoại" value={order.phone} />
          <OrderField label="Email nhận file" value={order.email} />
          <OrderField label="Địa chỉ trả âm bản" value={order.returnAddress} />
        </div>
      </section>

      <section aria-labelledby="film-order-title" className="flex flex-col gap-2">
        <h3
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          id="film-order-title"
        >
          2. Chi tiết cuộn phim &amp; Quy trình yêu cầu
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <OrderField label="Tên loại phim" value={order.filmName} />
          <OrderField label="Định dạng" value={order.format} />
          <OrderField label="Quy trình tráng" value={order.process} />
          <OrderField label="Số cuộn" value={`${order.rollCount} cuộn`} />
          <OrderField label="Bù sáng Push / Pull" value={order.pushPull} />
          <OrderField label="Phương thức vận chuyển" value={order.delivery === "mail-in" ? "Gửi bưu điện" : "Trực tiếp"} />
          <div className="sm:col-span-2">
            <OrderField label="Ghi chú của khách hàng" value={order.note || "Không có ghi chú"} />
          </div>
        </div>
      </section>

      <Card className="gap-2 rounded-xl bg-muted/30 py-3 shadow-none border border-border/50">
        <CardHeader className="p-0 px-4">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Tóm tắt tiếp nhận
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 px-4 text-xs text-muted-foreground">
          <span>
            {order.senderName} · {displayValue(order.rollCount)} cuộn {displayValue(order.format)}
          </span>
          <span>
            Quy trình: {displayValue(order.process)} ({displayValue(order.pushPull)}) · Trạng thái: {order.status}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}

function WorkflowPanel({
  selectedLine,
  onSelectLine,
}: {
  selectedLine: string
  onSelectLine: (lineId: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Phân bổ dây chuyền tráng phim</h3>
        <p className="text-xs text-muted-foreground pt-0.5">
          Chọn dây chuyền máy móc và kỹ thuật viên phụ trách xử lý cuộn phim này:
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {MOCK_PROCESSING_LINES.map((line) => {
          const isSelected = selectedLine === line.id
          return (
            <Card
              className={`rounded-2xl cursor-pointer transition-all border p-4 shadow-none ${
                isSelected
                  ? "border-[rgb(74,93,249)] bg-[rgb(74,93,249)]/5 ring-1 ring-[rgb(74,93,249)]"
                  : "hover:bg-muted/30 border-border"
              }`}
              key={line.id}
              onClick={() => onSelectLine(line.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FlaskConical className="size-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{line.name}</h4>
                    <span className="text-[11px] text-muted-foreground">{line.processType}</span>
                  </div>
                </div>
                {isSelected && (
                  <Badge className="bg-[rgb(74,93,249)] text-white text-[10px]">
                    Đã gán
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground pt-2.5 line-clamp-2">
                {line.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[11px] text-muted-foreground mt-2">
                <span className="font-medium text-foreground">{line.technician}</span>
                <span>Công suất: {line.capacityRollsPerHour} cuộn/h</span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function StatusPanel({ lineName }: { lineName: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Tiến độ quy trình tráng phim</h3>
        <p className="text-xs text-muted-foreground pt-0.5">
          Theo dõi các chặng nhiệt độ hóa chất và sấy khô:
        </p>
      </div>

      <Card className="rounded-2xl border bg-card shadow-none">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-semibold">
              <Check className="size-4" />
            </span>
            <div className="flex flex-col gap-0.5 pt-0.5 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">01. Tiếp nhận &amp; Rút đầu film trong darkroom</p>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]" variant="outline">
                  Hoàn tất
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Kẹp thẻ ID và kiểm tra loại film, chuẩn bị cuộn vào lõi máy.</p>
            </div>
          </div>

          <div className="ml-4 h-6 border-l-2 border-emerald-500" />

          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-semibold">
              02
            </span>
            <div className="flex flex-col gap-0.5 pt-0.5 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">02. Bể thuốc hiện (Dev) &amp; Tẩy than / Hãm</p>
                <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]" variant="outline">
                  Đang xử lý (38°C)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Đang chạy trên dây chuyền: <strong className="text-foreground">{lineName || "Noritsu V30 Auto"}</strong>
              </p>
            </div>
          </div>

          <div className="ml-4 h-6 border-l-2 border-dashed border-border" />

          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold">
              03
            </span>
            <div className="flex flex-col gap-0.5 pt-0.5 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">03. Rửa sạch bằng nước mềm &amp; Sấy khô</p>
                <Badge className="text-[10px]" variant="outline">
                  Chờ bước 2
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Sấy ở nhiệt độ 35°C trong buồng lọc bụi HEPA.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UploadScansPanel({
  order,
  onCompleteOrder,
}: {
  order: CustomerOrder
  onCompleteOrder: () => void
}) {
  const [hasLoadedScans, setHasLoadedScans] = useState(false)
  const report = MOCK_AI_QUALITY_REPORTS.default

  const handleSimulateUpload = () => {
    setHasLoadedScans(true)
    toast.success("Đã nạp file scan độ phân giải cao thành công!")
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Tải ảnh scan &amp; Kiểm tra chất lượng AI</h3>
        <p className="text-xs text-muted-foreground pt-0.5">
          Hệ thống AI tự động phân tích độ nét hạt, cân bằng màu và quét bụi xước ảnh:
        </p>
      </div>

      {!hasLoadedScans ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-5 py-8 text-center bg-muted/10">
          <span className="flex size-12 items-center justify-center rounded-full bg-[rgb(74,93,249)]/10 text-[rgb(74,93,249)]">
            <Upload className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">Tệp ảnh số hóa độ phân giải cao</p>
            <p className="text-xs text-muted-foreground">
              Định dạng JPG / TIFF từ máy Noritsu HS-1800 hoặc Frontier SP-3000
            </p>
          </div>
          <Button
            className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90 text-xs mt-1"
            onClick={handleSimulateUpload}
            size="sm"
            type="button"
          >
            <Sparkles className="size-3.5 mr-1" />
            Nạp bộ ảnh scan mẫu (24MP High-Res)
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl border bg-emerald-500/5 border-emerald-500/30 shadow-none">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Báo cáo kiểm định chất lượng AI Quality Check (Đạt)
                  </CardTitle>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px]">
                  Passed 100%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded-xl bg-background/80 p-2.5 border border-border/40">
                <span className="text-muted-foreground block text-[11px]">Độ phân giải</span>
                <span className="font-bold text-foreground text-xs">{report.resolution}</span>
              </div>
              <div className="rounded-xl bg-background/80 p-2.5 border border-border/40">
                <span className="text-muted-foreground block text-[11px]">Độ sạch bụi xước</span>
                <span className="font-bold text-emerald-600 text-xs">{report.dustScratchScore} / 10</span>
              </div>
              <div className="rounded-xl bg-background/80 p-2.5 border border-border/40">
                <span className="text-muted-foreground block text-[11px]">Độ chuẩn màu</span>
                <span className="font-bold text-emerald-600 text-xs">{report.colorBalanceAccuracy}%</span>
              </div>
              <div className="rounded-xl bg-background/80 p-2.5 border border-border/40">
                <span className="text-muted-foreground block text-[11px]">Số frame hợp lệ</span>
                <span className="font-bold text-foreground text-xs">{report.validFrames}/{report.totalFrames} frames</span>
              </div>
            </CardContent>
          </Card>

          {/* Sample scan preview thumbnails */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase block pb-2">
              Ảnh xem trước cuộn phim ({report.sampleImages.length} khung hình mẫu):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {report.sampleImages.map((imgUrl, idx) => (
                <div className="aspect-[3/2] overflow-hidden rounded-xl border border-border relative bg-muted" key={imgUrl}>
                  <img alt={`Frame ${idx + 1}`} className="size-full object-cover" src={imgUrl} />
                  <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-white font-mono">
                    Frame #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">
              Khách hàng: <strong className="text-foreground">{order.senderName}</strong> ({order.email})
            </span>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs"
              onClick={onCompleteOrder}
              size="sm"
            >
              <FileCheck className="size-3.5 mr-1" />
              Gửi email thông báo &amp; Trả link ảnh
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function CustomerOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [dialogStage, setDialogStage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedLineId, setSelectedLineId] = useState<string>("line-c41-noritsu")

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null

  useEffect(() => {
    const syncOrders = () => {
      const savedOrders = getCustomerOrders()
      // If empty or only has the old single testOrder, seed with MOCK_LAB_CUSTOMER_ORDERS
      if (savedOrders.length === 0 || (savedOrders.length === 1 && savedOrders[0]?.id === "TEST-001")) {
        for (const order of MOCK_LAB_CUSTOMER_ORDERS) {
          saveCustomerOrder(order)
        }
        setOrders(getCustomerOrders())
        return
      }
      setOrders(savedOrders)
    }
    syncOrders()
    window.addEventListener("storage", syncOrders)
    window.addEventListener(customerOrdersUpdatedEvent, syncOrders)
    return () => {
      window.removeEventListener("storage", syncOrders)
      window.removeEventListener(customerOrdersUpdatedEvent, syncOrders)
    }
  }, [])

  function rejectOrder(id: string) {
    updateCustomerOrder(id, { status: "rejected" })
    setOrders(getCustomerOrders())
    toast.error("Đã từ chối đơn hàng.")
  }

  function openOrder(order: CustomerOrder, approve = false) {
    if (approve) {
      updateCustomerOrder(order.id, { status: "accepted" })
      toast.success("Đã duyệt đơn hàng thành công!")
    }
    setOrders(getCustomerOrders())
    setSelectedOrderId(order.id)
    setDialogStage(approve ? 1 : order.workflowStage)
  }

  function advanceWorkflow() {
    if (!selectedOrder) return
    const nextStage = Math.min(dialogStage + 1, workflowSteps.length - 1)
    updateCustomerOrder(selectedOrder.id, { workflowStage: nextStage })
    setOrders(getCustomerOrders())
    setDialogStage(nextStage)
  }

  function goBackWorkflow() {
    if (!selectedOrder) return
    const previousStage = Math.max(dialogStage - 1, 0)
    updateCustomerOrder(selectedOrder.id, { workflowStage: previousStage })
    setOrders(getCustomerOrders())
    setDialogStage(previousStage)
  }

  function closeWorkflow() {
    setSelectedOrderId(null)
  }

  function handleCompleteOrder() {
    if (!selectedOrder) return
    toast.success(`Đã gửi email đường link tải file scan hoàn tất cho khách ${selectedOrder.senderName}!`)
    closeWorkflow()
  }

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "all") return true
    return o.status === statusFilter
  })

  const activeStep = workflowSteps[dialogStage] ?? workflowSteps[0]
  const currentLine = MOCK_PROCESSING_LINES.find((l) => l.id === selectedLineId)?.name || "Noritsu V30 Auto"

  return (
    <>
      <section aria-labelledby="customer-orders-title" className="w-full max-w-[720px] pb-12">
        <header className="flex min-h-[72px] items-center justify-between gap-3 px-1">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Croplab Hanoi · Film Lab Owner
            </p>
            <h1
              className="text-xl font-bold leading-[25px] tracking-tight text-foreground"
              id="customer-orders-title"
            >
              Hàng đợi xử lý đơn khách gửi
            </h1>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs" variant="outline">
            {orders.length} Đơn hàng
          </Badge>
        </header>

        {/* Filter status tabs */}
        <div className="flex flex-wrap items-center gap-1.5 px-1 pb-3">
          {[
            { id: "all", label: `Tất cả (${orders.length})` },
            { id: "pending", label: `Chờ duyệt (${orders.filter((o) => o.status === "pending").length})` },
            { id: "accepted", label: `Đang xử lý (${orders.filter((o) => o.status === "accepted").length})` },
            { id: "rejected", label: `Từ chối (${orders.filter((o) => o.status === "rejected").length})` },
          ].map((tab) => (
            <button
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {filteredOrders.length === 0 ? (
            <Card className="min-h-64 border-dashed shadow-none">
              <CardContent className="flex min-h-64 items-center p-4">
                <Empty className="border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ClipboardList aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>Không có đơn hàng nào</EmptyTitle>
                    <EmptyDescription>
                      Các đơn khách đặt từ trang Search hoặc form gửi film sẽ hiển thị tại đây.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </CardContent>
            </Card>
          ) : (
            <ul aria-label="Danh sách đơn hàng gửi tráng" className="flex flex-col gap-3 p-0 list-none m-0">
              {filteredOrders.map((order) => (
                <li key={order.id}>
                  <OrderCard
                    onApprove={(nextOrder) => openOrder(nextOrder, true)}
                    onContinue={(nextOrder) => openOrder(nextOrder)}
                    onReject={rejectOrder}
                    order={order}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 4-Step Order Workflow Dialog */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) closeWorkflow()
        }}
        open={selectedOrder !== null}
      >
        {selectedOrder && (
          <DialogContent
            className="flex h-[min(680px,calc(100dvh-2rem))] max-h-[calc(100dvh-2rem)] w-[min(700px,calc(100vw-2rem))] max-w-none flex-col gap-0 overflow-hidden rounded-[32px] p-0 sm:max-w-none"
            showCloseButton={false}
          >
            <div className="relative mx-5 flex h-[46px] shrink-0 items-center justify-between border-b">
              {dialogStage > 0 ? (
                <Button
                  aria-label="Previous step"
                  onClick={goBackWorkflow}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <ArrowLeft aria-hidden="true" />
                </Button>
              ) : (
                <div className="size-8" />
              )}
              <div className="flex items-center gap-2">
                <Badge className="text-[10px]" variant="outline">
                  Bước {dialogStage + 1}/{workflowSteps.length}
                </Badge>
                <DialogTitle className="truncate text-center text-[15px] leading-5 font-bold">
                  {activeStep}
                </DialogTitle>
              </div>
              <DialogDescription className="sr-only">
                Step {dialogStage + 1} of {workflowSteps.length}. Order status:{" "}
                {selectedOrder.status}.
              </DialogDescription>
              {dialogStage < workflowSteps.length - 1 ? (
                <Button
                  className="cursor-pointer rounded-full bg-[rgb(74,93,249)] px-3 text-xs font-semibold text-white hover:bg-[rgb(74,93,249)]/90"
                  onClick={advanceWorkflow}
                  size="sm"
                  type="button"
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  className="cursor-pointer rounded-full bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
                  onClick={closeWorkflow}
                  size="sm"
                  type="button"
                >
                  Hoàn tất
                </Button>
              )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-7">
              <div className="my-auto w-full">
                {dialogStage === 0 && <OrderDetails order={selectedOrder} />}
                {dialogStage === 1 && (
                  <WorkflowPanel
                    onSelectLine={setSelectedLineId}
                    selectedLine={selectedLineId}
                  />
                )}
                {dialogStage === 2 && <StatusPanel lineName={currentLine} />}
                {dialogStage === 3 && (
                  <UploadScansPanel
                    onCompleteOrder={handleCompleteOrder}
                    order={selectedOrder}
                  />
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
