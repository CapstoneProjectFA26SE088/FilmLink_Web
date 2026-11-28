"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState, type FormEvent, type Ref } from "react"
import { ArrowLeft, CheckCircle2, Copy, FileSearch, FlaskConical, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InlineMessage } from "@/components/shared/feedback/inline-message"
import { LabApplicationStatusBadge } from "@/components/shared/status/status-badge"
import { formatDate } from "@/lib/format"

type Catalog = { id: number; displayName: string }
type Catalogs = { types: Catalog[]; processes: Catalog[]; formats: Catalog[] }
type CatalogStatus = "loading" | "ready" | "error"
type Application = {
	applicationCode: string
	status: string
	labName?: string
	createdAt?: string
	rejectionReason?: string | null
	contactEmail?: string
}
type ApiError = { message?: string }
type Mode = "apply" | "track"
type CopyState = "idle" | "copied" | "failed"

const EMPTY_CATALOGS: Catalogs = { types: [], processes: [], formats: [] }

const STATUS_HINTS: Record<string, string> = {
	PENDING_REVIEW: "Hồ sơ đang chờ quản trị viên xem xét. Bạn có thể quay lại tra cứu bằng mã này bất cứ lúc nào.",
	AWAITING_INFORMATION: "FilmLink cần bạn bổ sung thông tin. Hãy kiểm tra email liên hệ đã đăng ký.",
	APPROVED: "Hồ sơ đã được duyệt. Hãy đăng nhập để bắt đầu quản lý Film Lab của bạn.",
}

async function json<T>(response: Response): Promise<T> {
	const data = (await response.json().catch(() => ({}))) as T & ApiError
	if (!response.ok) throw new Error(data.message || "Yêu cầu không thành công.")
	return data
}

function errorMessage(reason: unknown, fallback: string) {
	return reason instanceof Error ? reason.message : fallback
}

function CatalogChecks({ name, items, status }: { name: string; items: Catalog[]; status: CatalogStatus }) {
	if (status === "loading") return <p className="lab-application-hint" role="status">Đang tải danh mục…</p>
	if (status === "error") return <p className="lab-application-hint">Chưa tải được danh mục này.</p>
	if (!items.length) return <p className="lab-application-hint">Hiện chưa có lựa chọn nào.</p>
	return (
		<div className="lab-application-checks">
			{items.map((item) => (
				<label key={item.id}>
					<input type="checkbox" name={name} value={item.id} />
					{item.displayName}
				</label>
			))}
		</div>
	)
}

type ApplicationResultProps = {
	application: Application
	copyState: CopyState
	onCopy: () => void
	resultRef: Ref<HTMLElement>
}

function ApplicationResult({ application, copyState, onCopy, resultRef }: ApplicationResultProps) {
	const hint = STATUS_HINTS[application.status]
	return (
		<section
			ref={resultRef}
			tabIndex={-1}
			className="lab-application-result"
			aria-labelledby="lab-application-result-title"
		>
			<CheckCircle2 aria-hidden="true" />
			<div>
				<p className="eyebrow">Mã hồ sơ</p>
				<div className="lab-application-result-code">
					<h2 id="lab-application-result-title">{application.applicationCode}</h2>
					<Button type="button" variant="outline" size="sm" onClick={onCopy}>
						<Copy aria-hidden="true" />
						Sao chép mã
					</Button>
					<span role="status" className="lab-application-hint">
						{copyState === "copied" && "Đã sao chép mã hồ sơ."}
						{copyState === "failed" && "Không sao chép được. Hãy chọn mã và sao chép thủ công."}
					</span>
				</div>
				<div className="lab-application-result-meta">
					<span>Trạng thái:</span>
					<LabApplicationStatusBadge value={application.status} />
					{application.labName ? <span>· {application.labName}</span> : null}
					{application.createdAt ? <span>· Gửi lúc {formatDate(application.createdAt)}</span> : null}
				</div>
				{application.rejectionReason ? <p>Lý do: {application.rejectionReason}</p> : null}
				{hint ? <p>{hint}</p> : null}
				{application.status === "APPROVED" ? (
					<p>
						<Link href="/login" className="underline">Đăng nhập tài khoản Film Lab</Link>
					</p>
				) : null}
				<small>Hãy lưu mã này để tra cứu lại hồ sơ.</small>
			</div>
		</section>
	)
}

export function LabApplicationForm() {
	const [mode, setMode] = useState<Mode>("apply")
	const [selectedFiles, setSelectedFiles] = useState<string[]>([])
	const [catalogs, setCatalogs] = useState<Catalogs>(EMPTY_CATALOGS)
	const [catalogStatus, setCatalogStatus] = useState<CatalogStatus>("loading")
	const [catalogAttempt, setCatalogAttempt] = useState(0)
	const [catalogError, setCatalogError] = useState("")
	const [pending, setPending] = useState(false)
	const [error, setError] = useState("")
	const [result, setResult] = useState<Application | null>(null)
	const [copyState, setCopyState] = useState<CopyState>("idle")
	const [lookupCode, setLookupCode] = useState("")
	const resultRef = useRef<HTMLElement>(null)

	useEffect(() => {
		let cancelled = false
		Promise.all([
			fetch("/api/public/service-types").then(json<Catalog[]>),
			fetch("/api/public/film-processes").then(json<Catalog[]>),
			fetch("/api/public/film-formats").then(json<Catalog[]>),
		])
			.then(([types, processes, formats]) => {
				if (cancelled) return
				setCatalogs({ types, processes, formats })
				setCatalogStatus("ready")
			})
			.catch((reason: unknown) => {
				if (cancelled) return
				setCatalogError(errorMessage(reason, "Không tải được danh mục."))
				setCatalogStatus("error")
			})
		return () => {
			cancelled = true
		}
	}, [catalogAttempt])

	useEffect(() => {
		const element = resultRef.current
		if (!result || !element) return
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		element.focus({ preventScroll: true })
		element.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" })
	}, [result])

	const retryCatalogs = useCallback(() => {
		setCatalogStatus("loading")
		setCatalogError("")
		setCatalogAttempt((value) => value + 1)
	}, [])

	function changeMode(next: Mode) {
		setMode(next)
		setResult(null)
		setError("")
	}

	function showResult(application: Application) {
		setCopyState("idle")
		setResult(application)
	}

	async function copyCode() {
		if (!result) return
		try {
			await navigator.clipboard.writeText(result.applicationCode)
			setCopyState("copied")
		} catch {
			setCopyState("failed")
		}
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const formElement = event.currentTarget
		setPending(true)
		setError("")
		setResult(null)
		const form = new FormData(formElement)
		const documents = form.getAll("documents").filter((entry): entry is File => entry instanceof File && entry.size > 0)
		if (documents.length < 1 || documents.length > 5) {
			setError("Vui lòng chọn từ 1 đến 5 tài liệu.")
			setPending(false)
			return
		}
		const invalidDocument = documents.some(
			(file) => file.size > 10 * 1024 * 1024 || !["application/pdf", "image/jpeg", "image/png"].includes(file.type),
		)
		if (invalidDocument) {
			setError("Mỗi tài liệu phải là PDF, JPG hoặc PNG và không quá 10 MB.")
			setPending(false)
			return
		}
		const data = {
			labName: form.get("labName"),
			taxCode: form.get("taxCode"),
			addressLine: form.get("addressLine"),
			district: form.get("district"),
			province: form.get("province"),
			contactEmail: form.get("contactEmail"),
			contactPhone: form.get("contactPhone"),
			serviceTypeIds: form.getAll("serviceTypeIds").map(Number),
			filmProcessIds: form.getAll("filmProcessIds").map(Number),
			filmFormatIds: form.getAll("filmFormatIds").map(Number),
		}
		if (!data.serviceTypeIds.length || !data.filmProcessIds.length || !data.filmFormatIds.length) {
			setError("Hãy chọn ít nhất một dịch vụ, quy trình và khổ phim.")
			setPending(false)
			return
		}
		const body = new FormData()
		body.append("data", JSON.stringify(data))
		documents.forEach((file) => body.append("documents", file, file.name))
		try {
			showResult(await json<Application>(await fetch("/api/public/lab-applications", { method: "POST", body })))
			formElement.reset()
			setSelectedFiles([])
		} catch (reason) {
			setError(errorMessage(reason, "Không gửi được hồ sơ."))
		} finally {
			setPending(false)
		}
	}

	async function lookup(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setPending(true)
		setError("")
		setResult(null)
		try {
			const response = await fetch(`/api/public/lab-applications/${encodeURIComponent(lookupCode.trim())}`, { cache: "no-store" })
			showResult(await json<Application>(response))
		} catch (reason) {
			setError(errorMessage(reason, "Không tra cứu được hồ sơ."))
		} finally {
			setPending(false)
		}
	}

	const catalogsReady = catalogStatus === "ready"

	return (
		<main className="lab-application-page">
			<header className="lab-application-hero">
				<div>
					<p className="eyebrow">Trở thành đối tác FilmLink</p>
					<h1>Mở Film Lab của bạn trên FilmLink</h1>
					<p>Gửi thông tin pháp lý và năng lực dịch vụ. Bạn sẽ nhận mã hồ sơ để theo dõi quá trình duyệt.</p>
				</div>
				<FlaskConical aria-hidden="true" />
			</header>

			<Tabs value={mode} onValueChange={(value) => changeMode(value as Mode)}>
				<TabsList className="lab-application-tabs" aria-label="Chọn thao tác">
					<TabsTrigger value="apply">Nộp hồ sơ</TabsTrigger>
					<TabsTrigger value="track">Tra cứu hồ sơ</TabsTrigger>
				</TabsList>

				<TabsContent value="apply" className="lab-application-panel">
					<form className="lab-application-card" onSubmit={submit}>
						<section>
							<h2>Thông tin Film Lab</h2>
							<div className="lab-application-grid">
								<label>Tên Film Lab<Input name="labName" minLength={2} maxLength={150} required /></label>
								<label>
									Mã số thuế
									<Input
										name="taxCode"
										pattern="[0-9]{10}(-[0-9]{3})?"
										title="10 chữ số hoặc 10 chữ số, dấu gạch ngang và 3 chữ số chi nhánh"
										required
									/>
								</label>
								<label>Email liên hệ<Input name="contactEmail" type="email" maxLength={255} required /></label>
								<label>Số điện thoại<Input name="contactPhone" type="tel" minLength={9} maxLength={15} required /></label>
								<label className="wide">Địa chỉ<Input name="addressLine" maxLength={255} required /></label>
								<label>Quận/Huyện<Input name="district" maxLength={100} required /></label>
								<label>Tỉnh/Thành phố<Input name="province" maxLength={100} required /></label>
							</div>
						</section>

						<section>
							<h2>Năng lực dịch vụ</h2>
							{catalogStatus === "error" ? (
								<div className="lab-application-retry">
									<InlineMessage tone="error" className="flex-1">{catalogError}</InlineMessage>
									<Button type="button" variant="outline" onClick={retryCatalogs}>Thử lại</Button>
								</div>
							) : null}
							<fieldset>
								<legend>Loại dịch vụ</legend>
								<CatalogChecks name="serviceTypeIds" items={catalogs.types} status={catalogStatus} />
							</fieldset>
							<fieldset>
								<legend>Quy trình tráng</legend>
								<CatalogChecks name="filmProcessIds" items={catalogs.processes} status={catalogStatus} />
							</fieldset>
							<fieldset>
								<legend>Khổ phim</legend>
								<CatalogChecks name="filmFormatIds" items={catalogs.formats} status={catalogStatus} />
							</fieldset>
						</section>

						<section>
							<h2>Tài liệu xác minh</h2>
							<label className="lab-document-upload">
								<Upload aria-hidden="true" />
								<span>
									<strong>Chọn 1–5 tài liệu</strong>
									<small>PDF, JPG hoặc PNG · tối đa 10 MB mỗi tệp</small>
								</span>
								<span className="lab-document-upload__button" aria-hidden="true">Chọn tệp</span>
								<span className="lab-document-upload__files" aria-live="polite">
									{selectedFiles.length ? `Đã chọn ${selectedFiles.length} tệp: ${selectedFiles.join(", ")}` : "Chưa chọn tệp nào"}
								</span>
								<input
									name="documents"
									type="file"
									accept="application/pdf,image/jpeg,image/png"
									multiple
									required
									className="lab-document-upload__input"
									onChange={(event) => setSelectedFiles(Array.from(event.currentTarget.files ?? [], (file) => file.name))}
								/>
							</label>
						</section>

						{error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
						<Button type="submit" disabled={pending || !catalogsReady}>
							{pending ? "Đang gửi hồ sơ..." : "Gửi hồ sơ xét duyệt"}
						</Button>
					</form>
				</TabsContent>

				<TabsContent value="track" className="lab-application-panel">
					<form className="lab-application-card lab-lookup" onSubmit={lookup}>
						<FileSearch aria-hidden="true" />
						<div>
							<h2>Tra cứu trạng thái hồ sơ</h2>
							<p>Nhập mã hồ sơ bạn nhận được sau khi đăng ký.</p>
						</div>
						<Input
							aria-label="Mã hồ sơ"
							value={lookupCode}
							onChange={(event) => setLookupCode(event.target.value)}
							placeholder="Ví dụ: LA2026..."
							pattern="[A-Za-z0-9]+"
							required
						/>
						<Button type="submit" disabled={pending}>{pending ? "Đang tra cứu..." : "Tra cứu"}</Button>
						{error ? <InlineMessage tone="error">{error}</InlineMessage> : null}
					</form>
				</TabsContent>
			</Tabs>

			{result ? (
				<ApplicationResult application={result} copyState={copyState} onCopy={() => void copyCode()} resultRef={resultRef} />
			) : null}

			<Link href="/" className="lab-application-back">
				<ArrowLeft aria-hidden="true" /> Quay lại FilmLink
			</Link>
		</main>
	)
}
