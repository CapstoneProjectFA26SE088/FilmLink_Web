"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { labOwnerApi, LabOwnerApiError } from "@/lib/lab-owner-api";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import styles from "../lab-owner-pages.module.css";

type Account = { bankName: string; bankAccountNumber: string; accountHolderName: string };
const path = "film-labs/me/payout-account";
const empty: Account = { bankName: "", bankAccountNumber: "", accountHolderName: "" };

export function PayoutAccount() {
  const [saved, setSaved] = useState<Account | null>(null);
  const [draft, setDraft] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    const request = new AbortController();
    labOwnerApi<Account | null>(path, { signal: request.signal })
      .then(account => { if (!request.signal.aborted) setSaved(account ?? null); })
      .catch((cause: unknown) => {
        if (request.signal.aborted) return;
        if (cause instanceof LabOwnerApiError && cause.status === 404) setSaved(null);
        else setError(cause instanceof Error ? cause.message : "Không thể tải tài khoản nhận tiền.");
      })
      .finally(() => { if (!request.signal.aborted) setLoading(false); });
    return () => request.abort();
  }, [attempt]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || busy.current) return;
    const account = {
      bankName: draft.bankName.trim(),
      bankAccountNumber: draft.bankAccountNumber.trim(),
      accountHolderName: draft.accountHolderName.trim(),
    };
    if (!account.bankName || account.accountHolderName.length < 2 || !/^[0-9]{6,30}$/.test(account.bankAccountNumber)) {
      setError("Vui lòng kiểm tra tên ngân hàng, tên chủ tài khoản và số tài khoản từ 6 đến 30 chữ số.");
      return;
    }
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      const updated = await labOwnerApi<Account>(path, { method: "PUT", body: JSON.stringify(account) });
      setSaved(updated);
      setDraft(null);
      setNotice("Đã lưu tài khoản nhận tiền.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể lưu tài khoản nhận tiền.");
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  return <section className={styles.panel} aria-label="Tài khoản nhận tiền">
    <div className={styles.panelHeader}><h2>Tài khoản nhận tiền</h2></div>
    <div className={styles.detailBody}>
      {loading ? <StatePanel variant="loading" rows={1} label="Đang tải tài khoản…" /> : draft ? <form onSubmit={save}>
        <fieldset className={styles.fieldGrid} disabled={saving}>
          <label className={styles.fieldLabel}>Ngân hàng<input className={styles.field} required maxLength={100} value={draft.bankName} onChange={event => setDraft({ ...draft, bankName: event.target.value })} /></label>
          <label className={styles.fieldLabel}>Số tài khoản<input className={styles.field} required autoComplete="off" inputMode="numeric" pattern="[0-9]{6,30}" maxLength={30} value={draft.bankAccountNumber} onChange={event => setDraft({ ...draft, bankAccountNumber: event.target.value })} /></label>
          <label className={styles.fieldLabel}>Chủ tài khoản<input className={styles.field} required minLength={2} maxLength={100} value={draft.accountHolderName} onChange={event => setDraft({ ...draft, accountHolderName: event.target.value })} /></label>
        </fieldset>
        <div className={styles.tableActions}><Button type="submit" disabled={saving}>{saving ? "Đang lưu…" : "Lưu tài khoản"}</Button><Button type="button" variant="outline" disabled={saving} onClick={() => { setDraft(null); setError(""); }}>Hủy</Button></div>
      </form> : !error && <>
        <p>{saved ? `${saved.bankName} · •••• ${(saved.bankAccountNumber ?? "").slice(-4)} · ${saved.accountHolderName}` : "Lab chưa thiết lập tài khoản nhận tiền."}</p>
        <Button variant="outline" onClick={() => { setDraft(saved ?? empty); setNotice(""); }}>{saved ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}</Button>
      </>}
      {error ? <div className="grid gap-3">
        <InlineMessage tone="error">{error}</InlineMessage>
        {!draft ? <div><Button variant="outline" onClick={() => { setError(""); setLoading(true); setAttempt(attempt + 1); }}>Thử lại</Button></div> : null}
      </div> : null}
      {notice ? <InlineMessage tone="success">{notice}</InlineMessage> : null}
    </div>
  </section>;
}
