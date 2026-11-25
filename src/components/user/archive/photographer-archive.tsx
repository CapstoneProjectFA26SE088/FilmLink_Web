"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Download, Images, LoaderCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUserWorkspace } from "../user-workspace";
import { errorMessage, isPhotographerRole, isSafeHttpUrl, photographerApi, type ArchiveRoll, type ArchiveSummary } from "@/lib/photographer-api";

const when = (value: string | null) => value ? new Date(value).toLocaleString("vi-VN") : "Chưa cập nhật";

export function PhotographerArchive() {
	const { account, accountLoaded } = useUserWorkspace();
	const [rolls, setRolls] = useState<ArchiveSummary[]>([]);
	const [page, setPage] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const load = useCallback(async () => { if (!accountLoaded || !isPhotographerRole(account?.role)) return; setLoading(true); setError(null); try { const result = await photographerApi.archive(page); setRolls(result.content); setPage(result.page); setHasNext(result.hasNext); setTotal(result.totalElements); } catch (cause) { setError(errorMessage(cause)); } finally { setLoading(false); } }, [account?.role, accountLoaded, page]);
	useEffect(() => { void load(); }, [load]);
	if (!accountLoaded || loading) return <Loading />;
	if (!isPhotographerRole(account?.role)) return <Notice text="Khu vực này chỉ dành cho tài khoản Photographer." />;
	return <section className="subpage-section"><p className="eyebrow">DIGITAL FILM ARCHIVE</p><div className="subpage-title-row"><div><h1>Kho ảnh số của bạn</h1><p>Các cuộn đã được lab bàn giao scan, mới nhất trước.</p></div><span className="service-total">{total} cuộn</span></div>{error ? <Notice text={error} action={load} /> : rolls.length ? <div className="archive-grid">{rolls.map((roll) => <Link href={`/archive/${roll.archiveRollId}`} className="archive-card" key={roll.archiveRollId}><div className="archive-cover" style={roll.coverPreviewUrl ? { backgroundImage: `url(${roll.coverPreviewUrl})` } : undefined}>{!roll.coverPreviewUrl ? <Images /> : null}</div><div><strong>{roll.filmStockName || "Dòng phim không còn trong danh mục"}</strong><span>{roll.filmFormatName || "Khổ phim chưa xác định"} · cuộn {roll.rollSequence}</span><span>{roll.labName} · {roll.orderCode}</span><small>{roll.previewCount} ảnh xem trước · giao {when(roll.deliveredAt)}</small></div></Link>)}</div> : <Notice text="Chưa có cuộn phim nào trong kho ảnh số." />}
		<div className="photographer-pagination"><Button variant="outline" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>Trang trước</Button><span>Trang {page + 1}</span><Button variant="outline" disabled={!hasNext} onClick={() => setPage((value) => value + 1)}>Trang sau</Button></div></section>;
}

export function PhotographerArchiveDetail({ archiveRollId }: { archiveRollId: number }) {
	const { account, accountLoaded } = useUserWorkspace();
	const [roll, setRoll] = useState<ArchiveRoll | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const load = useCallback(async () => { if (!accountLoaded || !isPhotographerRole(account?.role)) return; setLoading(true); setError(null); try { setRoll(await photographerApi.archiveRoll(archiveRollId)); } catch (cause) { setError(errorMessage(cause)); } finally { setLoading(false); } }, [account?.role, accountLoaded, archiveRollId]);
	useEffect(() => { void load(); }, [load]);
	if (!accountLoaded || loading) return <Loading />;
	if (!isPhotographerRole(account?.role)) return <Notice text="Khu vực này chỉ dành cho tài khoản Photographer." />;
	if (!roll) return <section className="subpage-section"><Notice text={error || "Không tìm thấy cuộn phim."} action={load} /></section>;
	return <section className="subpage-section"><Link className={buttonVariants({ variant: "ghost" })} href="/archive"><ArrowLeft /> Quay lại kho ảnh</Link><p className="eyebrow">CUỘN {roll.rollSequence} · {roll.orderCode}</p><div className="subpage-title-row"><div><h1>{roll.filmStockName || "Cuộn phim"}</h1><p>{roll.filmFormatName || "Khổ phim chưa xác định"} · {roll.exposureCount} kiểu · {roll.labName}</p></div>{isSafeHttpUrl(roll.fullResolutionLink) ? <a className={buttonVariants()} href={roll.fullResolutionLink} target="_blank" rel="noopener noreferrer"><Download /> Mở file gốc</a> : <span className="service-total">Chưa có link file gốc hợp lệ</span>}</div>
		{error ? <Notice text={error} action={load} /> : null}<dl className="archive-metadata"><div><dt>Máy ảnh</dt><dd>{roll.camera || "—"}</dd></div><div><dt>Ống kính</dt><dd>{roll.lens || "—"}</dd></div><div><dt>Ngày chụp</dt><dd>{roll.shotOn || "—"}</dd></div><div><dt>Địa điểm</dt><dd>{roll.location || "—"}</dd></div><div><dt>Giao scan</dt><dd>{when(roll.deliveredAt)}</dd></div><div><dt>Link kiểm tra</dt><dd>{when(roll.linkVerifiedAt)}</dd></div></dl>{roll.note ? <p>{roll.note}</p> : null}{roll.frameCountDiscrepancyNote ? <p className="marketplace-demo-note">Ghi chú lệch số khung: {roll.frameCountDiscrepancyNote}</p> : null}
		<div className="archive-preview-grid">{roll.previews.map((preview) => <a href={preview.url} target="_blank" rel="noopener noreferrer" key={preview.id} className="archive-preview"><div style={{ backgroundImage: `url(${preview.url})` }} /><span>Khung {preview.frameNumber} · {preview.widthPx}×{preview.heightPx}</span></a>)}</div>{roll.previews.length === 0 ? <Notice text="Cuộn này chưa có ảnh xem trước hiện hành." /> : null}</section>;
}

function Loading() { return <div className="photographer-loading"><LoaderCircle className="photographer-spin" /> Đang tải kho ảnh...</div>; }
function Notice({ text, action }: { text: string; action?: () => void | Promise<void> }) { return <div className="empty-state"><Images /><strong>{text}</strong>{action ? <Button variant="outline" onClick={() => void action()}>Tải lại</Button> : null}</div>; }
