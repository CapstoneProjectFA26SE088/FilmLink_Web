import { ArrowLeft, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConsignmentBalance({ onBack }: { onBack: () => void }) {
	return (
		<section className="subpage-section marketplace-section">
			<p className="eyebrow">CHỢ KÝ GỬI · ĐỐI SOÁT</p>
			<div className="subpage-title-row">
				<div><h1>Lịch sử giao dịch và tiền ký gửi</h1><p>Kiểm tra tiền bán hàng và các khoản khấu trừ.</p></div>
				<Button type="button" variant="outline" onClick={onBack}><ArrowLeft data-icon="inline-start" /> Quay lại</Button>
			</div>
			<div className="marketplace-balance-note">
				<CircleDollarSign aria-hidden="true" />
				<div><strong>Đối soát tiền ký gửi</strong><p>Tiền được chi sau thời hạn trả hàng 7 ngày. Prototype tham khảo phí lab 5% và hoa hồng nền tảng 5%.</p></div>
			</div>
			<div className="marketplace-table-wrap">
				<table className="marketplace-table">
					<caption className="sr-only">Lịch sử giao dịch ký gửi</caption>
					<thead><tr><th>Sản phẩm</th><th>Giá bán</th><th>Phí lab</th><th>Hoa hồng</th><th>Thực nhận</th><th>Trạng thái</th></tr></thead>
					<tbody><tr><td className="marketplace-no-results" colSpan={6}>Chưa có giao dịch để hiển thị.</td></tr></tbody>
				</table>
			</div>
			<p className="marketplace-demo-note">Mức phí và thời hạn trong đây theo prototype; cần xác nhận lại với quy tắc nghiệp vụ trước khi nối giao dịch thật.</p>
		</section>
	);
}
