import { Button } from "@/components/ui/button";
import type { FinanceColumn, FinanceRow } from "./finance-data";
import styles from "./finance.module.css";

type FinanceTableProps = {
	label: string;
	columns: FinanceColumn[];
	rows: FinanceRow[];
	/** When set, each row gets a "Chi tiết" action that reports the row id. */
	onOpenRow?: (id: number) => void;
};

export function FinanceTable({ label, columns, rows, onOpenRow }: FinanceTableProps) {
	return (
		<div className={styles.tableWrap}>
			<table className={styles.table} aria-label={label}>
				<thead>
					<tr>
						{columns.map((column) => (
							<th scope="col" key={column.header} className={column.align === "end" ? styles.end : undefined}>
								{column.header}
							</th>
						))}
						{onOpenRow ? <th scope="col" className={styles.end}>Thao tác</th> : null}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.id}>
							{row.cells.map((cell, index) => (
								<td key={columns[index]?.header ?? index} className={columns[index]?.align === "end" ? styles.end : undefined}>
									{cell}
								</td>
							))}
							{onOpenRow ? (
								<td className={styles.end}>
									<Button variant="outline" size="sm" onClick={() => onOpenRow(row.id)}>Chi tiết</Button>
								</td>
							) : null}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
