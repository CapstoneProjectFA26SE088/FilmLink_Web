"use client"

import {
  Camera,
  Check,
  Clock,
  Copy,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Send,
  Sparkles,
  Star,
} from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { IFilmLab } from "@/types"

interface LabDetailModalProps {
  lab: IFilmLab | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type TabKey = "overview" | "pricing" | "mailin" | "contact"

export function LabDetailModal({ lab, open, onOpenChange }: LabDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const [copied, setCopied] = useState<boolean>(false)
  const [rollsCount, setRollsCount] = useState<number>(2)
  const [selectedProcess, setSelectedProcess] = useState<string>("Color (C-41)")
  const [customerNotes, setCustomerNotes] = useState<string>("")

  if (!lab) return null

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${lab.name}, ${lab.address}, ${lab.city}, ${lab.country}`)
    setCopied(true)
    toast.success(`Copied shipping address for ${lab.name}!`)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(
      `Order inquiry sent to ${lab.name} for ${rollsCount} rolls (${selectedProcess})! The lab will reach out soon.`
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl bg-white border border-zinc-200">
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 rounded-t-2xl relative overflow-hidden">
          {/* Subtle Halation glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 size-48 bg-radial from-[#e24a4a]/30 via-transparent to-transparent opacity-70" />

          <DialogHeader className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                VERIFIED PARTNER LAB
              </span>
              {lab.featuredBadge && (
                <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                  {lab.featuredBadge}
                </span>
              )}
            </div>

            <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {lab.name}
            </DialogTitle>

            <DialogDescription className="text-zinc-300 text-xs sm:text-sm mt-1">
              {lab.tagline || `${lab.city}, ${lab.country} • Professional analog darkroom`}
            </DialogDescription>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-zinc-300">
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>{lab.rating.toFixed(2)}</span>
                <span className="text-zinc-400 font-normal">({lab.reviewCount} reviews)</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1">
                <Clock className="size-3.5 text-zinc-400" />
                <span>Turnaround: {lab.turnaround}</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1 text-zinc-300">
                <MapPin className="size-3.5 text-rose-400" />
                <span>
                  {lab.city}, {lab.country}
                </span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer",
              activeTab === "overview"
                ? "border-[#e24a4a] text-zinc-950 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            )}
          >
            Overview & Specs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={cn(
              "py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer",
              activeTab === "pricing"
                ? "border-[#e24a4a] text-zinc-950 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            )}
          >
            Menu & Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mailin")}
            className={cn(
              "py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer",
              activeTab === "mailin"
                ? "border-[#e24a4a] text-zinc-950 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            )}
          >
            Mail-In Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={cn(
              "py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer",
              activeTab === "contact"
                ? "border-[#e24a4a] text-zinc-950 font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            )}
          >
            Book & Contact
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5 text-zinc-800">
              {/* Lab Story / Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  About this Darkroom
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {lab.description ||
                    "This lab provides high standard analog chemical processing, careful negative handling, and high-fidelity digitizing for analog photographers."}
                </p>
              </div>

              {/* Hardware & Scanners */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Monitor className="size-4 text-[#e24a4a]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                    Scanning Hardware & Resolutions
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lab.scanners?.map((scanner) => (
                    <span
                      key={scanner}
                      className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono font-medium text-zinc-800 shadow-2xs"
                    >
                      {scanner}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Scanned in true color-calibrated sRGB or Adobe RGB, delivered in JPEG or 16-bit
                  uncompressed TIFF via high-speed cloud link.
                </p>
              </div>

              {/* Chemistry & Formats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-200 p-3.5">
                  <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Supported Processes
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {lab.processes.map((p) => (
                      <span
                        key={p}
                        className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 p-3.5">
                  <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Film Formats
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {lab.formats?.map((fmt) => (
                      <span
                        key={fmt}
                        className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lab Services Checklist */}
              <div className="border-t border-zinc-100 pt-3">
                <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Photographer Services Included
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-600" />
                    <span>Tracked Mail-In Orders</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-600" />
                    <span>Cut & Archival Sleeving</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-600" />
                    <span>Push / Pull Time Tuning</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-600" />
                    <span>FilmLink AI Sync Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Estimated Service Rates</h4>
                <p className="text-xs text-zinc-500">
                  Indicative pricing for development and high-resolution scanning. Prices may vary
                  by resolution tier.
                </p>
              </div>

              {lab.pricingSample && lab.pricingSample.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-zinc-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 font-semibold">
                        <th className="p-3">Process / Service</th>
                        <th className="p-3">Estimated Rate</th>
                        <th className="p-3">Specifications</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {lab.pricingSample.map((item) => (
                        <tr key={item.process} className="hover:bg-zinc-50/50">
                          <td className="p-3 font-semibold text-zinc-800">{item.process}</td>
                          <td className="p-3 font-bold text-[#e24a4a] whitespace-nowrap">
                            {item.price}
                          </td>
                          <td className="p-3 text-zinc-500">{item.notes || "Standard"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
                  General price range: <strong className="text-zinc-900">{lab.priceRange}</strong>.
                  Inquire with the lab directly for custom sheet film or cinema batch rates.
                </div>
              )}

              <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3.5 text-xs text-amber-800 flex items-start gap-2">
                <Sparkles className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Tip for photographers: Mention <strong>FilmLink</strong> when dropping off or
                  mailing rolls to enjoy partner queue priority and direct cloud sync!
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: MAIL-IN GUIDE */}
          {activeTab === "mailin" && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">How to Ship Rolls to {lab.name}</h4>
                <p className="text-xs text-zinc-500">
                  Follow these 3 steps to ensure your latent silver halide frames arrive safely
                  without light leaks or damage.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 items-start rounded-xl border border-zinc-200 p-3.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">
                      Pack securely in light-tight canisters
                    </h5>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Place rolls in plastic film canisters or bubble wrap. For 120 film, ensure the
                      adhesive paper band is firmly sealed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start rounded-xl border border-zinc-200 p-3.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Include an order slip</h5>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Write down your Full Name, Phone Number, Email, and instructions (e.g. "Push
                      Tri-X +1 stop", "TIFF scans").
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start rounded-xl border border-zinc-200 p-3.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Ship via tracked courier</h5>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Always choose a tracked service (ViettelPost, EMS, DHL, FedEx) and keep your
                      tracking code.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Box */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Lab Shipping Address
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#e24a4a] hover:underline cursor-pointer"
                  >
                    {copied ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    <span>{copied ? "Copied!" : "Copy Address"}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-zinc-800 bg-white p-2.5 rounded-lg border border-zinc-200">
                  {lab.name}
                  <br />
                  {lab.address}
                  <br />
                  {lab.city}, {lab.country}
                  {lab.phone && (
                    <>
                      <br />
                      Tel: {lab.phone}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BOOK & CONTACT */}
          {activeTab === "contact" && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">
                  Send Inquiry or Drop-off Notification
                </h4>
                <p className="text-xs text-zinc-500">
                  Notify the lab ahead of time so chemistry and technician schedules are ready.
                </p>
              </div>

              <form onSubmit={handleSendOrder} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="rollsCountInput"
                      className="text-[11px] font-semibold text-zinc-600 block mb-1"
                    >
                      Rolls Count
                    </label>
                    <input
                      id="rollsCountInput"
                      type="number"
                      min={1}
                      max={50}
                      value={rollsCount}
                      onChange={(e) => setRollsCount(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-200 p-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="primaryProcessSelect"
                      className="text-[11px] font-semibold text-zinc-600 block mb-1"
                    >
                      Primary Process
                    </label>
                    <select
                      id="primaryProcessSelect"
                      value={selectedProcess}
                      onChange={(e) => setSelectedProcess(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 p-2 text-xs text-zinc-900 outline-none focus:border-zinc-400 cursor-pointer"
                    >
                      {lab.processes.map((proc) => (
                        <option key={proc} value={proc}>
                          {proc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="customerNotesTextarea"
                    className="text-[11px] font-semibold text-zinc-600 block mb-1"
                  >
                    Special Instructions (Push / Pull, TIFF, Archival return)
                  </label>
                  <textarea
                    id="customerNotesTextarea"
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Please push roll #2 by 1 stop, scan at 24MP Frontier..."
                    className="w-full rounded-lg border border-zinc-200 p-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#e24a4a] py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#cf3f3f] transition-colors cursor-pointer"
                >
                  <Send className="size-3.5" />
                  <span>Send Order Notification to {lab.name}</span>
                </button>
              </form>

              {/* Lab Contact Channels */}
              <div className="border-t border-zinc-100 pt-4 space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Direct Channels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {lab.phone && (
                    <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 text-zinc-700">
                      <Phone className="size-3.5 text-zinc-400" />
                      <span>{lab.phone}</span>
                    </div>
                  )}
                  {lab.email && (
                    <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 text-zinc-700">
                      <Mail className="size-3.5 text-zinc-400" />
                      <span className="truncate">{lab.email}</span>
                    </div>
                  )}
                  {lab.instagram && (
                    <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 text-zinc-700">
                      <Camera className="size-3.5 text-zinc-400" />
                      <span>{lab.instagram}</span>
                    </div>
                  )}
                  {lab.openingHours && (
                    <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 text-zinc-700">
                      <Clock className="size-3.5 text-zinc-400" />
                      <span>{lab.openingHours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
