"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Copy, Download, Images } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { formatDate } from "@/lib/format";
import { useUserWorkspace } from "../user-workspace";
import {
	errorMessage,
	isPhotographerRole,
	isSafeHttpUrl,
	photographerApi,
	type ArchiveRoll,
	type ArchiveSummary,
} from "@/lib/photographer-api";

const NOT_PHOTOGRAPHER_TITLE = "Khu vực này chỉ dành cho tài khoản Photographer.";

function backgroundImage(url: string | null) {
	return url && isSafeHttpUrl(url) ? { backgroundImage: `url(${JSON.stringify(url)})` } : undefined;
}

export function PhotographerArchive() {
	const { account, accountLoaded } = useUserWorkspace();
	const [rolls, setRolls] = useState<ArchiveSummary[]>([]);
	const [page, setPage] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		if (!accountLoaded || !isPhotographerRole(account?.role)) return;
		setLoading(true);
		setError(null);
		try {
			const result = await photographerApi.archive(page);
			setRolls(result.content);
			setPage(result.page);
			setHasNext(result.hasNext);
			setTotal(result.totalElements);
		} catch (cause) {
			setError(errorMessage(cause));
		} finally {
			setLoading(false);
		}
	}, [account?.role, accountLoaded, page]);

	useEffect(() => {
		void load();
	}, [load]);

	if (!accountLoaded) {
		return <StatePanel variant="loading" label="Đang tải thông tin tài khoản…" />;
	}
	if (!isPhotographerRole(account?.role)) {
		return <StatePanel variant="empty" title={NOT_PHOTOGRAPHER_TITLE} />;
	}

	return (
		<section className="subpage-section">
			<p className="eyebrow photographer-eyebrow">Kho ảnh số</p>
			<div className="subpage-title-row">
				<div>
					<h1>Kho ảnh số của bạn</h1>
					<p>Các cuộn đã được lab bàn giao scan, mới nhất trước.</p>
				</div>
				<span className="service-total">{total} cuộn</span>
			</div>

			<div className="photographer-list-region" aria-busy={loading}>
				{error ? (
					<StatePanel
						variant="error"
						title="Không thể tải kho ảnh số"
						description={error}
						onRetry={() => void load()}
					/>
				) : loading ? (
					<StatePanel variant="loading" rows={4} label="Đang tải kho ảnh số…" />
				) : rolls.length ? (
					<div className="archive-grid">
						{rolls.map((roll) => (
							<ArchiveCard key={roll.archiveRollId} roll={roll} />
						))}
					</div>
				) : (
					<StatePanel
						variant="empty"
						icon={Images}
						title="Chưa có cuộn phim nào trong kho ảnh số"
						description="Khi lab bàn giao ảnh scan, các cuộn phim của bạn sẽ xuất hiện tại đây."
					/>
				)}
			</div>

			<div className="photographer-pagination">
				<Button variant="outline" disabled={page === 0 || loading} onClick={() => setPage((value) => value - 1)}>
					Trang trước
				</Button>
				<span>Trang {page + 1}</span>
				<Button variant="outline" disabled={!hasNext || loading} onClick={() => setPage((value) => value + 1)}>
					Trang sau
				</Button>
			</div>
		</section>
	);
}

function ArchiveCard({ roll }: { roll: ArchiveSummary }) {
	const stockName = roll.filmStockName || "Dòng phim không còn trong danh mục";
	return (
		<Link
			href={`/archive/${roll.archiveRollId}`}
			className="archive-card"
			aria-label={`Cuộn ${roll.rollSequence} · ${stockName} · đơn ${roll.orderCode}`}
		>
			<div className="archive-cover" style={backgroundImage(roll.coverPreviewUrl)} aria-hidden="true">
				{!roll.coverPreviewUrl ? <Images /> : null}
			</div>
			<div>
				<strong>{stockName}</strong>
				<span>
					{roll.filmFormatName || "Khổ phim chưa xác định"} · cuộn {roll.rollSequence}
				</span>
				<span>
					{roll.labName} · {roll.orderCode}
				</span>
				<small>
					{roll.previewCount} ảnh xem trước · giao {formatDate(roll.deliveredAt)}
				</small>
			</div>
		</Link>
	);
}

export function PhotographerArchiveDetail({ archiveRollId }: { archiveRollId: number }) {
	const { account, accountLoaded } = useUserWorkspace();
	const [roll, setRoll] = useState<ArchiveRoll | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

	const load = useCallback(async () => {
		if (!accountLoaded || !isPhotographerRole(account?.role)) return;
		setLoading(true);
		setError(null);
		try {
			setRoll(await photographerApi.archiveRoll(archiveRollId));
		} catch (cause) {
			setError(errorMessage(cause));
		} finally {
			setLoading(false);
		}
	}, [account?.role, accountLoaded, archiveRollId]);

	useEffect(() => {
		void load();
	}, [load]);

	async function copyFullResolutionLink(link: string) {
		try {
			await navigator.clipboard.writeText(link);
			setCopyState("copied");
		} catch {
			setCopyState("failed");
		}
	}

	if (!accountLoaded) {
		return <StatePanel variant="loading" label="Đang tải thông tin tài khoản…" />;
	}
	if (!isPhotographerRole(account?.role)) {
		return <StatePanel variant="empty" title={NOT_PHOTOGRAPHER_TITLE} />;
	}

	const backLink = (
		<Link className={`${buttonVariants({ variant: "ghost" })} order-detail-back`} href="/archive">
			<ArrowLeft aria-hidden="true" /> Quay lại kho ảnh
		</Link>
	);

	if (!roll) {
		return (
			<section className="subpage-section">
				{backLink}
				{loading ? (
					<StatePanel variant="loading" rows={3} label="Đang tải cuộn phim…" />
				) : error ? (
					<StatePanel
						variant="error"
						title="Không thể tải cuộn phim"
						description={error}
						onRetry={() => void load()}
					/>
				) : (
					<StatePanel
						variant="empty"
						icon={Images}
						title="Không tìm thấy cuộn phim"
						description="Cuộn phim không tồn tại hoặc chưa được bàn giao scan cho bạn."
					/>
				)}
			</section>
		);
	}

	const fullResolutionLink = isSafeHttpUrl(roll.fullResolutionLink) ? roll.fullResolutionLink : null;

	return (
		<section className="subpage-section">
			{backLink}
			<p className="eyebrow photographer-eyebrow">
				Cuộn {roll.rollSequence} · {roll.orderCode}
			</p>
			<div className="subpage-title-row">
				<div>
					<h1>{roll.filmStockName || "Cuộn phim"}</h1>
					<p>
						{roll.filmFormatName || "Khổ phim chưa xác định"} · {roll.exposureCount} kiểu · {roll.labName}
					</p>
				</div>
				{fullResolutionLink ? (
					<div className="archive-actions">
						<a
							className={buttonVariants()}
							href={fullResolutionLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Download aria-hidden="true" /> Mở file gốc
							<span className="sr-only"> (mở trong tab mới)</span>
						</a>
						<Button type="button" variant="outline" onClick={() => void copyFullResolutionLink(fullResolutionLink)}>
							<Copy data-icon="inline-start" /> Sao chép liên kết
						</Button>
					</div>
				) : (
					<span className="service-total">Chưa có link file gốc hợp lệ</span>
				)}
			</div>

			{copyState === "copied" ? (
				<InlineMessage tone="success" className="photographer-message">
					Đã sao chép liên kết file gốc.
				</InlineMessage>
			) : null}
			{copyState === "failed" ? (
				<InlineMessage tone="error" className="photographer-message">
					Không thể sao chép liên kết. Hãy dùng nút “Mở file gốc” và sao chép từ thanh địa chỉ.
				</InlineMessage>
			) : null}
			{error ? (
				<InlineMessage tone="error" className="photographer-message">
					{error}
				</InlineMessage>
			) : null}

			<h2 className="sr-only">Thông tin cuộn phim</h2>
			<dl className="archive-metadata">
				<div>
					<dt>Máy ảnh</dt>
					<dd>{roll.camera || "—"}</dd>
				</div>
				<div>
					<dt>Ống kính</dt>
					<dd>{roll.lens || "—"}</dd>
				</div>
				<div>
					<dt>Ngày chụp</dt>
					<dd>{roll.shotOn || "—"}</dd>
				</div>
				<div>
					<dt>Địa điểm</dt>
					<dd>{roll.location || "—"}</dd>
				</div>
				<div>
					<dt>Giao scan</dt>
					<dd>{formatDate(roll.deliveredAt)}</dd>
				</div>
				<div>
					<dt>Link kiểm tra</dt>
					<dd>{formatDate(roll.linkVerifiedAt)}</dd>
				</div>
			</dl>
			{roll.note ? <p className="archive-note">{roll.note}</p> : null}
			{roll.frameCountDiscrepancyNote ? (
				<InlineMessage tone="warning" className="photographer-message">
					Ghi chú lệch số khung: {roll.frameCountDiscrepancyNote}
				</InlineMessage>
			) : null}

			<h2 className="archive-section-title">Ảnh xem trước</h2>
			{roll.previews.length ? (
				<div className="archive-preview-grid">
					{roll.previews.map((preview) => (
						<a
							href={preview.url}
							target="_blank"
							rel="noopener noreferrer"
							key={preview.id}
							className="archive-preview"
							aria-label={`Mở ảnh khung ${preview.frameNumber}, ${preview.widthPx}×${preview.heightPx}, trong tab mới`}
						>
							<div style={backgroundImage(preview.url)} aria-hidden="true" />
							<span>
								Khung {preview.frameNumber} · {preview.widthPx}×{preview.heightPx}
							</span>
						</a>
					))}
				</div>
			) : (
				<StatePanel
					variant="empty"
					icon={Images}
					title="Chưa có ảnh xem trước"
					description="Cuộn này chưa có ảnh xem trước hiện hành."
				/>
			)}
		</section>
	);
}
