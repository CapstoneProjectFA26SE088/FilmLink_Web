"use client"

import { FlaskConical, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LabSubmitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LabSubmitModal({ open, onOpenChange }: LabSubmitModalProps) {
  const [labName, setLabName] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("Vietnam")
  const [address, setAddress] = useState("")
  const [processes, setProcesses] = useState("C-41, B&W")
  const [website, setWebsite] = useState("")
  const [acceptsMailIn, setAcceptsMailIn] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!labName.trim() || !city.trim()) {
      toast.error("Please provide at least the lab name and city.")
      return
    }

    toast.success(
      `Thank you! "${labName}" in ${city} has been submitted to the FilmLink team for verification.`
    )
    setLabName("")
    setCity("")
    setAddress("")
    setWebsite("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl bg-white p-6 border border-zinc-200">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-[#e24a4a]">
              <FlaskConical className="size-4" />
            </span>
            <span className="text-xs font-semibold text-[#e24a4a] uppercase tracking-wider">
              Community Contribution
            </span>
          </div>

          <DialogTitle className="text-xl font-bold text-zinc-950">
            Submit a Film Lab to Directory
          </DialogTitle>

          <DialogDescription className="text-xs text-zinc-500">
            Know a fantastic local darkroom or mail-in lab that isn't listed yet? Help fellow analog
            photographers discover them.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label
              htmlFor="submitLabName"
              className="block text-xs font-semibold text-zinc-700 mb-1"
            >
              Lab Name *
            </label>
            <input
              id="submitLabName"
              type="text"
              required
              placeholder="e.g. Zone V Darkroom"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="submitCity"
                className="block text-xs font-semibold text-zinc-700 mb-1"
              >
                City *
              </label>
              <input
                id="submitCity"
                type="text"
                required
                placeholder="e.g. Hanoi, Tokyo, New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label
                htmlFor="submitCountry"
                className="block text-xs font-semibold text-zinc-700 mb-1"
              >
                Country
              </label>
              <input
                id="submitCountry"
                type="text"
                placeholder="e.g. Vietnam, Japan, USA"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="submitAddress"
              className="block text-xs font-semibold text-zinc-700 mb-1"
            >
              Address / Location Note
            </label>
            <input
              id="submitAddress"
              type="text"
              placeholder="e.g. 15 Nguyen Thi Minh Khai, District 1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label
              htmlFor="submitProcesses"
              className="block text-xs font-semibold text-zinc-700 mb-1"
            >
              Processes Offered (e.g. C-41, B&W, ECN-2, E-6)
            </label>
            <input
              id="submitProcesses"
              type="text"
              placeholder="C-41, B&W, ECN-2"
              value={processes}
              onChange={(e) => setProcesses(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label
              htmlFor="submitWebsite"
              className="block text-xs font-semibold text-zinc-700 mb-1"
            >
              Website or Instagram
            </label>
            <input
              id="submitWebsite"
              type="text"
              placeholder="https://instagram.com/yourlab or https://lab.vn"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="mailInCheckbox"
              type="checkbox"
              checked={acceptsMailIn}
              onChange={(e) => setAcceptsMailIn(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <label
              htmlFor="mailInCheckbox"
              className="text-xs text-zinc-700 font-medium cursor-pointer"
            >
              This lab accepts mail-in / courier rolls
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#e24a4a] transition-colors cursor-pointer"
            >
              <Send className="size-3.5" />
              <span>Submit Recommendation</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
