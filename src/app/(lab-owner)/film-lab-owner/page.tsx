"use client"

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  Droplets,
  Film,
  Layers,
  Package,
  Scan,
  TrendingUp,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MOCK_LAB_DASHBOARD } from "../mock_data"

export default function FilmLabOwnerPage() {
  const { labName, ownerName, kpis, queueStatus, chemicalBaths, scanners, recentActivities } =
    MOCK_LAB_DASHBOARD

  return (
    <section aria-labelledby="owner-page-title" className="w-full max-w-[840px] pb-12">
      {/* Top Header */}
      <header className="flex min-h-[72px] flex-col justify-center sm:flex-row sm:items-center sm:justify-between gap-2 px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground" id="owner-page-title">
              {labName}
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
              ● Đang mở cửa
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground pt-0.5">
            Quản trị viên: <span className="font-medium text-foreground">{ownerName}</span> · Hệ thống vận hành tráng scan thông minh
          </p>
        </div>

        <Link href="/film-lab-owner/customer-orders">
          <Button
            className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90 rounded-xl text-xs h-9"
            size="sm"
          >
            Hàng đợi đơn hàng
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </Link>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-4">
        <Card className="rounded-2xl border-border bg-card shadow-none">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-medium text-muted-foreground">{kpis.todayOrders.title}</span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">{kpis.todayOrders.value}</span>
              <span className="text-xs text-muted-foreground">{kpis.todayOrders.unit}</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3" />
              {kpis.todayOrders.trend}
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-none">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-medium text-muted-foreground">{kpis.inQueueRolls.title}</span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">{kpis.inQueueRolls.value}</span>
              <span className="text-xs text-muted-foreground">{kpis.inQueueRolls.unit}</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[11px] text-muted-foreground line-clamp-1">
              {kpis.inQueueRolls.trend}
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-none">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-medium text-muted-foreground">{kpis.monthlyRevenue.title}</span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">{kpis.monthlyRevenue.value}</span>
              <span className="text-xs text-muted-foreground">{kpis.monthlyRevenue.unit}</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3" />
              {kpis.monthlyRevenue.trend}
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-none">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-medium text-muted-foreground">{kpis.turnaroundTime.title}</span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">{kpis.turnaroundTime.value}</span>
              <span className="text-xs text-muted-foreground">{kpis.turnaroundTime.unit}</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <Clock className="size-3" />
              {kpis.turnaroundTime.trend}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Queue Progress Overview */}
      <Card className="rounded-2xl border-border bg-card shadow-none mt-4">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-[rgb(74,93,249)]" />
              <CardTitle className="text-sm font-semibold">Tiến độ hàng đợi xử lý hôm nay</CardTitle>
            </div>
            <Link
              className="text-xs font-medium text-[rgb(74,93,249)] hover:underline flex items-center gap-1"
              href="/film-lab-owner/customer-orders"
            >
              Xem chi tiết <ArrowRight className="size-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {queueStatus.map((item) => (
              <div
                className="flex flex-col gap-1 rounded-xl border border-border/70 bg-muted/20 p-3"
                key={item.stage}
              >
                <span className="text-xs text-muted-foreground">{item.stage}</span>
                <span className={`text-xl font-bold ${item.color}`}>{item.count}</span>
                <span className="text-[10px] text-muted-foreground">đơn hàng</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
        {/* Chemical Bath Monitor */}
        <Card className="rounded-2xl border-border bg-card shadow-none">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="size-4 text-cyan-500" />
                <CardTitle className="text-sm font-semibold">Tình trạng bể hóa chất</CardTitle>
              </div>
              <Badge className="text-[10px]" variant="outline">
                4 Bể thuốc
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Theo dõi dung tích thuốc hiện, thuốc tẩy remjet và hãm
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-1 flex flex-col gap-3.5">
            {chemicalBaths.map((chem) => (
              <div className="flex flex-col gap-1.5" key={chem.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{chem.name}</span>
                  <span className={`font-semibold ${chem.healthPercent < 50 ? "text-amber-500" : "text-emerald-500"}`}>
                    {chem.healthPercent}% ({chem.remainingRolls} cuộn)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all ${
                      chem.healthPercent < 50 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${chem.healthPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Nhiệt độ: {chem.temperatureCelsius}°C</span>
                  <span>{chem.lastMixed}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Scanner Hardware Status */}
        <Card className="rounded-2xl border-border bg-card shadow-none">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scan className="size-4 text-indigo-500" />
                <CardTitle className="text-sm font-semibold">Hệ thống máy Scan</CardTitle>
              </div>
              <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                2 máy hoạt động
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Hiệu suất và tiến độ số hóa ảnh âm bản
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-1 flex flex-col gap-3">
            {scanners.map((sc) => (
              <div
                className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-muted/20 p-3"
                key={sc.id}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{sc.name}</span>
                  <Badge
                    className={`text-[10px] ${
                      sc.status === "scanning"
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                    variant="outline"
                  >
                    {sc.status === "scanning" ? "● Đang scan" : "Chờ việc"}
                  </Badge>
                </div>
                {sc.currentJob && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {sc.currentJob}
                  </p>
                )}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5 border-t border-border/40">
                  <span>Hôm nay: {sc.completedToday} cuộn</span>
                  <span>Hiệu suất: {sc.efficiency}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Log */}
      <Card className="rounded-2xl border-border bg-card shadow-none mt-4">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-[rgb(74,93,249)]" />
              <CardTitle className="text-sm font-semibold">Nhật ký hoạt động gần đây</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">Thời gian thực</span>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="flex flex-col divide-y divide-border/60">
            {recentActivities.map((act) => (
              <div className="flex items-start gap-3 py-3" key={act.id}>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground mt-0.5">
                  {act.type === "ai_passed" && <Zap className="size-3.5 text-purple-500" />}
                  {act.type === "order_approved" && <CheckCircle2 className="size-3.5 text-blue-500" />}
                  {act.type === "order_completed" && <Film className="size-3.5 text-emerald-500" />}
                  {act.type === "chemical_alert" && <AlertTriangle className="size-3.5 text-amber-500" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">{act.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-0.5">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
