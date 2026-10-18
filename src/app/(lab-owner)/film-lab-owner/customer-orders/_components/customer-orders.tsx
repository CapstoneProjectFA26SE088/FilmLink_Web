"use client"

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  FlaskConical,
  ScanLine,
  Upload,
} from "lucide-react"
import { useEffect, useState } from "react"
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

const workflowSteps = ["Customer Order Details", "Workflow", "Processing Status", "Upload Scans"]

const testOrder: CustomerOrder = {
  id: "TEST-001",
  labId: "test-lab",
  labName: "Test Film Lab",
  senderName: "Test Customer",
  phone: "000-000-0000",
  email: "test@example.com",
  returnAddress: "Test return address",
  filmName: "Test Roll",
  format: "35mm (135)",
  process: "C-41",
  rollCount: "1",
  pushPull: "normal",
  delivery: "mail-in",
  note: "TEST ORDER — sample data for trying the Owner workflow.",
  createdAt: "2026-10-15T00:00:00.000Z",
  status: "pending",
  workflowStage: 0,
}

function displayValue(value: string) {
  return value.trim() || "—"
}

function formatCreatedAt(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date)
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
    <Card>
      <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <CardTitle className="text-sm font-semibold">
            Order {order.id.slice(-8).toUpperCase()}
          </CardTitle>
          <CardDescription>{formatCreatedAt(order.createdAt)}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {order.id === "TEST-001" && <Badge variant="secondary">TEST ORDER</Badge>}
          <Badge variant={order.status === "rejected" ? "destructive" : "outline"}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        <OrderField label="Customer" value={order.senderName} />
        <OrderField label="Film Lab" value={order.labName} />
        <OrderField
          label="Film and process"
          value={[order.filmName, order.format, order.process].filter(Boolean).join(" · ")}
        />
        <OrderField label="Rolls and delivery" value={`${order.rollCount} · ${order.delivery}`} />
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
        {order.status === "pending" && (
          <>
            <Button onClick={() => onReject(order.id)} variant="outline">
              Reject
            </Button>
            <Button
              className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)] hover:text-white"
              onClick={() => onApprove(order)}
            >
              <Check data-icon="inline-start" />
              Approve
            </Button>
          </>
        )}
        {order.status === "accepted" && (
          <Button
            className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)] hover:text-white"
            onClick={() => onContinue(order)}
          >
            Continue workflow <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function OrderDetails({ order }: { order: CustomerOrder }) {
  return (
    <div className="flex flex-col gap-5">
      <section aria-labelledby="customer-info-title" className="flex flex-col gap-2">
        <h3
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          id="customer-info-title"
        >
          Customer information
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <OrderField label="Name" value={order.senderName} />
          <OrderField label="Phone" value={order.phone} />
          <OrderField label="Email" value={order.email} />
          <OrderField label="Return address" value={order.returnAddress} />
        </div>
      </section>
      <section aria-labelledby="film-order-title" className="flex flex-col gap-2">
        <h3
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          id="film-order-title"
        >
          Film and service
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <OrderField label="Film name" value={order.filmName} />
          <OrderField label="Film Lab" value={order.labName} />
          <OrderField label="Format" value={order.format} />
          <OrderField label="Development process" value={order.process} />
          <OrderField label="Roll count" value={order.rollCount} />
          <OrderField label="Push / pull" value={order.pushPull} />
          <OrderField label="Shipping method" value={order.delivery} />
          <OrderField label="Customer notes" value={order.note} />
        </div>
      </section>
      <Card className="gap-2 rounded-xl bg-muted/30 py-3 shadow-none">
        <CardHeader className="p-0 px-4">
          <CardTitle className="text-sm font-medium">Estimated order summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 px-4 text-xs text-muted-foreground">
          <span>
            {displayValue(order.rollCount)} rolls · {displayValue(order.format)}
          </span>
          <span>
            {order.labName} · {displayValue(order.process)} · {displayValue(order.pushPull)}
          </span>
          <span>The lab will confirm pricing; prices are not available in this order.</span>
        </CardContent>
      </Card>
    </div>
  )
}

function WorkflowPanel() {
  return (
    <div className="flex flex-col gap-5">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Processing line</CardTitle>
          <CardDescription>
            Line assignment will be available when lab operations are connected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled variant="outline">
            Select processing line
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2">
        <WorkflowStage title="Develop" detail="Film development stage" />
        <WorkflowStage title="Scan" detail="Digitization after development" />
      </div>
    </div>
  )
}

function StatusPanel() {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardContent className="flex flex-col gap-4 pt-4">
          <StatusRow number="01" title="Develop" detail="Film is processed in the lab." />
          <div className="ml-5 h-5 border-l border-dashed" />
          <StatusRow number="02" title="Scan" detail="Developed film is digitized." />
        </CardContent>
      </Card>
    </div>
  )
}

function UploadScansPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-5 py-8 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Upload aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">High-resolution scan files</p>
          <p className="text-xs text-muted-foreground">File upload is not connected.</p>
        </div>
        <Button disabled variant="outline">
          Select files
        </Button>
      </div>
      <Card className="bg-muted/20 shadow-none">
        <CardContent className="flex items-start gap-3 pt-4">
          <ScanLine aria-hidden="true" className="mt-0.5 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">AI Quality Check</p>
            <p className="text-xs leading-5 text-muted-foreground">
              AI validation will be available when the scan workflow is connected.
            </p>
          </div>
          <Badge className="ml-auto" variant="secondary">
            Pending
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}

function WorkflowStage({ title, detail }: { title: string; detail: string }) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex items-start gap-3 pt-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold text-muted-foreground">
          <FlaskConical aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs leading-5 text-muted-foreground">{detail}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusRow({ number, title, detail }: { number: string; title: string; detail: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {number}
      </span>
      <div className="flex flex-col gap-1 pt-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs leading-5 text-muted-foreground">{detail}</p>
      </div>
      <Badge className="ml-auto" variant="outline">
        Pending
      </Badge>
    </div>
  )
}

export function CustomerOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [dialogStage, setDialogStage] = useState(0)
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null

  useEffect(() => {
    const syncOrders = () => {
      const savedOrders = getCustomerOrders()
      if (savedOrders.length === 0) {
        saveCustomerOrder(testOrder)
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
  }

  function openOrder(order: CustomerOrder, approve = false) {
    if (approve) updateCustomerOrder(order.id, { status: "accepted" })
    setOrders(getCustomerOrders())
    setSelectedOrderId(order.id)
    setDialogStage(approve ? 0 : order.workflowStage)
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

  const activeStep = workflowSteps[dialogStage] ?? workflowSteps[0]

  return (
    <>
      <section aria-labelledby="customer-orders-title" className="w-full max-w-[640px] pb-12">
        <header className="flex min-h-[72px] items-center justify-between gap-3 px-1">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Film Lab Owner
            </p>
            <h1
              className="text-xl font-semibold leading-[25px] tracking-tight"
              id="customer-orders-title"
            >
              Film Processing Queue
            </h1>
          </div>
          <Badge variant="outline">Customer Orders</Badge>
        </header>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 px-1">
            <h2 className="text-base font-semibold">Incoming orders</h2>
            <p className="text-sm leading-5 text-muted-foreground">
              Review the order details submitted by customers and choose Approve or Reject.
            </p>
          </div>

          {orders.length === 0 ? (
            <Card className="min-h-64 border-dashed shadow-none">
              <CardContent className="flex min-h-64 items-center p-4">
                <Empty className="border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ClipboardList aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>No incoming orders</EmptyTitle>
                    <EmptyDescription>
                      Orders submitted from the User booking form in this browser will appear here.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </CardContent>
            </Card>
          ) : (
            <ul aria-label="Incoming customer orders" className="flex flex-col gap-3">
              {orders.map((order) => (
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

      <Dialog
        onOpenChange={(open) => {
          if (!open) closeWorkflow()
        }}
        open={selectedOrder !== null}
      >
        {selectedOrder && (
          <DialogContent
            className="flex h-[min(680px,calc(100dvh-2rem))] max-h-[calc(100dvh-2rem)] w-[min(684px,calc(100vw-2rem))] max-w-none flex-col gap-0 overflow-hidden rounded-[40px] p-0 sm:max-w-none"
            showCloseButton={false}
          >
            <div className="relative mx-5 flex h-[42px] shrink-0 items-center justify-center border-b">
              {dialogStage > 0 && (
                <Button
                  aria-label="Previous step"
                  className="absolute top-2 left-0"
                  onClick={goBackWorkflow}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <ArrowLeft aria-hidden="true" />
                </Button>
              )}
              <DialogTitle className="max-w-[calc(100%-11rem)] truncate text-center text-[16px] leading-5 font-semibold">
                {activeStep}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Step {dialogStage + 1} of {workflowSteps.length}. Order status:{" "}
                {selectedOrder.status}.
              </DialogDescription>
              {dialogStage < workflowSteps.length - 1 ? (
                <Button
                  className="absolute top-2 right-0 cursor-pointer rounded-full bg-transparent px-2 text-[rgb(74,93,249)] hover:bg-transparent hover:text-[rgb(74,93,249)] hover:underline sm:px-3"
                  onClick={advanceWorkflow}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="absolute top-2 right-0 cursor-pointer rounded-full bg-transparent px-2 text-[rgb(74,93,249)] hover:bg-transparent hover:text-[rgb(74,93,249)] hover:underline sm:px-3"
                  onClick={closeWorkflow}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Done
                </Button>
              )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-7">
              <div className="my-auto w-full">
                {dialogStage === 0 && <OrderDetails order={selectedOrder} />}
                {dialogStage === 1 && <WorkflowPanel />}
                {dialogStage === 2 && <StatusPanel />}
                {dialogStage === 3 && <UploadScansPanel />}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
