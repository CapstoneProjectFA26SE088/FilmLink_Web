"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DebtDetailDialog } from "@/components/finance/debt-detail-dialog";
import { PayoutDetailDialog } from "@/components/finance/payout-detail-dialog";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import { FinanceKpiStrip } from "@/components/finance/finance-kpi-strip";
import { FinanceTable } from "@/components/finance/finance-table";
import { FINANCE_SCREENS, loadFinancePage, type FinancePage, type FinanceView } from "@/components/finance/finance-data";
import styles from "@/components/finance/finance.module.css";

type FinanceReportProps = {
  view: FinanceView;
  /** Render inside another page: the title becomes an h2 and no page wrapper padding is added. */
  embedded?: boolean;
  /** Required for the "admin-debts" view: the Film Lab whose debts are listed. */
  labId?: number;
};

const OPEN_BY_ID: Partial<Record<FinanceView, { label: string; hint: string }>> = {
  "admin-payouts": { label: "Mở theo mã chi trả", hint: "Nhập ID khoản chi trả để mở ngay cả khi danh sách trống." },
  "lab-debt": { label: "Mở theo mã kỳ nợ", hint: "Nhập ID kỳ công nợ để xem chi tiết." },
  "admin-debts": { label: "Mở theo mã kỳ nợ", hint: "Nhập ID kỳ công nợ để xem chi tiết." },
};

export function FinanceReport({ view, embedded = false, labId }: FinanceReportProps) {
  const [page, setPage] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<FinancePage | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [idInput, setIdInput] = useState("");
  const screen = FINANCE_SCREENS[view];

  useEffect(() => {
    const request = new AbortController();
    loadFinancePage(view, page, request.signal, labId).then(data => {
      if (!request.signal.aborted) setResult(data);
    }).catch((cause: unknown) => {
      if (!request.signal.aborted) setError(cause instanceof Error ? cause.message : "Không thể tải báo cáo.");
    });
    return () => request.abort();
  }, [view, page, attempt, labId]);

  function changePage(nextPage: number) {
    setResult(null);
    setError("");
    setPage(nextPage);
  }

  function retry() {
    setResult(null);
    setError("");
    setAttempt(value => value + 1);
  }

  const openByIdConfig = OPEN_BY_ID[view];
  const detailKind = view === "admin-payouts" ? "payout" : view === "lab-debt" || view === "admin-debts" ? "debt" : null;

  function openById(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = Number(idInput);
    if (Number.isInteger(id) && id > 0) setOpenId(id);
  }

  const Heading = embedded ? "h2" : "h1";
  const loading = !result && !error;
  const showPager = result && (page > 0 || result.totalPages > 1);

  return <div className={embedded ? undefined : styles.page}>
    <header className={styles.heading}>
      <div>
        <Heading>{screen.title}</Heading>
        <p>{screen.description}</p>
      </div>
    </header>
    <div className="grid gap-4 pt-4">
      {openByIdConfig ? <form className="flex flex-wrap items-end gap-2" onSubmit={openById}>
        <label className="grid gap-1 text-sm">
          {openByIdConfig.label}
          <Input
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            className="w-44"
            placeholder="ID"
            value={idInput}
            onChange={event => setIdInput(event.target.value)}
          />
        </label>
        <Button type="submit" variant="outline" disabled={!(Number(idInput) > 0)}>Mở</Button>
        <p className="m-0 basis-full text-xs text-muted-foreground">{openByIdConfig.hint}</p>
      </form> : null}
      {result && result.rows.length > 0 ? <FinanceKpiStrip kpis={result.kpis} rowCount={result.rows.length} /> : null}
      <section className={styles.panel} aria-label={screen.title} aria-busy={loading}>
        {error ? <StatePanel
          variant="error"
          title="Không tải được dữ liệu"
          description={error}
          onRetry={retry}
          className={styles.statePad}
        />
          : loading ? <StatePanel variant="loading" rows={4} label="Đang tải báo cáo…" className={styles.statePad} />
          : result && result.rows.length === 0 ? <StatePanel
            variant="empty"
            title={page > 0 ? "Trang này không có dòng nào" : screen.emptyTitle}
            description={page > 0 ? "Hãy quay lại trang trước để xem các dòng đã có." : screen.emptyHint}
            action={page > 0 ? <Button variant="outline" onClick={() => changePage(page - 1)}>Trang trước</Button> : undefined}
            className="m-4"
          />
          : result ? <FinanceTable label={screen.title} columns={screen.columns} rows={result.rows} onOpenRow={detailKind ? setOpenId : undefined} /> : null}
        {showPager ? <nav className={styles.pager} aria-label="Phân trang">
          <Button variant="outline" disabled={page === 0} onClick={() => changePage(page - 1)}>Trang trước</Button>
          <span className={styles.pagerInfo}>
            Trang {page + 1} / {Math.max(page + 1, result.totalPages)}
            {result.totalElements !== null ? ` · ${result.totalElements} dòng` : ""}
          </span>
          <Button variant="outline" disabled={page + 1 >= result.totalPages} onClick={() => changePage(page + 1)}>Trang sau</Button>
        </nav> : null}
      </section>
    </div>
    {detailKind === "payout" ? <PayoutDetailDialog payoutId={openId} onClose={() => setOpenId(null)} onChanged={retry} /> : null}
    {detailKind === "debt" ? <DebtDetailDialog
      debtId={openId}
      mode={view === "admin-debts" ? "admin" : "lab"}
      onClose={() => setOpenId(null)}
      onChanged={retry}
    /> : null}
  </div>;
}
