"use client"

import { ArrowLeft, Check, Clock3, MapPin, Star, X } from "lucide-react"
import { useState, type FormEvent } from "react"
import { toast } from "react-toastify"
import type { IFilmLab } from "@/types"
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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VERIFIED_FILM_LABS } from "@/lib/landing-data"

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

function FilmLabDetails({ lab, onContinue }: { lab: IFilmLab; onContinue: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="relative mx-5 flex h-[42px] shrink-0 items-center justify-center border-b text-center">
        <DialogTitle className="text-[16px] leading-5 font-semibold">Film Lab Details</DialogTitle>
        <DialogDescription className="sr-only">
          Available information and processes for {lab.name}.
        </DialogDescription>
        <Button
          aria-label="Continue to booking"
          className="absolute top-2 right-2 cursor-pointer rounded-full bg-transparent px-2 text-[rgb(74,93,249)] hover:bg-transparent hover:text-[rgb(74,93,249)] hover:underline sm:px-3"
          onClick={onContinue}
          size="sm"
          type="button"
          variant="ghost"
        >
          Next
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-7">
        <div className="my-auto w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
              >
                {getLabInitials(lab.name)}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold">{lab.name}</h2>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star aria-hidden="true" className="size-4 fill-amber-400 text-amber-400" />
                  {lab.rating.toFixed(1)} ({lab.reviewCount.toLocaleString("en-US")} reviews)
                </p>
              </div>
            </div>
            <Badge className="rounded-full" variant="secondary">
              {lab.featuredBadge ?? "Film Lab"}
            </Badge>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card className="gap-1 rounded-xl py-3 shadow-none">
              <CardContent className="px-4">
                <p className="text-xs text-muted-foreground">Estimated turnaround time</p>
                <p className="pt-1 font-semibold">{lab.turnaround}</p>
              </CardContent>
            </Card>
            <Card className="gap-1 rounded-xl py-3 shadow-none">
              <CardContent className="px-4">
                <p className="text-xs text-muted-foreground">Mail-in service</p>
                <p className="pt-1 font-semibold">
                  {lab.acceptsMailIn ? "Available" : "Not confirmed"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs className="mt-5 gap-0" defaultValue="overview">
            <TabsList
              className="grid h-11 w-full grid-cols-3 rounded-none border-b p-0"
              variant="line"
            >
              <TabsTrigger className="text-xs sm:text-sm" value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm" value="process">
                Process
              </TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm" value="pricing">
                Pricing
              </TabsTrigger>
            </TabsList>
            <TabsContent className="pt-4" value="overview">
              <dl className="flex flex-col">
                <div className="flex flex-col gap-1 border-b py-3 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd className="sm:text-right">{lab.address}</dd>
                </div>
                <div className="flex flex-col gap-1 border-b py-3 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-muted-foreground">Region</dt>
                  <dd className="sm:text-right">
                    {lab.city}, {lab.country}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-6">
                  <dt className="text-muted-foreground">Film drop-off</dt>
                  <dd className="sm:text-right">
                    {lab.acceptsMailIn ? "In person and by mail" : "No information available"}
                  </dd>
                </div>
              </dl>
            </TabsContent>
            <TabsContent className="flex flex-col gap-4 pt-4" value="process">
              <div>
                <h3 className="font-medium">Available processes</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {lab.processes.map((process) => (
                    <Badge key={process} variant="outline">
                      {process}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                Scanner details and a step-by-step scanning workflow are not available in the
                project data yet.
              </p>
            </TabsContent>
            <TabsContent className="pt-4" value="pricing">
              <div className="rounded-xl border border-dashed p-5 text-center">
                <p className="font-medium">Pricing not available</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Film development and scanning prices must be confirmed by the lab before booking.
                </p>
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
  lab: IFilmLab
  form: BookingForm
  formError: string
  onChange: <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => void
  onBack: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={onSubmit}>
      <div className="relative mx-5 flex h-[42px] shrink-0 items-center justify-between gap-2 border-b">
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
          Film Roll Details &amp; Booking
        </DialogTitle>
        <Button
          aria-label="Booking"
          className="ml-auto cursor-pointer rounded-full bg-transparent px-2 text-[rgb(74,93,249)] hover:bg-transparent hover:text-[rgb(74,93,249)] hover:underline sm:px-3"
          size="sm"
          type="submit"
          variant="ghost"
        >
          Booking
        </Button>
        <DialogDescription className="sr-only">
          Enter sender details and the film rolls you want to send to {lab.name}.
        </DialogDescription>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-background p-3">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background"
          >
            {getLabInitials(lab.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{lab.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {lab.city}, {lab.country}
            </p>
          </div>
          <Badge className="shrink-0" variant="secondary">
            Selected
          </Badge>
        </div>

        <FieldSet>
          <FieldLegend className="text-xs uppercase text-muted-foreground" variant="label">
            1. Sender information
          </FieldLegend>
          <FieldGroup className="gap-3 rounded-xl border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="sender-name">Full name</FieldLabel>
                <Input
                  autoComplete="name"
                  id="sender-name"
                  name="senderName"
                  required
                  value={form.senderName}
                  onChange={(event) => onChange("senderName", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sender-phone">Phone number</FieldLabel>
                <Input
                  autoComplete="tel"
                  id="sender-phone"
                  name="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) => onChange("phone", event.target.value)}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="sender-email">Email for scanned photos</FieldLabel>
              <Input
                autoComplete="email"
                id="sender-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="return-address">Return address for original film</FieldLabel>
              <Input
                autoComplete="street-address"
                id="return-address"
                name="returnAddress"
                required
                value={form.returnAddress}
                onChange={(event) => onChange("returnAddress", event.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="mt-5">
          <FieldLegend className="text-xs uppercase text-muted-foreground" variant="label">
            2. Film roll details
          </FieldLegend>
          <FieldGroup className="gap-3 rounded-xl border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="film-name">Film stock</FieldLabel>
                <Input
                  id="film-name"
                  name="filmName"
                  placeholder="For example: Kodak Portra 400"
                  required
                  value={form.filmName}
                  onChange={(event) => onChange("filmName", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Film format</FieldLabel>
                <Select
                  value={form.format || null}
                  onValueChange={(value) => onChange("format", value ?? "")}
                >
                  <SelectTrigger aria-label="Film format" className="w-full">
                    <SelectValue placeholder="Select a format" />
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
                <FieldLabel>Development process</FieldLabel>
                <Select
                  value={form.process || null}
                  onValueChange={(value) => onChange("process", value ?? "")}
                >
                  <SelectTrigger aria-label="Development process" className="w-full">
                    <SelectValue placeholder="Select a process" />
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
                  <FieldLabel htmlFor="roll-count">Number of rolls</FieldLabel>
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
                  <FieldLabel>Push/pull exposure</FieldLabel>
                  <Select
                    value={form.pushPull}
                    onValueChange={(value) => onChange("pushPull", value ?? "normal")}
                  >
                    <SelectTrigger aria-label="Push or pull exposure" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="normal">Normal</SelectItem>
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
              <FieldLabel htmlFor="lab-note">Notes for the lab technician</FieldLabel>
              <Textarea
                id="lab-note"
                name="note"
                placeholder="Special scanning or color requests"
                value={form.note}
                onChange={(event) => onChange("note", event.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="mt-5">
          <FieldLegend className="text-xs uppercase text-muted-foreground" variant="label">
            3. Shipping method
          </FieldLegend>
          <FieldGroup className="gap-3 rounded-xl border p-4">
            <RadioGroup
              className="grid gap-3 sm:grid-cols-2"
              value={form.delivery}
              onValueChange={(value) => onChange("delivery", value)}
            >
              <FieldLabel className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal">
                <RadioGroupItem aria-label="Mail-in" value="mail-in" />
                <span>
                  <span className="block text-sm font-medium">Mail-in</span>
                  <span className="text-xs text-muted-foreground">Send your film to the lab</span>
                </span>
              </FieldLabel>
              <FieldLabel className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal">
                <RadioGroupItem aria-label="Drop-off in person" value="drop-off" />
                <span>
                  <span className="block text-sm font-medium">Drop-off in person</span>
                  <span className="text-xs text-muted-foreground">
                    Contact the lab to confirm the drop-off location
                  </span>
                </span>
              </FieldLabel>
            </RadioGroup>
          </FieldGroup>
        </FieldSet>

        {formError && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {formError}
          </p>
        )}

        <FieldSet className="mt-5">
          <FieldLegend className="text-xs uppercase text-muted-foreground" variant="label">
            4. Estimated order summary
          </FieldLegend>
          <Card className="gap-2 rounded-xl bg-muted/30 py-3 shadow-none">
            <CardHeader className="p-0 px-4">
              <CardTitle className="text-sm font-medium">
                {form.rollCount || "0"} rolls · {form.format || "Format not selected"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-4 text-xs text-muted-foreground">
              <span>
                {lab.name} · {form.process || "Development process not selected"}
              </span>
              <span>
                The lab will confirm pricing; prices are not available in the project data.
              </span>
            </CardContent>
          </Card>
        </FieldSet>
      </div>
    </form>
  )
}

function OrderConfirmation({ lab, onClose }: { lab: IFilmLab; onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-foreground">
        <Check aria-hidden="true" />
      </div>
      <div>
        <DialogTitle className="text-lg font-semibold">Booking details are ready</DialogTitle>
        <DialogDescription className="mt-2 max-w-md">
          A booking preview for {lab.name} has been prepared. It has not been sent because the
          project is not connected to a lab booking API.
        </DialogDescription>
      </div>
      <Button onClick={onClose} type="button">
        Close
      </Button>
    </div>
  )
}

export function FilmLabDirectory() {
  const [selectedLab, setSelectedLab] = useState<IFilmLab | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [stage, setStage] = useState<BookingStage>("details")
  const [form, setForm] = useState<BookingForm>(emptyBookingForm)
  const [formError, setFormError] = useState("")

  function selectLab(lab: IFilmLab) {
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
      const message = "Select a film format and development process to continue."
      setFormError(message)
      toast.error(message)
      return
    }
    setStage("confirmation")
    toast.success(
      "Booking details are ready. The request has not been sent because no API is connected."
    )
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
              Film Lab Directory
            </h2>
            <p className="pt-1 text-sm leading-5 text-muted-foreground">
              Browse film development and scanning labs using the available details.
            </p>
          </div>
          <span className="shrink-0 pt-1 text-xs text-muted-foreground">Lab directory</span>
        </header>
        <ul aria-label="Film lab listings" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {VERIFIED_FILM_LABS.map((lab) => (
            <li className="list-none" key={lab.id}>
              <Card className="grid h-full grid-cols-[minmax(88px,26%)_minmax(0,1fr)] items-stretch gap-0 overflow-hidden rounded-2xl border-border p-0 shadow-none ring-1 ring-foreground/5">
                <CardHeader className="flex items-center justify-center p-3">
                  <div
                    aria-label={`${lab.name} logo placeholder`}
                    className="flex size-16 items-center justify-center rounded-full bg-muted text-base font-semibold text-foreground sm:size-24"
                    role="img"
                  >
                    {getLabInitials(lab.name)}
                  </div>
                </CardHeader>
                <CardContent className="flex min-w-0 flex-col gap-3 px-4 py-4 sm:px-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-[15px] font-semibold leading-5">
                        {lab.name}
                      </CardTitle>
                      <p className="pt-1 text-sm leading-5 text-muted-foreground">
                        {lab.city}, {lab.country}
                      </p>
                    </div>
                    {lab.featuredBadge && (
                      <Badge className="shrink-0 rounded-full" variant="secondary">
                        {lab.featuredBadge}
                      </Badge>
                    )}
                  </div>
                  <dl className="flex flex-col gap-2 text-sm leading-5">
                    <div className="flex items-start gap-2">
                      <dt className="flex shrink-0 items-center gap-1 text-muted-foreground">
                        <MapPin aria-hidden="true" className="size-4" />
                        Address
                      </dt>
                      <dd className="min-w-0">{lab.address}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Processes</dt>
                      <dd>{lab.processes.join(", ")}</dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                    <div
                      aria-label={`${lab.rating.toFixed(1)} out of 5 stars, ${lab.reviewCount.toLocaleString("en-US")} reviews`}
                      className="inline-flex items-center gap-1 text-sm"
                      role="img"
                    >
                      <Star aria-hidden="true" className="size-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{lab.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">
                        ({lab.reviewCount.toLocaleString("en-US")} reviews)
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 aria-hidden="true" className="size-3.5" />
                      {lab.turnaround}
                    </span>
                  </div>
                  <div className="mt-auto flex justify-end pt-1">
                    <Button
                      className="h-9 rounded-full bg-[rgb(74,93,249)] px-4 text-white hover:bg-[rgb(74,93,249)] hover:text-white"
                      onClick={() => selectLab(lab)}
                      type="button"
                    >
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedLab && (
          <DialogContent
            className="flex h-[min(680px,calc(100dvh-2rem))] max-h-[calc(100dvh-2rem)] w-[min(684px,calc(100vw-2rem))] max-w-none flex-col gap-0 overflow-hidden rounded-[40px] p-0 sm:max-w-none"
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
