# FilmLink Web · Đối chiếu API cho buổi demo

Ngày 28/11/2026. Mốc so sánh là commit `1f83287` của website. Các kết quả trong cột “Website tại mốc so sánh” mô tả source trước các thay đổi của đợt hoàn thiện này. Website có 48 trang App Router ở mốc đó. Hợp đồng FilmLink API v1 (OpenAPI 3.1.0) công bố 100 đường dẫn và 119 cặp phương thức–đường dẫn. Bảng dùng đường dẫn rút gọn sau `/api/v1/`. Xác nhận có lời gọi trong source và kiểm thử giao dịch thành công là hai mức bằng chứng riêng.

[Hợp đồng OpenAPI staging](https://app-filmlink-stg1841-ekg0h2dbfghseec0.malaysiawest-01.azurewebsites.net/v3/api-docs)

## Năm workflow và tiêu chí nghiệm thu

| Mốc theo Jira | Website tại mốc so sánh | Bằng chứng cần lấy để nghiệm thu trên staging |
|---|---|---|
| WF-01 · Đặt dịch vụ → giao scan → kho phim (FA26-217) | `/services` gọi danh mục, tìm Lab và gói, POST `orders/quote`, POST `orders` với `PAY_AT_LAB`. `/orders` đọc đơn của Photographer. `/lab-owner/orders` gọi GET `lab/orders`, có nhận đơn, xác nhận cuộn, chuyển công đoạn, tải scan, link gốc, giao scan và trả phim. Photographer xác nhận và mở `/archive`. | Dùng hai phiên riêng của Photographer và chủ Lab đã chọn. Ghi cùng mã đơn ở cả hai phía. Đối chiếu cuộn, trạng thái, file scan và kho phim sau giao. Kiểm tra lại khi tải mới trang. |
| WF-02 · Thanh toán → hoa hồng → chi trả (FA26-218) | FE ban đầu chỉ tạo đơn trả tại Lab. `/admin/payments`, `/lab-owner/revenue`, `/lab-owner/settlements` dùng dữ liệu minh họa. API staging đã có thanh toán, công nợ và payout. | Dùng giao dịch VNPay sandbox trên tài khoản thử. Kiểm tra trạng thái bằng mã giao dịch/mã đơn sau khi quay lại, sau đó đối chiếu khoản hoa hồng, tổng nợ và khoản chi trả trên đúng Lab. Thử tình huống hủy hoặc callback đến trễ. |
| WF-03 · Phân máy → công suất → ETA (FA26-220) | `/lab-owner/machines` quản lý máy, thiết lập lịch và sự cố. Chi tiết đơn gọi GET `lab/orders/{id}/schedule-proposal` và POST `.../schedule-confirmation`. Có thao tác cập nhật công đoạn. Chưa tìm thấy UI trả lời đề xuất đổi lịch ở baseline. | Theo bộ dữ liệu ETA tại Report 5 §4.6 được Jira tham chiếu. So sánh ETA do server trả cho tải bình thường, quá tải và sự cố. Kiểm tra trạng thái hai vai trò sau xác nhận/đổi lịch. |
| WF-04 · Đăng ký Lab → duyệt → mở nhận đơn (FA26-221) | `/open-lab` gửi và tra hồ sơ; `/admin/labs` duyệt hoặc từ chối; chủ Lab có UI cập nhật hồ sơ, ảnh, giờ mở cửa, bảng giá, máy và bật nhận đơn. | Dùng một hồ sơ thử xuyên suốt. Kiểm tra mã tra cứu, chuyển trạng thái sau duyệt, gói hiển thị ở trang tìm Lab và khả năng tạo đơn cho đúng Lab. |
| WF-05 · Ký gửi → kiểm định → chào giá → bán → phân chia (FA26-222) | `/marketplace` đọc dữ liệu trong FE; `/lab-owner/consignments` dùng `demoConsignments` và cập nhật React state. Staging chưa công bố đường dẫn cho chuỗi nghiệp vụ ký gửi này. | Để nghiệm thu xuyên vai trò cần hợp đồng cho lịch hẹn, kiểm định, chào giá, bán và phân chia. Với bản hiện tại chỉ trình diễn được tương tác minh họa. |

## Đối chiếu các nhóm API

| Nhóm | Đã tìm thấy trong website ở commit trên | Phần còn thiếu hoặc cần phân biệt |
|---|---|---|
| Phiên và tài khoản | BFF cho đăng nhập/đăng ký/OTP, quên mật khẩu, làm mới và đăng xuất. `/api/auth/me` gọi GET `accounts/me`. Đổi mật khẩu gọi PUT `accounts/me/password`. Admin có POST `admin/accounts`. | Danh sách tài khoản Admin dùng `seedUsers`. Swagger còn có đọc/tìm/sửa/vô hiệu hóa tài khoản, gồm `accounts/search`, `accounts/{id}`, `accounts/{id}/deactivate`. |
| Danh mục và tìm Lab | `film-formats`, `film-processes`, `service-types`, `film-stocks`, `public/film-labs` và chi tiết Lab. `/admin/catalog` dùng endpoint danh mục để thêm, sửa, đổi trạng thái và xóa. | Tra địa chỉ xuôi/ngược trong Swagger là `delivery/geocoding/forward` và `delivery/geocoding/reverse`. Lọc Lab theo tọa độ trên website là một thao tác khác. |
| Hồ sơ Lab và cấu hình vận hành | `public/lab-applications` và tra bằng mã, `admin/lab-applications` và duyệt/từ chối; `film-labs/me`, ảnh, giờ mở cửa, mở nhận đơn, gói dịch vụ, máy, sự cố và thiết lập lịch. | Tài khoản nhận thanh toán tại `film-labs/me/payout-account` thuộc luồng tài chính; phần cấu hình hồ sơ Lab chưa đủ để nghiệm thu WF-02. |
| Đơn, scan, lưu trữ | `orders`, báo giá, hủy, xác nhận nhận hàng; `lab/orders`, chi tiết, nhận/từ chối, biên nhận, đề xuất và xác nhận lịch, công đoạn, scans, full-resolution-link, scan-delivery, film-return; `me/archive` và từng cuộn. | Chưa tìm thấy thao tác gọi `lab/orders/{id}/rolls/{rollId}/damage`, `orders/{id}/schedule-changes/{changeId}/answer`, `admin/orders/{id}/stages/revert` tại baseline. |
| Thanh toán VNPay | Trang xem dữ liệu minh họa; chọn trả tại Lab khi tạo đơn. | Swagger công bố POST `payments/vnpay/sandbox-url`; GET `payments/by-code/{transactionCode}`, `payments/by-order/{serviceOrderId}`, `payments/{id}`; các callback `payments/vnpay/return` và `payments/vnpay/ipn`. IPN phục vụ cổng thanh toán, không phải thao tác người dùng. |
| Hoa hồng, công nợ, payout | Trang doanh thu, đối soát và thanh toán ban đầu lấy số liệu mẫu. | `commissions/lab/{labId}`, `commission-debts/lab/{labId}`, `commission-debts/{id}`, báo cáo/xác nhận nợ, `film-labs/me/payouts`, `admin/payouts`, chi tiết và ghi nhận đã chi. Cần đối chiếu cùng mã Lab và số tiền. |
| AI, Admin | `/ai-support` POST `chatbot/questions`, GET lịch sử session; Admin có audit log, system parameters và reindex knowledge base. | Nút reindex dùng API riêng. Hàng đợi bài viết, khiếu nại, moderation và thanh toán trong Admin vẫn dùng fixtures. |
| Cộng đồng, Expert, Moderator, khách hàng Lab | Ứng tuyển Expert, bài viết, workshop và lượt đăng ký dùng demo-session; Moderator dùng dữ liệu minh họa; Lab Customers đọc fixture. | Swagger tại ngày rà soát chưa có nhóm nghiệp vụ cho feed, sự kiện, bài viết Expert, báo cáo cộng đồng hay danh sách khách hàng Lab. Kiểm thử đăng nhập thành công chưa xác minh được các nhóm này. |

## Phạm vi kiểm tra

Đã đọc JSON gốc của hợp đồng staging bằng trình duyệt và đối chiếu với route trang, component đang được render cùng các lời gọi BFF trong source. Các component đặt đơn mẫu còn tồn tại trong thư mục `service-booking`, nhưng route `/services` của Photographer dùng `PhotographerServices` và gọi API.

Để đối chiếu lại một ca kiểm thử, ghi vai trò, mã thử, trang, HTTP method/path, HTTP status, trạng thái nghiệp vụ trước/sau và kết quả sau tải lại. Ở ca đọc JSON này chưa có đơn hàng thử, giao dịch hay thay đổi dữ liệu staging. Bảng không dùng số endpoint hiện diện trong Swagger để suy ra tỷ lệ E2E thành công.


## Ma trận từng API

[Ma trận API staging](api-staging-matrix.csv) liệt kê đủ 119 cặp method/path theo hợp đồng đã đọc, đối chiếu với website sau các cập nhật trong đợt này. Cột màn hình xác định vị trí đối chiếu, kể cả khi thao tác tương ứng chưa được triển khai. Callback VNPay đi qua cổng thanh toán. Khi gọi API qua BFF, trình duyệt truy cập địa chỉ website, sau đó Next.js gửi request đến hostname staging.

Đã đăng nhập Photographer qua website và đối chiếu danh sách 5 Lab trả qua proxy với dữ liệu Azure. Các kết quả này không bao gồm tạo đơn hoặc xác nhận thanh toán.

## Cập nhật sau khi sửa website

- Năm vai trò đăng nhập được. Đã mở workspace Expert, Moderator và Admin. Danh sách đăng ký Lab có dữ liệu, trang chi trả Admin trả về danh sách trống.
- Qua website staging, Photographer tạo đơn #9, mã `SO261128A8TYCW`, một cuộn tại Sài Gòn Film Lab, giá 80.000 VND, trả tại Lab. Chủ Lab thấy đúng mã trong hàng đợi của mình.
- Qua trang JSON công khai của Azure và route proxy của website, đã đối chiếu chi tiết Đà Lạt Analog Lab #5 và bốn danh mục quy trình, khổ phim, dịch vụ và dòng phim. Cả hai phía đều trả dữ liệu.
- Website đã có lời gọi danh sách chi trả Lab/Admin, hoa hồng và công nợ Lab và lịch sử thanh toán theo đơn. Riêng báo cuộn hỏng đã kiểm tra cấu trúc multipart, giới hạn ảnh, nội dung ghi chú bằng hai ca cục bộ; chưa gửi một báo hỏng lên cuộn thật.
- WF-05 chỉ trình diễn prototype. OpenAPI chưa có hợp đồng cho lịch hẹn ký gửi, kiểm định, chào giá và bán hàng. Trường `consignmentSaleId` trong payout item chỉ tham chiếu giao dịch.


- Chủ Lab có thể từ chối đơn đang chờ xác nhận, nhập lý do 10–500 ký tự và xác nhận hủy. Ca này được đối chiếu với OpenAPI; chưa từ chối đơn trên staging.

- Quản trị viên tra cứu được một Photographer theo email; website hỗ trợ vô hiệu hóa tài khoản đã tìm thấy. Lab có biểu mẫu xem và cập nhật tài khoản nhận chi trả. Bảng CSV ghi riêng từng thao tác đã chạy.
- Sài Gòn Film Lab đọc được danh sách chi trả, kỳ nợ và hoa hồng. Các danh sách rỗng trên tài khoản thử. Lịch sử thanh toán của đơn trả tại Lab #9 cũng rỗng.
- Có thể chạy lại các phép kiểm tra đọc qua BFF bằng các tài khoản staging dành cho kiểm thử theo hướng dẫn đầu file [staging-read-smoke.mjs](../tests/staging-read-smoke.mjs). Các bài kiểm tra dữ liệu báo hỏng và xác nhận lịch chạy từ thư mục website bằng `node --test tests/roll-damage.test.mjs tests/schedule-confirmation.test.mjs`.

