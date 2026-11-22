"use client";

import { useRef, useState } from "react";
import { DatabaseZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { AdminApiError, adminApi } from "@/lib/admin-api";
import styles from "./admin-pages.module.css";

type ReindexResult = {
	articleCount: number;
	chunkCount: number;
	embeddingModel: string;
};

type ReindexFailure = {
	message: string;
	uncertain: boolean;
};

export function KnowledgeBaseReindexCard() {
	const inFlight = useRef(false);
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [pending, setPending] = useState(false);
	const [result, setResult] = useState<ReindexResult | null>(null);
	const [failure, setFailure] = useState<ReindexFailure | null>(null);

	function openConfirmation() {
		if (inFlight.current) return;
		setConfirmationOpen(true);
	}

	async function reindex() {
		if (inFlight.current) return;
		inFlight.current = true;
		setConfirmationOpen(false);
		setPending(true);
		setResult(null);
		setFailure(null);
		try {
			const response = await adminApi<ReindexResult>("admin/knowledge-base/reindex", {
				method: "POST",
				body: JSON.stringify({}),
			});
			setResult(response);
		} catch (cause) {
			const detail = cause instanceof Error ? cause.message : "Không thể xác nhận kết quả tái lập chỉ mục.";
			const definiteApiFailure = cause instanceof AdminApiError && (cause.status < 500 || cause.status === 503);
			setFailure({ message: detail, uncertain: !definiteApiFailure });
		} finally {
			inFlight.current = false;
			setPending(false);
		}
	}

	return (
		<section className={`${styles.panel} ${styles.reindexCard}`} aria-labelledby="knowledge-base-reindex-title">
			<div className={styles.reindexBody}>
				<div className={styles.reindexIcon} aria-hidden="true"><DatabaseZap /></div>
				<div className={styles.reindexCopy}>
					<h2 id="knowledge-base-reindex-title">Tái lập chỉ mục Knowledge Base</h2>
					<p>Tạo lại các đoạn nội dung và embedding dùng cho tìm kiếm. Tác vụ có thể tốn tài nguyên và mất hơn 20 giây.</p>
				</div>
				<Button type="button" disabled={pending} onClick={openConfirmation}>
					{pending ? "Đang tái lập chỉ mục…" : "Tái lập chỉ mục"}
				</Button>
			</div>

			{pending && (
				<p className={styles.reindexPending} role="status">
					Yêu cầu đang được xử lý. Không đóng trang hoặc gửi lại yêu cầu này.
				</p>
			)}
			{result !== null && (
				<div className={styles.reindexResult} role="status" aria-label="Kết quả tái lập chỉ mục">
					<div><span>Bài viết</span><strong>{result.articleCount.toLocaleString("vi-VN")}</strong></div>
					<div><span>Đoạn nội dung</span><strong>{result.chunkCount.toLocaleString("vi-VN")}</strong></div>
					<div><span>Embedding model</span><strong>{result.embeddingModel || "—"}</strong></div>
				</div>
			)}
			{failure && (
				<div className={styles.reindexError} role="alert">
					<strong>{failure.uncertain ? "Chưa thể xác nhận kết quả." : "Không thể bắt đầu tác vụ."}</strong>
					<span>{failure.message}</span>
					{failure.uncertain && <span>Kết nối chỉ chờ tối đa 20 giây; dịch vụ có thể đã nhận yêu cầu và vẫn đang chạy hoặc đã hoàn thành một phần. Không chạy lại ngay—hãy kiểm tra trạng thái backend trước.</span>}
				</div>
			)}

			<Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>Xác nhận tái lập chỉ mục</DialogTitle>
						<DialogDescription>
							Tác vụ này tạo lại toàn bộ chỉ mục Knowledge Base và có thể tiêu tốn đáng kể tài nguyên embedding.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose render={<Button type="button" variant="outline" />}>Hủy</DialogClose>
						<Button type="button" disabled={pending} onClick={() => void reindex()}>
							Xác nhận chạy
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>
	);
}
