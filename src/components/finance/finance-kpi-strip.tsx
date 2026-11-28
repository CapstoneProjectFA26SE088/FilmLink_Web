import type { FinanceKpi } from "./finance-data";
import styles from "./finance.module.css";

/** Totals computed from the rows already loaded on the current page only. */
export function FinanceKpiStrip({ kpis, rowCount }: { kpis: FinanceKpi[]; rowCount: number }) {
	return (
		<section className={styles.kpis} aria-label="Tổng hợp trên trang này">
			<p className={styles.kpiCaption}>Tổng hợp trên trang này · {rowCount} dòng</p>
			<dl className={styles.kpiGrid}>
				{kpis.map((kpi) => (
					<div className={styles.kpi} key={kpi.label}>
						<dt>{kpi.label}</dt>
						<dd>{kpi.value}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
