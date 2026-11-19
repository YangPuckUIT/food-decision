# Thiết kế frontend

Giao diện chọn món tiếng Việt với phong cách vương quốc truyện cổ: nền giấy ấm,
chữ mực tối, điểm nhấn xanh rừng và banner đêm. Bản đồ SVG là lối vào bốn chế độ;
các màn hình thao tác ưu tiên form và kết quả món ăn dễ đọc.

## Nguồn dùng trong app

| File | Vai trò |
| --- | --- |
| [tokens.css](../frontend/src/styles/tokens.css) | Màu, font, spacing, radius, shadow và thời lượng tương tác |
| [index.css](../frontend/src/index.css) | Reset, typography, input, button, dialog và trạng thái chung |
| [shell.css](../frontend/src/styles/shell.css) | Header, navigation, footer, grid và form chung |
| [theme.css](../frontend/src/styles/theme.css) | Banner theo chế độ, màu nhấn, skeleton và thông báo khôi phục |
| `src/pages/*.css`, `src/components/*.css` | Bố cục riêng của trang/component |

CSS theo trang được import cùng component. Tokens nằm trong frontend
để build giao diện không phụ thuộc thư mục tài liệu.

## Typography và responsive

- Body 16px, line-height 1.6; Be Vietnam Pro cho nội dung và Cormorant Garamond
  cho heading. Font hệ thống vẫn dùng được khi Google Fonts không tải được.
- Tiêu đề trang co theo viewport, khoảng 32–48px; trang chủ khoảng 35–58px.
- Grid/form cho phép nội dung co lại bằng `minmax(0, 1fr)` và `min-width: 0`.
  Tên món dài được xuống dòng, không giấu lỗi bằng cách cắt toàn bộ trang.
- Dưới 1200px: nhãn bản đồ chuyển thành danh sách riêng để không che nhau;
  tablet dùng hai cột, điện thoại một cột. Dưới 768px: navigation năm cột.
- Dưới 480px: form và kết quả gợi ý dùng một cột, nút dialog ngân sách xếp dọc.
- Dialog giới hạn theo viewport và cuộn bên trong; nút đóng giữ kích thước 44px.

## Tương tác và dữ liệu

Giữ focus bàn phím, skip link, dialog native, focus trở lại nút mở và chế độ
reduced motion. Food Roll dùng `motion/react`; kết quả lấy từ API qua
`src/api/foods.js`. Không đưa mock catalog vào bundle production.

Ảnh dùng `imageUrl` của API. Khi thiếu hoặc lỗi ảnh, dùng fallback SVG.

Kế hoạch, số liệu và ảnh trước đây nằm trong [lịch sử frontend](archive/frontend-history.md).
Hướng dẫn xác minh hiện tại nằm trong [kiểm tra](testing.md).
