# FilmLink Design System

Phiên bản 1.0 · 01/11/2026

Tài liệu này chốt ngôn ngữ giao diện nền tảng cho FilmLink: trẻ trung, rõ ràng, thân thiện với cộng đồng nhiếp ảnh phim và dễ dùng trên điện thoại lẫn máy tính. ChatGPT là nguồn tham khảo về giao diện tối giản và màu nhấn xanh; FilmLink vẫn giữ bản sắc riêng.

## 1. Nguyên tắc thiết kế

- Ưu tiên nội dung, hình ảnh phim và thao tác đặt/rửa phim; hạn chế trang trí gây xao nhãng.
- Dùng nền trung tính, chữ dễ đọc và màu xanh cho hành động quan trọng.
- Giữ một font sans-serif xuyên suốt; phân cấp bằng kích thước, độ đậm và khoảng cách.
- Duy trì quy tắc nhất quán giữa các trang và ở cả hai chế độ sáng/tối.
- Trên mobile, thao tác chính phải dễ chạm; trên desktop, bố cục tận dụng chiều rộng nhưng giữ dòng đọc vừa phải.

## 2. Màu sắc

Màu xanh lấy cảm hứng từ màu nhấn Blue trong ChatGPT và bảng màu công khai của OpenAI Apps SDK UI. Mã màu dưới đây là lựa chọn token cho FilmLink, không phải tuyên bố rằng toàn bộ giao diện ChatGPT dùng chính xác các mã này.

### Màu thương hiệu và tương tác

| Token | Light | Dark | Công dụng |
|---|---|---|---|
| `--brand` | `#0169CC` | `#339CFF` | Nút chính có chữ, liên kết quan trọng |
| `--brand-icon` | `#0285FF` | `#339CFF` | Nút tròn chỉ có biểu tượng, lấy cảm hứng từ nút trong ảnh tham khảo |
| `--brand-hover` | `#004F99` | `#66B5FF` | Hover/nhấn; chọn màu có tương phản phù hợp với chữ/icon |
| `--brand-soft` | `#E5F3FF` | `#102A40` | Nền vùng đang chọn, nhãn hoặc thông tin phụ |
| `--brand-foreground` | `#FFFFFF` | `#0D0D0D` | Chữ/icon trên nền `--brand` |
| `--focus-ring` | `#0285FF` | `#66B5FF` | Vòng focus bàn phím |

**Quy tắc dùng xanh:**

- Nút CTA có chữ dùng `--brand` với chữ trắng. Không dùng xanh sáng `#0285FF` làm nền cho chữ trắng cỡ nhỏ; dùng nó cho nút icon hoặc vòng focus.
- Nút icon tròn có thể dùng nền `--brand-icon`, biểu tượng trắng và hình tròn hoàn toàn.
- Dùng xanh nhạt cho nền lựa chọn; không tô xanh mọi liên kết, icon và thành phần trên cùng một màn hình.
- Trạng thái tương tác phải có thêm dấu hiệu ngoài màu khi cần (nhãn, icon, viền hoặc văn bản trạng thái).

### Màu trung tính

| Token | Light | Dark | Công dụng |
|---|---|---|---|
| `--background` | `#FFFFFF` | `#0D0D0D` | Nền trang |
| `--surface` | `#FFFFFF` | `#181818` | Thẻ, hộp thoại, vùng nhập |
| `--surface-muted` | `#F9F9F9` | `#212121` | Nền phụ, khu vực phân nhóm |
| `--surface-hover` | `#F3F3F3` | `#282828` | Hover trên hàng/nút trung tính |
| `--text-primary` | `#0D0D0D` | `#FFFFFF` | Tiêu đề và nội dung chính |
| `--text-secondary` | `#5D5D5D` | `#CDCDCD` | Mô tả và nội dung phụ |
| `--text-muted` | `#767676` | `#9F9F9F` | Chú thích; không dùng cho chữ nhỏ trên nền thiếu tương phản |
| `--border` | `#E5E5E5` | `#414141` | Viền thẻ, trường nhập và đường phân cách |
| `--border-strong` | `#CDCDCD` | `#5D5D5D` | Viền cần nhấn rõ hơn |

### Màu trạng thái

| Trạng thái | Nền sáng | Chữ/icon sáng | Nền tối | Chữ/icon tối |
|---|---|---|---|---|
| Thành công | `#EDFAF2` | `#00692A` | `#003716` | `#8CDFAD` |
| Cảnh báo | `#FFF6D9` | `#6E5400` | `#4D3B00` | `#FFDB66` |
| Lỗi | `#FFF0F0` | `#911E1B` | `#4D100E` | `#FFA4A2` |
| Thông tin | `#E5F3FF` | `#003F7A` | `#00284D` | `#99CEFF` |

Mỗi trạng thái cần có biểu tượng hoặc nhãn đi kèm; không truyền đạt thành công, cảnh báo hay lỗi chỉ bằng màu.

## 3. Chế độ sáng/tối

- Mặc định là **Light** với nền trắng.
- Có nút đổi giao diện sáng/tối dành cho người dùng; thể hiện trạng thái hiện tại và dùng nhãn trợ năng, ví dụ “Bật giao diện tối”.
- Lưu lựa chọn của người dùng để giữ lại giữa các lần truy cập. Nếu chưa có lựa chọn đã lưu, bắt đầu ở Light.
- Cập nhật token theo chế độ; không đảo màu toàn trang bằng bộ lọc.
- Biểu tượng chuyển đổi là mặt trời/mặt trăng; nút icon-only phải có tên truy cập cho screen reader.

## 4. Typography

### Font

- Font giao diện: **Geist Sans**, đang được cấu hình trong `src/app/layout.tsx`.
- Font dự phòng: `Arial, sans-serif` và sans-serif mặc định của hệ điều hành.
- Dùng cùng font cho tiêu đề, nội dung, biểu mẫu và nút. Tiêu đề lớn hơn và đậm hơn, không chuyển sang một họ font khác.
- Font mã (nếu có): Geist Mono.
- Viết câu theo sentence case; chỉ viết hoa tên riêng, chữ viết tắt và nội dung cần thiết. Giữ nguyên dấu tiếng Việt.

### Thang chữ

Các giá trị dựa trên thang chữ công khai của OpenAI Apps SDK UI, được rút gọn cho nhu cầu FilmLink.

| Vai trò | Kích thước / chiều cao dòng | Độ đậm | Dùng cho |
|---|---:|---:|---|
| Tiêu đề trang | `32 / 38 px` | 600 | Tiêu đề chính ở trang rộng; giảm còn 28 px trên mobile nếu cần |
| Tiêu đề phần | `24 / 28 px` | 600 | Đầu mục lớn |
| Tiêu đề nhóm | `20 / 26 px` | 600 | Nhóm nội dung, tiêu đề hộp thoại |
| Tiêu đề thẻ | `18 / 26 px` | 600 | Tên phim, tên dịch vụ hoặc tiêu đề thẻ |
| Nội dung chính | `16 / 24 px` | 400 | Nội dung đọc thường xuyên và biểu mẫu |
| Nội dung phụ | `14 / 20 px` | 400–500 | Mô tả ngắn, nhãn, metadata |
| Chú thích | `12 / 18 px` | 400 | Thời gian, ghi chú phụ; không dùng cho nội dung thiết yếu |

Không tự đặt kích thước tùy ý ngoài thang này nếu chưa có lý do giao diện cụ thể. Dùng weight 500 cho nhãn cần nhấn nhẹ, 600 cho tiêu đề và 700 chỉ khi thực sự cần nhấn mạnh.

## 5. Bo góc, viền và đổ bóng

| Token | Giá trị | Áp dụng |
|---|---:|---|
| `--radius-sm` | `6 px` | Badge, thành phần nhỏ |
| `--radius-control` | `10 px` | Nút, ô nhập, select |
| `--radius-card` | `14 px` | Thẻ, khung nội dung |
| `--radius-dialog` | `16 px` | Dialog, sheet lớn |
| `--radius-pill` | `9999 px` | Chip, avatar, nút dạng viên |
| `--border-width` | `1 px` | Viền mặc định |

- Nút tròn icon-only có kích thước vuông và `border-radius: 50%`.
- Viền mặc định dùng `--border`; dành viền rõ cho focus, lựa chọn hoặc lỗi.
- Ưu tiên phân tách bằng khoảng trắng và màu nền bề mặt; dùng bóng nhẹ cho dialog/popover, không thêm bóng cho mọi thẻ.

## 6. Nút và điều khiển

| Thành phần | Desktop | Mobile | Ghi chú |
|---|---:|---:|---|
| Nút thường | Cao tối thiểu `40 px` | Cao tối thiểu `44 px` | Padding ngang 16 px, radius 10 px |
| Trường nhập | Cao tối thiểu `40 px` | Cao tối thiểu `44 px` | Chữ 16 px, viền 1 px |
| Nút icon | `40 × 40 px` | `44 × 44 px` | Có tooltip hoặc accessible label |
| Nút tròn tham chiếu | `40 × 40 px` | `44 × 44 px` | Icon trắng, nền xanh, tròn hoàn toàn |

### Trạng thái tương tác

- **Default:** màu token gốc, viền và chữ có tương phản rõ.
- **Hover:** đổi sang token hover; có thể thêm chuyển tiếp màu ngắn.
- **Active/pressed:** tối hơn hoặc có thay đổi độ nổi nhẹ, nhưng không làm dịch chuyển bố cục.
- **Focus-visible:** vòng focus 2 px, cách phần tử 2 px, dùng `--focus-ring`; luôn nhìn thấy khi điều hướng bằng bàn phím.
- **Disabled:** giảm độ nổi, không chỉ giảm opacity đến mức khó đọc; ngăn thao tác và giữ nhãn rõ.
- **Loading:** giữ nguyên kích thước nút, hiển thị spinner và thông báo trạng thái phù hợp.
- Trên mobile, không dùng hover làm cách duy nhất để tiết lộ thông tin hoặc thao tác.

## 7. Responsive và bố cục

- Mobile-first; đảm bảo nội dung quan trọng và hành động đặt/rửa phim dùng được ở chiều rộng nhỏ.
- Điểm chuyển bố cục tham khảo: `640 px` (mobile lớn), `768 px` (tablet), `1024 px` (desktop). Chỉ đổi bố cục khi nội dung cần, không chỉ vì thiết bị.
- Mobile: một cột, lề trang khoảng 16 px, nút chính có thể rộng toàn hàng.
- Tablet: tăng khoảng cách và dùng hai cột khi nội dung phù hợp.
- Desktop: giới hạn độ rộng vùng đọc; danh sách/kết quả có thể dùng nhiều cột hơn.
- Dùng ảnh phim với tỷ lệ cố định hoặc `object-fit` phù hợp để không làm méo ảnh.
- Kiểm tra nội dung dài, tên cửa hàng/phim và dấu tiếng Việt ở mọi cỡ màn hình.

## 8. Khả năng truy cập

- Đảm bảo tương phản tối thiểu WCAG AA: `4.5:1` cho chữ thường, `3:1` cho chữ lớn và thành phần đồ họa thiết yếu.
- Kiểm tra riêng chữ trắng trên nền xanh cho mỗi trạng thái; nếu không đủ tương phản thì dùng sắc xanh đậm hơn.
- Không biểu đạt trạng thái chỉ bằng màu; bổ sung nhãn, icon hoặc thông báo văn bản.
- Hỗ trợ focus bàn phím, tên truy cập cho nút icon-only, nhãn cho trường nhập và phóng to chữ mà không vỡ bố cục.
- Tôn trọng thiết lập giảm chuyển động của hệ điều hành.

## 9. Ví dụ áp dụng

- **Nút đặt dịch vụ:** nền `--brand`, chữ trắng, cao ít nhất 44 px trên mobile, radius 10 px.
- **Nút trợ lý AI dạng biểu tượng:** nền `--brand-icon`, biểu tượng trắng, tròn; có tên truy cập mô tả hành động AI.
- **Thẻ dịch vụ rửa phim:** nền `--surface`, viền `--border`, radius 14 px; tiêu đề 18/26 px, thông tin phụ 14/20 px.
- **Thông báo đặt thành công:** nền success nhạt, icon và chữ success đậm, kèm nội dung xác nhận bằng chữ.
- **Thanh điều khiển giao diện:** nút mặt trời/mặt trăng chuyển Light/Dark; lựa chọn lưu lại.

## 10. Nguồn tham khảo

- OpenAI Help Center, [Updating your visual experience on ChatGPT](https://help.openai.com/en/articles/11958281-updating-your-visual-experience-on-chatgpt) — chế độ sáng/tối, màu nhấn và khả năng thay đổi theo nền tảng.
- OpenAI, [Apps SDK UI](https://github.com/openai/apps-sdk-ui) — thư viện và token giao diện công khai.
- OpenAI Apps SDK UI, [bảng màu primitive](https://github.com/openai/apps-sdk-ui/blob/main/src/styles/variables-primitive.css) — các sắc xanh, xám và màu trạng thái.
- OpenAI Apps SDK UI, [thang typography](https://github.com/openai/apps-sdk-ui/blob/main/src/Typography.mdx) — kích thước, độ đậm và chiều cao dòng.
- OpenAI Developers, [UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines) — nguyên tắc màu, chữ, bố cục và khả năng truy cập.

## 11. Ánh xạ vào mã nguồn

- `src/app/globals.css`: token màu sáng/tối, font, bán kính bo góc và biến tương thích với Tailwind/shadcn.
- `src/app/layout.tsx`: font Geist, metadata, ngôn ngữ tiếng Việt và khởi tạo theme đã lưu.
- `src/components/theme-toggle.tsx`: nút đổi Light/Dark; lựa chọn được lưu dưới khóa `filmlink-theme`.
- `src/components/ui/button.tsx`, `input.tsx`, `textarea.tsx`: kích thước điều khiển và trạng thái focus.
- `src/app/login/page.tsx` và `src/components/login-form.tsx`: block shadcn `login-01`; `src/app/register/page.tsx` và `src/components/register-form.tsx`: block `signup-01`. Hai form dùng màu primary neutral gốc của shadcn; các trang khác tiếp tục dùng màu thương hiệu FilmLink.
- Các trường nhập trong form xác thực có trạng thái focus viền/vòng xám để khớp hành vi tham chiếu; ô không focus giữ viền mặc định.
- `components.json`: tiếp tục dùng `baseColor: neutral` cho nền trung tính khi sinh thêm component; màu FilmLink được ánh xạ qua token CSS thay vì đổi nền sinh component sang màu xanh.

