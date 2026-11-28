import type { FinanceColumn, FinanceRow } from "./finance-data";
import styles from "./finance.module.css";

export function FinanceTable({ label, columns, rows }: { label: string; columns: FinanceColumn[]; rows: FinanceRow[] }) {
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
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
