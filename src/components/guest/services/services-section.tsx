"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { ChevronLeft, ChevronRight, FlaskConical, LoaderCircle, LocateFixed, MapPin, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Section } from "@/components/shared/model"

type Catalog = { id: number; code: string; displayName: string }
type LabSummary = { id: number; labName: string; addressLine: string; district: string; province: string; coverImageUrl: string | null; minPriceVnd: number; distanceKm: number | null }
type PageResult<T> = { content: T[]; number: number; totalPages: number; totalElements: number }
type Stock = { id: number; stockName: string; manufacturer: string; iso: number; defaultFilmProcessName: string; status: string }
type LabDetail = LabSummary & { description?: string | null; openingHours: { dayOfWeek: string; closed: boolean; opensAt: string | null; closesAt: string | null }[]; images: { id: number; displayOrder: number; url: string }[]; packages: { id: number; packageName: string; serviceType: Catalog; filmProcess: Catalog; filmFormat: Catalog; priceVnd: number; turnaroundDays: number; pushPullAvailable: boolean; pushPullSurchargePerStopVnd: number; scanOptions: { id: number; resolutionLabel: string; priceVnd: number }[] }[] }
type ApiError = { message?: string }
const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" })
  const data = (await response.json().catch(() => ({}))) as T & ApiError
  if (!response.ok) throw new Error(data.message || "Không tải được dữ liệu từ máy chủ.")
  return data
}

export function ServicesSection({ onBook, onSelect }: { onBook: (id: string) => void; onSelect: (section: Section) => void }) {
  const [catalogs, setCatalogs] = useState<{ processes: Catalog[]; formats: Catalog[]; types: Catalog[] }>({ processes: [], formats: [], types: [] })
  const [filters, setFilters] = useState({ process: "", format: "", type: "", sort: "price", lat: "", lng: "" })
  const [labs, setLabs] = useState<PageResult<LabSummary>>({ content: [], number: 0, totalPages: 0, totalElements: 0 })
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [locationMessage, setLocationMessage] = useState("")
  const [selectedLab, setSelectedLab] = useState<LabDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [stockQuery, setStockQuery] = useState("")
  const [stocks, setStocks] = useState<Stock[]>([])
  const [stockLoading, setStockLoading] = useState(false)

  const loadLabs = useCallback(async (targetPage: number, current = filters) => {
    setLoading(true); setError("")
    const query = new URLSearchParams({ page: String(targetPage), size: "9", sort: current.sort })
    if (current.process) query.set("filmProcessId", current.process)
    if (current.format) query.set("filmFormatId", current.format)
    if (current.type) query.set("serviceTypeId", current.type)
    if (current.lat && current.lng) { query.set("lat", current.lat); query.set("lng", current.lng); query.set("radiusKm", "30") }
    try { setLabs(await getJson<PageResult<LabSummary>>(`/api/public/film-labs?${query}`)); setPage(targetPage) }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Không tải được Film Lab.") }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => {
    Promise.all([getJson<Catalog[]>("/api/public/film-processes"), getJson<Catalog[]>("/api/public/film-formats"), getJson<Catalog[]>("/api/public/service-types")])
      .then(([processes, formats, types]) => setCatalogs({ processes, formats, types }))
      .catch(() => setError("Không tải được danh mục lọc."))
    void loadLabs(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function useLocation() {
    if (!navigator.geolocation) { setLocationMessage("Trình duyệt không hỗ trợ định vị."); return }
    setLocationMessage("Đang lấy vị trí...")
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const next = { ...filters, lat: String(coords.latitude), lng: String(coords.longitude), sort: "distance" }
      setFilters(next); setLocationMessage("Đang hiển thị lab trong bán kính 30 km."); void loadLabs(0, next)
    }, () => setLocationMessage("Không thể lấy vị trí. Hãy cấp quyền định vị và thử lại."), { timeout: 10000 })
  }

  async function openLab(id: number) {
    setDetailLoading(true); setSelectedLab(null)
    try { setSelectedLab(await getJson<LabDetail>(`/api/public/film-labs/${id}`)) }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Không tải được chi tiết lab.") }
    finally { setDetailLoading(false) }
  }

  async function searchStocks(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStockLoading(true); setError("")
    try { setStocks(await getJson<Stock[]>(`/api/public/film-stocks?q=${encodeURIComponent(stockQuery.trim())}`)) }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Không tra cứu được film stock.") }
    finally { setStockLoading(false) }
  }

  return <section className="subpage-section guest-lab-browser">
    <p className="eyebrow">FILM LAB CÔNG KHAI</p>
    <div className="subpage-title-row"><div><h1>Tìm lab phù hợp với cuộn phim</h1><p>So sánh gói đang mở bán, giá và thời gian xử lý trước khi đăng nhập đặt dịch vụ.</p></div><span className="service-total">{labs.totalElements} lab</span></div>
    <div className="guest-lab-filters" aria-label="Bộ lọc Film Lab">
      <label>Quy trình<select value={filters.process} onChange={(e) => setFilters({ ...filters, process: e.target.value })}><option value="">Tất cả</option>{catalogs.processes.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</select></label>
      <label>Khổ phim<select value={filters.format} onChange={(e) => setFilters({ ...filters, format: e.target.value })}><option value="">Tất cả</option>{catalogs.formats.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</select></label>
      <label>Dịch vụ<select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}><option value="">Tất cả</option>{catalogs.types.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</select></label>
      <label>Sắp xếp<select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}><option value="price">Giá thấp trước</option><option value="distance" disabled={!filters.lat}>Gần nhất</option></select></label>
      <Button onClick={() => void loadLabs(0)} disabled={loading}><Search /> Lọc lab</Button><Button variant="outline" onClick={useLocation}><LocateFixed /> Gần tôi</Button>
    </div>
    {locationMessage && <p className="guest-lab-note">{locationMessage}</p>}{error && <div role="alert" className="guest-api-error">{error}</div>}
    {loading ? <div className="guest-loading"><LoaderCircle className="animate-spin" /> Đang tải Film Lab...</div> : labs.content.length ? <div className="film-lab-grid">{labs.content.map((lab) => <article key={lab.id} className="film-lab-card guest-public-lab-card"><button type="button" className="film-lab-card__art" onClick={() => void openLab(lab.id)} style={lab.coverImageUrl ? { backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.28), rgba(0,0,0,.05)), url(${lab.coverImageUrl})` } : undefined}><FlaskConical /><span>Xem chi tiết</span></button><div className="film-lab-card__content"><h2>{lab.labName}</h2><p><MapPin /> {[lab.addressLine, lab.district, lab.province].filter(Boolean).join(", ")}</p><div><strong>Từ {money.format(lab.minPriceVnd)}</strong>{lab.distanceKm != null && <span>{lab.distanceKm.toFixed(1)} km</span>}</div><Button variant="outline" onClick={() => void openLab(lab.id)}>Xem gói dịch vụ</Button></div></article>)}</div> : <div className="empty-state"><Search /><strong>Chưa tìm thấy Film Lab</strong><span>Thử thay đổi bộ lọc hoặc bỏ giới hạn vị trí.</span></div>}
    {labs.totalPages > 1 && <nav className="guest-pagination" aria-label="Phân trang Film Lab"><Button size="sm" variant="outline" disabled={page === 0 || loading} onClick={() => void loadLabs(page - 1)}><ChevronLeft /> Trước</Button><span>Trang {page + 1}/{labs.totalPages}</span><Button size="sm" variant="outline" disabled={page + 1 >= labs.totalPages || loading} onClick={() => void loadLabs(page + 1)}>Sau <ChevronRight /></Button></nav>}
    <div className="guest-stock-lookup"><div><p className="eyebrow">TRA CỨU FILM STOCK</p><h2>Cuộn phim của bạn dùng quy trình nào?</h2><p>Tra cứu nhanh ISO và quy trình tráng mặc định trước khi chọn lab.</p></div><form onSubmit={searchStocks}><div className="service-search"><Search /><Input value={stockQuery} onChange={(e) => setStockQuery(e.target.value)} placeholder="Ví dụ: Portra 400" aria-label="Tên film stock" /><Button disabled={stockLoading}>{stockLoading ? "Đang tìm..." : "Tra cứu"}</Button></div></form>{stocks.length > 0 && <div className="guest-stock-results">{stocks.map((stock) => <div key={stock.id}><strong>{stock.stockName}</strong><span>{stock.manufacturer} · ISO {stock.iso} · {stock.defaultFilmProcessName}</span></div>)}</div>}</div>
    <div className="service-tip"><Sparkles /><p><strong>Chưa biết chọn dịch vụ nào?</strong><br />FilmLink AI có thể gợi ý theo máy ảnh và phong cách bạn thích.</p><button type="button" onClick={() => onSelect("assistant")}>Hỏi trợ lý AI</button></div>
    <Dialog open={detailLoading || Boolean(selectedLab)} onOpenChange={(open) => { if (!open) setSelectedLab(null) }}><DialogContent className="guest-lab-dialog"><DialogHeader><DialogTitle>{selectedLab?.labName || "Đang tải Film Lab..."}</DialogTitle><DialogDescription>{selectedLab ? [selectedLab.addressLine, selectedLab.district, selectedLab.province].filter(Boolean).join(", ") : "Vui lòng chờ."}</DialogDescription></DialogHeader>{detailLoading && <div className="guest-loading"><LoaderCircle className="animate-spin" /> Đang tải chi tiết...</div>}{selectedLab && <div className="guest-lab-detail">{selectedLab.description && <p>{selectedLab.description}</p>}<section><h3>Giờ hoạt động</h3><div className="guest-hours">{selectedLab.openingHours.map((hour) => <span key={hour.dayOfWeek}><strong>{hour.dayOfWeek}</strong>{hour.closed ? "Đóng cửa" : `${hour.opensAt} – ${hour.closesAt}`}</span>)}</div></section><section><h3>Gói đang mở bán</h3><div className="guest-package-list">{selectedLab.packages.length ? selectedLab.packages.map((item) => <article key={item.id}><div><strong>{item.packageName}</strong><span>{item.serviceType.displayName} · {item.filmProcess.displayName} · {item.filmFormat.displayName}</span><small>{item.turnaroundDays} ngày{item.pushPullAvailable ? " · Có push/pull" : ""}</small></div><div><strong>{money.format(item.priceVnd)}</strong><Button size="sm" onClick={() => onBook(String(item.id))}>Đăng nhập để đặt</Button></div></article>) : <p>Lab chưa có gói đang mở bán.</p>}</div></section></div>}</DialogContent></Dialog>
  </section>
}
