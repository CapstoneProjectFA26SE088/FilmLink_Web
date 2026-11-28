# FilmLink Web · Bảng theo dõi hoàn thiện demo (thay Jira)

Workflow harness `frontend-delivery` (codex-harness-javascript), chạy ngày 28/11/2026. Jira và Stitch không kết nối được trong phiên này, nên bảng này thay cho Jira. `DESIGN_SYSTEM.md` cùng các màn hình hiện có là bằng chứng thiết kế được duyệt.

Ưu tiên demo: WF-01 → WF-03 → WF-04 → WF-02. WF-05 (ký gửi) giữ prototype vì backend chưa có API.

| Mã | Đơn vị | Phạm vi ghi | Phụ thuộc | Trạng thái |
|---|---|---|---|---|
| U1 | Thành phần dùng chung: nhãn tiếng Việt cho enum, StatusBadge, StatePanel/InlineMessage, `lib/format.ts` | `components/shared/status`, `components/shared/feedback`, `lib/format.ts`, nhãn trong `lib/lab-owner-api.ts` | — | Hoàn thành |
| U2 | WF-01 phía Photographer: `/services`, `/orders`, `/archive` | `components/user/{services,orders,archive}`, các khối liên quan trong `globals.css` | U1 | Hoàn thành |
| U3 | WF-01 phía Lab + WF-03: đơn, công đoạn, scan, máy/lịch/ETA | `components/lab-owner/{orders,machines}`, `lab-owner-pages.module.css` (chỉ thêm) | U1 | Hoàn thành |
| U4 | WF-04 + WF-02: `/open-lab`, duyệt Lab, hồ sơ/dịch vụ Lab, tài chính | form đăng ký Lab, admin workflows, lab-owner profile/services/settlements/revenue, finance | U1 | Hoàn thành |

Tiêu chí chung: không hiện enum thô ra giao diện; mỗi vùng tải dữ liệu đều có trạng thái tải/rỗng/lỗi; không có chữ dưới 12px; hộp thoại dùng được bằng bàn phím; `pnpm build` thành công; giữ nguyên các lời gọi API.

## Kết quả kiểm thử và nghiệm thu (28/11/2026)

- Build production (`next build`) thành công. `tsc --noEmit` không lỗi. Unit test `roll-damage`, `schedule-confirmation` đạt 5/5.
- ESLint còn 34 vấn đề, giảm từ 41. Tất cả đều là mẫu `react-hooks/set-state-in-effect` có từ trước (gọi `load()` trong `useEffect`).
- Kiểm thử UI bằng Chromium (Playwright) với backend giả mô phỏng hợp đồng OpenAPI, đăng nhập thật qua form với 3 vai trò Photographer, Chủ Lab, Admin. 17 trang × 2 khung hình (1280 và 375): đạt 34/34. Không có lỗi console, không cuộn ngang, không còn enum thô.
- Form đăng nhập không đưa mật khẩu lên URL. Phím Escape đóng được hộp thoại. Tab ở `/open-lab` chuyển được bằng bàn phím.
- 4 lỗi phát hiện ở vòng đầu đã sửa: tràn ngang của bảng trên mobile, vai trò hiện enum thô ở sidebar, loại tài liệu hiện enum thô, ô chọn tệp hiện tiếng Anh. Thêm bảo vệ cho `payout-account` khi thiếu số tài khoản.
- Brain nghiệm thu: **accepted**. Các lời gọi API (path, method, body) giữ nguyên so với baseline.

Rủi ro còn lại: chưa chạy E2E với staging thật, vì môi trường kiểm thử không truy cập được Azure. Cần chạy `node tests/staging-read-smoke.mjs` trên máy dev và đi lại WF-01 trước buổi demo. Nút "Đánh dấu đã chi" chưa được nối vì hợp đồng API chưa xác nhận. WF-05 vẫn là prototype.

## Chạy E2E trên staging thật (28/11/2026, 14:05–14:15)

Web chạy `pnpm dev` trên máy dev, backend là staging Azure. Thao tác bằng trình duyệt tích hợp của Claude.

**WF-01 đạt trọn vòng** với đơn #10 `SO261128QPMZ2Q`, Sài Gòn Film Lab, 1 cuộn Kodak Portra 400 C-41 35mm, 80.000 ₫, trả tại lab:
1. Photographer lấy báo giá (dự kiến trả 1/12) và tạo đơn. Trang chi tiết hiện thông báo tạo đơn thành công.
2. Chủ Lab nhận đơn: AWAITING_LAB_CONFIRMATION → AWAITING_FILM.
3. Nhận phim kèm ảnh bằng chứng: AWAITING_MACHINE_ASSIGNMENT, handover RECEIVED_AT_LAB.
4. WF-03: đề xuất lịch "Khả thi", phân bổ 30/11. Xác nhận lịch máy chuyển đơn sang IN_PROCESSING.
5. Ghi đủ 6 công đoạn RECEIVED → QC.
6. Tải 2 ảnh xem trước, lưu link gốc (backend từ chối link 404 đúng như thiết kế), giao scan: READY_FOR_HANDOVER.
7. Kho ảnh của Photographer hiện đủ 2 khung, có nút mở và sao chép link gốc.
8. Lab trả phim: DELIVERED. Photographer xác nhận: **CLOSED**.

**Rà nhãn thô trên staging:** các trang `/lab-owner/*` (8 trang) và `/admin`, `/admin/labs`, `/admin/payments` không còn enum thô. Riêng mã máy do Lab tự đặt và "MST" là dữ liệu hợp lệ.

**Lỗi phát hiện trên staging và đã sửa:**
- Trạng thái cuộn `DECLARED` hiện "Không xác định". Đã thêm nhãn cho DECLARED, NOT_RECEIVED và RETURNED.
- Ô chọn tệp ở nhận phim, scan, trả phim và báo hỏng hiện tiếng Anh. Đã thay bằng `FilePicker` dùng chung.
- Hộp thoại xác nhận luôn ghi "đồng ý để lab giữ âm bản" kể cả khi lab đã trả phim. Nội dung giờ đổi theo `keepNegativesAtLab`.
- Form khai báo cuộn bị tràn ô nhập ở độ rộng khoảng 800px. Đã sửa box-sizing.

**Dữ liệu thử để lại trên staging:** đơn #10 (đã đóng) cùng 2 ảnh xem trước. Link gốc của đơn này là `https://example.com/`.
