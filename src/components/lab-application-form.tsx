"use client"

import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { ArrowLeft, CheckCircle2, FileSearch, FlaskConical, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Catalog = { id: number; displayName: string }
type Application = { applicationCode: string; status: string; labName?: string; createdAt?: string; rejectionReason?: string | null; contactEmail?: string }
type ApiError = { message?: string }

async function json<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & ApiError
  if (!response.ok) throw new Error(data.message || "Yêu cầu không thành công.")
  return data
}

export function LabApplicationForm() {
  const [mode, setMode] = useState<"apply" | "track">("apply")
  const [catalogs, setCatalogs] = useState<{ types: Catalog[]; processes: Catalog[]; formats: Catalog[] }>({ types: [], processes: [], formats: [] })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<Application | null>(null)
  const [lookupCode, setLookupCode] = useState("")

  useEffect(() => {
    Promise.all([
      fetch("/api/public/service-types").then(json<Catalog[]>),
      fetch("/api/public/film-processes").then(json<Catalog[]>),
      fetch("/api/public/film-formats").then(json<Catalog[]>),
    ]).then(([types, processes, formats]) => setCatalogs({ types, processes, formats })).catch((reason) => setError(reason instanceof Error ? reason.message : "Không tải được danh mục."))
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setResult(null)
    const form = new FormData(event.currentTarget)
    const documents = form.getAll("documents").filter((entry): entry is File => entry instanceof File && entry.size > 0)
    if (documents.length < 1 || documents.length > 5) { setError("Vui lòng chọn từ 1 đến 5 tài liệu."); setPending(false); return }
    if (documents.some((file) => file.size > 10 * 1024 * 1024 || !["application/pdf", "image/jpeg", "image/png"].includes(file.type))) { setError("Mỗi tài liệu phải là PDF, JPG hoặc PNG và không quá 10 MB."); setPending(false); return }
    const data = {
      labName: form.get("labName"), taxCode: form.get("taxCode"), addressLine: form.get("addressLine"), district: form.get("district"), province: form.get("province"), contactEmail: form.get("contactEmail"), contactPhone: form.get("contactPhone"),
      serviceTypeIds: form.getAll("serviceTypeIds").map(Number), filmProcessIds: form.getAll("filmProcessIds").map(Number), filmFormatIds: form.getAll("filmFormatIds").map(Number),
    }
    if (!data.serviceTypeIds.length || !data.filmProcessIds.length || !data.filmFormatIds.length) { setError("Hãy chọn ít nhất một dịch vụ, quy trình và khổ phim."); setPending(false); return }
    const body = new FormData(); body.append("data", JSON.stringify(data)); documents.forEach((file) => body.append("documents", file, file.name))
    const formElement = event.currentTarget
    try { setResult(await json<Application>(await fetch("/api/public/lab-applications", { method: "POST", body }))); formElement.reset() }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Không gửi được hồ sơ.") }
    finally { setPending(false) }
  }

  async function lookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setResult(null)
    try { setResult(await json<Application>(await fetch(`/api/public/lab-applications/${encodeURIComponent(lookupCode.trim())}`, { cache: "no-store" }))) }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Không tra cứu được hồ sơ.") }
    finally { setPending(false) }
  }

  const checks = (name: string, items: Catalog[]) => <div className="lab-application-checks">{items.map((item) => <label key={item.id}><input type="checkbox" name={name} value={item.id} />{item.displayName}</label>)}</div>

  return <main className="lab-application-page">
    <header className="lab-application-hero"><div><p className="eyebrow">TRỞ THÀNH ĐỐI TÁC FILMLINK</p><h1>Mở Film Lab của bạn trên FilmLink</h1><p>Gửi thông tin pháp lý và năng lực dịch vụ. Bạn sẽ nhận mã hồ sơ để theo dõi quá trình duyệt.</p></div><FlaskConical aria-hidden="true" /></header>
    <div className="lab-application-tabs" role="tablist"><button type="button" role="tab" aria-selected={mode === "apply"} onClick={() => { setMode("apply"); setResult(null); setError("") }}>Nộp hồ sơ</button><button type="button" role="tab" aria-selected={mode === "track"} onClick={() => { setMode("track"); setResult(null); setError("") }}>Tra cứu hồ sơ</button></div>
    {mode === "apply" ? <form className="lab-application-card" onSubmit={submit}><section><h2>Thông tin Film Lab</h2><div className="lab-application-grid"><label>Tên Film Lab<Input name="labName" minLength={2} maxLength={150} required /></label><label>Mã số thuế<Input name="taxCode" pattern="[0-9]{10}(-[0-9]{3})?" title="10 chữ số hoặc 10 chữ số, dấu gạch ngang và 3 chữ số chi nhánh" required /></label><label>Email liên hệ<Input name="contactEmail" type="email" maxLength={255} required /></label><label>Số điện thoại<Input name="contactPhone" type="tel" minLength={9} maxLength={15} required /></label><label className="wide">Địa chỉ<Input name="addressLine" maxLength={255} required /></label><label>Quận/Huyện<Input name="district" maxLength={100} required /></label><label>Tỉnh/Thành phố<Input name="province" maxLength={100} required /></label></div></section><section><h2>Năng lực dịch vụ</h2><fieldset><legend>Loại dịch vụ</legend>{checks("serviceTypeIds", catalogs.types)}</fieldset><fieldset><legend>Quy trình tráng</legend>{checks("filmProcessIds", catalogs.processes)}</fieldset><fieldset><legend>Khổ phim</legend>{checks("filmFormatIds", catalogs.formats)}</fieldset></section><section><h2>Tài liệu xác minh</h2><label className="lab-document-upload"><Upload /><span><strong>Chọn 1–5 tài liệu</strong><small>PDF, JPG hoặc PNG · tối đa 10 MB mỗi tệp</small></span><input name="documents" type="file" accept="application/pdf,image/jpeg,image/png" multiple required /></label></section>{error && <div className="guest-api-error" role="alert">{error}</div>}<Button disabled={pending}>{pending ? "Đang gửi hồ sơ..." : "Gửi hồ sơ xét duyệt"}</Button></form> : <form className="lab-application-card lab-lookup" onSubmit={lookup}><FileSearch /><div><h2>Tra cứu trạng thái hồ sơ</h2><p>Nhập mã hồ sơ bạn nhận được sau khi đăng ký.</p></div><Input value={lookupCode} onChange={(e) => setLookupCode(e.target.value)} placeholder="Ví dụ: LA2026..." pattern="[A-Za-z0-9]+" required /><Button disabled={pending}>{pending ? "Đang tra cứu..." : "Tra cứu"}</Button>{error && <div className="guest-api-error" role="alert">{error}</div>}</form>}
    {result && <section className="lab-application-result"><CheckCircle2 /><div><p className="eyebrow">MÃ HỒ SƠ</p><h2>{result.applicationCode}</h2><p>Trạng thái: <strong>{result.status}</strong></p>{result.rejectionReason && <p>Lý do: {result.rejectionReason}</p>}<small>Hãy lưu mã này để tra cứu lại hồ sơ.</small></div></section>}
    <Link href="/" className="lab-application-back"><ArrowLeft /> Quay lại FilmLink</Link>
  </main>
}
