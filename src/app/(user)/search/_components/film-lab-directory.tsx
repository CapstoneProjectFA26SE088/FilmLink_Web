"use client"

import {
  ArrowLeft,
  Calendar,
  Check,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Scan,
  Sparkles,
  Star,
  X,
} from "lucide-react"
import { type FormEvent, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { saveCustomerOrder } from "@/lib/customer-orders"
import { addUserNotification } from "@/lib/user-notifications"
import { type DetailedFilmLab, MOCK_FILM_LABS } from "../../mock_data"

type BookingStage = "details" | "order" | "confirmation"

type BookingForm = {
  senderName: string
  phone: string
  email: string
  returnAddress: string
  filmName: string
  format: string
  process: string
  rollCount: string
  pushPull: string
  delivery: string
  note: string
}

const emptyBookingForm: BookingForm = {
  senderName: "",
  phone: "",
  email: "",
  returnAddress: "",
  filmName: "",
  format: "",
  process: "",
  rollCount: "1",
  pushPull: "normal",
  delivery: "mail-in",
  note: "",
}

const filmFormats = ["35mm (135)", "120", "Large format"]

function getLabInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function FilmLabDetails({ lab, onContinue }: { lab: DetailedFilmLab; onContinue: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="relative mx-5 flex h-[46px] shrink-0 items-center justify-center border-b text-center">
        <DialogTitle className="text-[16px] leading-5 font-semibold">Film Lab Details</DialogTitle>
        <DialogDescription className="sr-only">
          Available information and processes for {lab.name}.
        </DialogDescription>
        <Button
          aria-label="Continue to booking"
          className="absolute top-2 right-2 cursor-pointer rounded-full bg-transparent px-3 text-[rgb(74,93,249)] font-semibold hover:bg-transparent hover:text-[rgb(74,93,249)] hover:underline"
          onClick={onContinue}
          size="sm"
          type="button"
          variant="ghost"
        >
          Đặt tráng film
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-7">
        <div className="my-auto w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background ring-2 ring-primary/20"
              >
                {getLabInitials(lab.name)}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold">{lab.name}</h2>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star aria-hidden="true" className="size-4 fill-amber-400 text-amber-400" />
                  {lab.rating.toFixed(1)} ({lab.reviewCount.toLocaleString("en-US")} đánh giá)
                </p>
              </div>
            </div>
            {lab.featuredBadge && (
              <Badge className="rounded-full bg-primary/10 text-primary border-primary/20" variant="secondary">
                {lab.featuredBadge}
              </Badge>
            )}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{lab.description}</p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card className="gap-1 rounded-xl py-3 shadow-none">
              <CardContent className="px-4">
                <p className="text-xs text-muted-foreground">Thời gian hoàn thành ước tính</p>
                <p className="pt-1 font-semibold text-sm">{lab.turnaround}</p>
              </CardContent>
            </Card>
            <Card className="gap-1 rounded-xl py-3 shadow-none">
              <CardContent className="px-4">
                <p className="text-xs text-muted-foreground">Gửi film bưu điện (Mail-in)</p>
                <p className="pt-1 font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                  {lab.acceptsMailIn ? "Hỗ trợ nhận toàn quốc" : "Chỉ nhận trực tiếp"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs className="mt-5 gap-0" defaultValue="overview">
            <TabsList
              className="grid h-11 w-full grid-cols-3 rounded-none border-b p-0"
              variant="line"
            >
              <TabsTrigger className="text-xs sm:text-sm font-medium" value="overview">
                Tổng quan
              </TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm font-medium" value="process">
                Quy trình & Máy Scan
              </TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm font-medium" value="pricing">
                Bảng giá dịch vụ
              </TabsTrigger>
            </TabsList>

            <TabsContent className="pt-4 text-sm" value="overview">
              <dl className="flex flex-col text-xs sm:text-sm">
                <div className="flex flex-col gap-1 border-b py-2.5 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-4" /> Địa chỉ
                  </dt>
                  <dd className="sm:text-right font-medium">{lab.address}</dd>
                </div>
                <div className="flex flex-col gap-1 border-b py-2.5 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-4" /> Hotline
                  </dt>
                  <dd className="sm:text-right font-medium">{lab.phone}</dd>
                </div>
                <div className="flex flex-col gap-1 border-b py-2.5 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-4" /> Email trả file
                  </dt>
                  <dd className="sm:text-right font-medium">{lab.email}</dd>
                </div>
                <div className="flex flex-col gap-1 py-2.5 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <Clock3 className="size-4" /> Giờ mở cửa
                  </dt>
                  <dd className="sm:text-right font-medium">{lab.openingHours}</dd>
                </div>
              </dl>
            </TabsContent>

            <TabsContent className="flex flex-col gap-4 pt-4" value="process">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                  Quy trình tráng hỗ trợ
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {lab.processes.map((process) => (
                    <Badge className="font-medium" key={process} variant="secondary">
                      {process}
                    </Badge>
                  ))}
                </div>
              </div>

              {lab.scanners && lab.scanners.length > 0 && (
                <div className="flex flex-col gap-2.5 pt-1">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                    Hệ thống máy scan chuyên nghiệp
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {lab.scanners.map((scanner) => (
                      <Card className="rounded-xl border bg-muted/20 p-3 shadow-none" key={scanner.name}>
                        <div className="flex items-start gap-2.5">
                          <Scan className="size-4 text-primary shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-xs text-foreground">{scanner.name}</span>
                            <span className="text-[11px] text-muted-foreground">{scanner.maxResolution}</span>
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                              {scanner.colorProfile}
                            </span>
                            <p className="text-[11px] text-muted-foreground pt-0.5">{scanner.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent className="pt-4" value="pricing">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Bảng giá tráng & scan cập nhật
                  </span>
                  <span className="text-xs text-muted-foreground">Đã bao gồm VAT & Scan link</span>
                </div>

                <div className="flex flex-col divide-y divide-border rounded-xl border bg-card">
                  {lab.pricing.map((item) => (
                    <div
                      className="flex items-center justify-between p-3 text-xs sm:text-sm hover:bg-muted/30 transition-colors"
                      key={item.name}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-foreground">{item.name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{item.format}</span>
                          <span>·</span>
                          <span>{item.turnaround}</span>
                          {item.notes && (
                            <>
                              <span>·</span>
                              <span className="italic text-muted-foreground/80">{item.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-[rgb(74,93,249)] shrink-0 pl-3">
                        {item.priceFormatted}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function BookingOrderForm({
  lab,
  form,
  formError,
  onChange,
  onBack,
  onSubmit,
}: {
  lab: DetailedFilmLab
  form: BookingForm
  formError: string
  onChange: <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => void
  onBack: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={onSubmit}>
      <div className="relative mx-5 flex h-[46px] shrink-0 items-center justify-between gap-2 border-b">
        <Button
          aria-label="Back to lab details"
          onClick={onBack}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        <DialogTitle className="absolute left-1/2 max-w-[calc(100%-11rem)] -translate-x-1/2 truncate text-center text-[16px] leading-5 font-semibold sm:max-w-[calc(100%-19rem)]">
          Đặt tráng phim &amp; Thông tin cuộn
        </DialogTitle>
        <Button
          aria-label="Xác nhận đặt đơn"
          className="ml-auto cursor-pointer rounded-full bg-[rgb(74,93,249)] px-4 text-xs font-semibold text-white hover:bg-[rgb(74,93,249)]/90"
          size="sm"
          type="submit"
        >
          Xác nhận đặt
        </Button>
        <DialogDescription className="sr-only">
          Enter sender details and the film rolls you want to send to {lab.name}.
        </DialogDescription>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-muted/40 p-3 border border-border/50">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background"
          >
            {getLabInitials(lab.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{lab.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {lab.city}, {lab.country} · Hotline: {lab.phone}
            </p>
          </div>
          <Badge className="shrink-0" variant="secondary">
            Lab được chọn
          </Badge>
        </div>

        <FieldSet>
          <FieldLegend className="text-xs uppercase text-muted-foreground font-semibold" variant="label">
            1. Thông tin người gửi film
          </FieldLegend>
          <FieldGroup className="gap-3 rounded-xl border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="sender-name">Họ và tên</FieldLabel>
                <Input
                  autoComplete="name"
                  id="sender-name"
                  name="senderName"
                  placeholder="Ví dụ: Nguyễn Hoàng"
                  required
                  value={form.senderName}
                  onChange={(event) => onChange("senderName", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sender-phone">Số điện thoại</FieldLabel>
                <Input
                  autoComplete="tel"
                  id="sender-phone"
                  name="phone"
                  placeholder="Ví dụ: 0912 345 678"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) => onChange("phone", event.target.value)}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="sender-email">Email nhận link ảnh scan</FieldLabel>
              <Input
                autoComplete="email"
                id="sender-email"
                name="email"
                placeholder="email@example.com"
                required
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="return-address">Địa chỉ nhận lại âm bản sau khi tráng</FieldLabel>
              <Input
                autoComplete="street-address"
                id="return-address"
                name="returnAddress"
                placeholder="Số nhà, đường, phường, quận, thành phố"
                required
                value={form.returnAddress}
                onChange={(event) => onChange("returnAddress", event.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="mt-5">
          <FieldLegend className="text-xs uppercase text-muted-foreground font-semibold" variant="label">
            2. Chi tiết cuộn phim &amp; Quy trình
          </FieldLegend>
          <FieldGroup className="gap-3 rounded-xl border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="film-name">Tên loại phim</FieldLabel>
                <Input
                  id="film-name"
                  name="filmName"
                  placeholder="Ví dụ: Kodak Portra 400"
                  required
                  value={form.filmName}
                  onChange={(event) => onChange("filmName", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Định dạng phim</FieldLabel>
                <Select
                  value={form.format || null}
                  onValueChange={(value) => onChange("format", value ?? "")}
                >
                  <SelectTrigger aria-label="Định dạng phim" className="w-full">
                    <SelectValue placeholder="Chọn định dạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filmFormats.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Quy trình tráng</FieldLabel>
                <Select
                  value={form.process || null}
                  onValueChange={(value) => onChange("process", value ?? "")}
                >
                  <SelectTrigger aria-label="Quy trình tráng" className="w-full">
                    <SelectValue placeholder="Chọn quy trình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {lab.processes.map((process) => (
                        <SelectItem key={process} value={process}>
                          {process}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="roll-count">Số cuộn</FieldLabel>
                  <Input
                    id="roll-count"
                    max="99"
                    min="1"
                    name="rollCount"
                    required
                    type="number"
                    value={form.rollCount}
                    onChange={(event) => onChange("rollCount", event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Push / Pull ISO</FieldLabel>
                  <Select
                    value={form.pushPull}
                    onValueChange={(value) => onChange("pushPull", value ?? "normal")}
                  >
                    <SelectTrigger aria-label="Push hoặc Pull exposure" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="normal">Normal (Chuẩn)</SelectItem>
                        <SelectItem value="push-1">Push +1 stop</SelectItem>
                        <SelectItem value="push-2">Push +2 stop</SelectItem>
                        <SelectItem value="pull-1">Pull -1 stop</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
            <Field>
              <FieldLabel htmlFor="lab-note">Ghi chú cho kỹ thuật viên Lab</FieldLabel>
              <Textarea
                id="lab-note"
                name="note"
                placeholder="Yêu cầu đặc biệt về màu sắc, máy scan Noritsu/Frontier, cắt sleeve âm bản..."
                value={form.note}
                onChange={(event) => onChange("note", event.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="mt-5">
          <FieldLegend className="text-xs uppercase text-muted-foreground font-semibold" variant="label">
            3. Phương thức gửi film
          </FieldLegend>
          <FieldGroup className="gap-3 rounded-xl border p-4">
            <RadioGroup
              className="grid gap-3 sm:grid-cols-2"
              value={form.delivery}
              onValueChange={(value) => onChange("delivery", value)}
            >
              <FieldLabel className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal hover:bg-muted/30">
                <RadioGroupItem aria-label="Gửi bưu điện" value="mail-in" />
                <span>
                  <span className="block text-sm font-semibold">Gửi qua bưu điện (Mail-in)</span>
                  <span className="text-xs text-muted-foreground">
                    Đóng hộp gửi film đến địa chỉ của Lab
                  </span>
                </span>
              </FieldLabel>
              <FieldLabel className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal hover:bg-muted/30">
                <RadioGroupItem aria-label="Mang trực tiếp" value="drop-off" />
                <span>
                  <span className="block text-sm font-semibold">Mang trực tiếp đến Lab</span>
                  <span className="text-xs text-muted-foreground">
                    Ghé địa chỉ lab trong giờ làm việc
                  </span>
                </span>
              </FieldLabel>
            </RadioGroup>
          </FieldGroup>
        </FieldSet>

        {formError && (
          <p className="mt-4 text-sm text-destructive font-medium" role="alert">
            {formError}
          </p>
        )}

        <FieldSet className="mt-5">
          <FieldLegend className="text-xs uppercase text-muted-foreground font-semibold" variant="label">
            4. Tóm tắt đơn hàng dự kiến
          </FieldLegend>
          <Card className="gap-2 rounded-xl bg-muted/30 py-3 shadow-none border border-border/60">
            <CardHeader className="p-0 px-4">
              <CardTitle className="text-sm font-semibold text-foreground">
                {form.rollCount || "0"} cuộn · {form.format || "Chưa chọn định dạng"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-4 text-xs text-muted-foreground">
              <span>
                {lab.name} · {form.process || "Chưa chọn quy trình"} · {form.pushPull || "Normal"}
              </span>
              <span>
                Lab sẽ xác nhận đơn và gửi mã theo dõi ngay khi nhận được bưu kiện film.
              </span>
            </CardContent>
          </Card>
        </FieldSet>
      </div>
    </form>
  )
}

function OrderConfirmation({ lab, onClose }: { lab: DetailedFilmLab; onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Check aria-hidden="true" className="size-7" />
      </div>
      <div>
        <DialogTitle className="text-lg font-bold">Đặt tráng film thành công!</DialogTitle>
        <DialogDescription className="mt-2 max-w-md text-sm text-muted-foreground">
          Đơn đặt tráng cho <strong className="text-foreground">{lab.name}</strong> đã được lưu thành công vào hệ thống. Bạn có thể theo dõi đơn này tại mục Quản lý đơn hàng (Customer Orders) của Lab Owner.
        </DialogDescription>
      </div>
      <Button
        className="bg-[rgb(74,93,249)] text-white hover:bg-[rgb(74,93,249)]/90 px-6 rounded-full"
        onClick={onClose}
        type="button"
      >
        Hoàn tất &amp; Đóng
      </Button>
    </div>
  )
}

export interface FilmLabDirectoryProps {
  searchQuery?: string
  filterChip?: string
  cityFilter?: string
  processFilter?: string
  turnaroundFilter?: string
  mailInOnly?: boolean
  sortBy?: "rating" | "turnaround" | "reviews"
}

export function FilmLabDirectory({
  searchQuery = "",
  filterChip = "",
  cityFilter = "all",
  processFilter = "all",
  turnaroundFilter = "all",
  mailInOnly = false,
  sortBy = "rating",
}: FilmLabDirectoryProps) {
  const [selectedLab, setSelectedLab] = useState<DetailedFilmLab | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [stage, setStage] = useState<BookingStage>("details")
  const [form, setForm] = useState<BookingForm>(emptyBookingForm)
  const [formError, setFormError] = useState("")

  const filteredLabs = useMemo(() => {
    let result = MOCK_FILM_LABS.filter((lab) => {
      // 1. Filter by chip if selected
      if (filterChip && filterChip !== "All Labs") {
        const chip = filterChip.toLowerCase()
        const matchCity = lab.city.toLowerCase().includes(chip)
        const matchCountry = lab.country.toLowerCase().includes(chip)
        const matchProcess = lab.processes.some((p) => p.toLowerCase().includes(chip))
        const matchSameDay = chip.includes("same day") && lab.turnaround === "Same Day"
        const matchName = lab.name.toLowerCase().includes(chip)
        if (!matchCity && !matchCountry && !matchProcess && !matchSameDay && !matchName) {
          return false
        }
      }

      // 2. City Filter
      if (cityFilter !== "all") {
        if (!lab.city.toLowerCase().includes(cityFilter.toLowerCase())) {
          return false
        }
      }

      // 3. Process Filter
      if (processFilter !== "all") {
        const hasProcess = lab.processes.some((p) =>
          p.toLowerCase().includes(processFilter.toLowerCase())
        )
        if (!hasProcess) return false
      }

      // 4. Turnaround Filter
      if (turnaroundFilter !== "all") {
        if (turnaroundFilter === "same_day" && lab.turnaround !== "Same Day") return false
        if (turnaroundFilter === "1_2_days" && !lab.turnaround.includes("1-2")) return false
        if (turnaroundFilter === "3_5_days" && !lab.turnaround.includes("3-5")) return false
      }

      // 5. Mail-in only
      if (mailInOnly && !lab.acceptsMailIn) {
        return false
      }

      // 6. Text search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = lab.name.toLowerCase().includes(query)
        const matchCity = lab.city.toLowerCase().includes(query)
        const matchCountry = lab.country.toLowerCase().includes(query)
        const matchAddress = lab.address.toLowerCase().includes(query)
        const matchProcess = lab.processes.some((p) => p.toLowerCase().includes(query))
        const matchDesc = lab.description.toLowerCase().includes(query)
        return matchName || matchCity || matchCountry || matchAddress || matchProcess || matchDesc
      }

      return true
    })

    // Sorting
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "reviews") {
      result.sort((a, b) => b.reviewCount - a.reviewCount)
    } else if (sortBy === "turnaround") {
      result.sort((a, b) => (a.turnaround === "Same Day" ? -1 : 1))
    }

    return result
  }, [searchQuery, filterChip, cityFilter, processFilter, turnaroundFilter, mailInOnly, sortBy])

  function selectLab(lab: DetailedFilmLab) {
    setSelectedLab(lab)
    setForm({ ...emptyBookingForm, process: lab.processes[0] ?? "" })
    setFormError("")
    setStage("details")
    setDialogOpen(true)
  }

  function updateFormField<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setFormError("")
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.format || !form.process) {
      const message = "Vui lòng chọn định dạng phim và quy trình tráng để tiếp tục."
      setFormError(message)
      toast.error(message)
      return
    }
    if (!selectedLab) return

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`

    saveCustomerOrder({
      id: orderId,
      labId: selectedLab.id,
      labName: selectedLab.name,
      ...form,
      createdAt: new Date().toISOString(),
      status: "pending",
      workflowStage: 0,
    })

    // Gửi thông báo cho user
    addUserNotification({
      orderId,
      labName: selectedLab.name,
      title: "Đơn tráng mới đã gửi",
      message: `Đơn #${orderId} (${form.filmName}) đã gửi tới ${selectedLab.name}. Lab sẽ sớm xác nhận đơn của bạn.`,
      type: "order_created",
    })

    setStage("confirmation")
    toast.success("Đơn đặt tráng đã được gửi tới Lab thành công!")
  }

  function closeDialog() {
    setDialogOpen(false)
    setStage("details")
  }

  return (
    <>
      <section aria-labelledby="film-lab-results-title" className="flex flex-col gap-4">
        <header className="flex items-start justify-between gap-4 px-1">
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-6" id="film-lab-results-title">
              Danh bạ Film Lab uy tín ({filteredLabs.length})
            </h2>
            <p className="pt-0.5 text-sm leading-5 text-muted-foreground">
              Tìm kiếm lab tráng scan phim phù hợp theo khu vực, bảng giá và loại quy trình.
            </p>
          </div>
          <span className="shrink-0 pt-1 text-xs text-muted-foreground">Film Labs</span>
        </header>

        {filteredLabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center">
            <p className="text-sm font-semibold text-foreground">Không tìm thấy Film Lab nào phù hợp</p>
            <p className="text-xs text-muted-foreground">
              Thử xóa từ khóa tìm kiếm hoặc chọn danh mục khác.
            </p>
          </div>
        ) : (
          <ul aria-label="Danh sách Film lab" className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-0 list-none m-0">
            {filteredLabs.map((lab) => (
              <li className="list-none" key={lab.id}>
                <Card className="grid h-full grid-cols-[minmax(88px,26%)_minmax(0,1fr)] items-stretch gap-0 overflow-hidden rounded-2xl border-border p-0 shadow-none ring-1 ring-foreground/5 hover:ring-foreground/10 transition-all">
                  <CardHeader className="flex items-center justify-center p-3 bg-muted/20">
                    <div
                      aria-label={`${lab.name} logo`}
                      className="flex size-16 items-center justify-center rounded-full bg-foreground text-base font-semibold text-background sm:size-20 shadow-sm"
                      role="img"
                    >
                      {getLabInitials(lab.name)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex min-w-0 flex-col gap-3 px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-[15px] font-semibold leading-5 text-foreground">
                          {lab.name}
                        </CardTitle>
                        <p className="pt-0.5 text-xs text-muted-foreground">
                          {lab.city}, {lab.country}
                        </p>
                      </div>
                      {lab.featuredBadge && (
                        <Badge className="shrink-0 rounded-full text-[11px] bg-primary/10 text-primary border-primary/20" variant="secondary">
                          {lab.featuredBadge}
                        </Badge>
                      )}
                    </div>

                    <dl className="flex flex-col gap-1.5 text-xs">
                      <div className="flex items-start gap-1.5">
                        <dt className="flex shrink-0 items-center gap-1 text-muted-foreground">
                          <MapPin aria-hidden="true" className="size-3.5" />
                          Đ/c:
                        </dt>
                        <dd className="min-w-0 truncate text-foreground">{lab.address}</dd>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {lab.processes.map((proc) => (
                          <Badge className="text-[10px] px-1.5 py-0" key={proc} variant="outline">
                            {proc}
                          </Badge>
                        ))}
                      </div>
                    </dl>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-2.5 mt-auto">
                      <div
                        aria-label={`${lab.rating.toFixed(1)} sao, ${lab.reviewCount} đánh giá`}
                        className="inline-flex items-center gap-1 text-xs"
                        role="img"
                      >
                        <Star aria-hidden="true" className="size-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{lab.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">
                          ({lab.reviewCount})
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 aria-hidden="true" className="size-3" />
                        {lab.turnaround}
                      </span>
                    </div>

                    <div className="flex justify-end pt-1">
                      <Button
                        className="h-8 rounded-full bg-[rgb(74,93,249)] px-4 text-xs font-semibold text-white hover:bg-[rgb(74,93,249)]/90"
                        onClick={() => selectLab(lab)}
                        type="button"
                      >
                        Xem &amp; Đặt tráng
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedLab && (
          <DialogContent
            className="flex h-[min(680px,calc(100dvh-2rem))] max-h-[calc(100dvh-2rem)] w-[min(684px,calc(100vw-2rem))] max-w-none flex-col gap-0 overflow-hidden rounded-[32px] p-0 sm:max-w-none"
            showCloseButton={false}
          >
            {stage === "confirmation" && (
              <DialogClose
                render={
                  <Button
                    aria-label="Close"
                    className="absolute top-2 right-2"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  />
                }
              >
                <X aria-hidden="true" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
            {stage === "details" && (
              <FilmLabDetails lab={selectedLab} onContinue={() => setStage("order")} />
            )}
            {stage === "order" && (
              <BookingOrderForm
                form={form}
                formError={formError}
                lab={selectedLab}
                onBack={() => setStage("details")}
                onChange={updateFormField}
                onSubmit={submitOrder}
              />
            )}
            {stage === "confirmation" && (
              <OrderConfirmation lab={selectedLab} onClose={closeDialog} />
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
