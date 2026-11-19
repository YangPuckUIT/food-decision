# Food Decision — Vương quốc Ăn Gì

Ứng dụng chọn món theo ngân sách, khẩu vị hoặc điều kiện chung của nhóm.
Frontend dùng React/Vite; backend dùng Express/MongoDB.

## Cấu trúc

```text
food-decision/
├── frontend/           # Giao diện và công cụ kiểm tra browser
│   ├── src/components/ # Component dùng chung
│   ├── src/pages/      # Bản đồ, Food Roll, Gợi ý, Nhóm, Khám phá
│   ├── src/styles/     # Design tokens dùng thật trong app
│   ├── src/state/      # URL và lưu trạng thái phiên
│   └── tools/          # Kiểm tra UI, animation, khôi phục trạng thái
├── backend/
│   ├── src/            # API, nghiệp vụ, model và dữ liệu cục bộ
│   ├── test/           # Kiểm tra API và nghiệp vụ offline
│   ├── scripts/        # Công cụ seed/migrate dùng cho quản trị
│   ├── tools/          # API fixture để kiểm tra offline
│   └── postman/        # Collection và môi trường offline
└── docs/               # Tài liệu hiện tại; archive/ lưu lịch sử và ảnh QA cũ
```

## Chạy cục bộ

Dùng Node.js 22.12+ hoặc 24. Mở hai terminal từ thư mục repo.

Terminal 1 — API fixture offline, không cần MongoDB:

```powershell
cd backend
npm.cmd ci --ignore-scripts
npm.cmd run test:fixture
```

Terminal 2 — frontend:

```powershell
cd frontend
npm.cmd ci
$env:VITE_API_BASE_URL = 'http://127.0.0.1:3001'
npm.cmd run dev
```

Mở http://localhost:5173. Cấu hình trên gọi fixture ở port 3001, phục vụ
dữ liệu mẫu cục bộ để thử giao diện, không phải catalog thật.

Để dùng API thật, cấu hình theo [hướng dẫn triển khai](docs/deployment.md)
và chạy `npm.cmd run dev` trong `backend/` thay cho fixture. API thật kết nối MongoDB.
Catalog hiện có đã được provision; không cần seed/migrate để chạy hoặc kiểm tra app.
Trong terminal frontend, chạy `Remove-Item Env:VITE_API_BASE_URL -ErrorAction SilentlyContinue`
trước khi khởi động lại Vite để dùng proxy mặc định tới API thật ở port 3000.

## Kiểm tra

```powershell
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run build
npm.cmd --prefix backend test
```

Xem [kiểm tra browser](docs/testing.md) để kiểm tra layout, dialog, Food Roll,
URL và khôi phục phiên bằng HTTP giả lập, không cần backend thật.

## Tài liệu

| Nội dung | Tài liệu |
| --- | --- |
| Endpoint, request/response và Postman | [API](docs/api.md) |
| Biến môi trường và hosting | [Triển khai](docs/deployment.md) |
| Giao diện, tokens và quy tắc responsive | [Thiết kế](docs/design.md) |
| Lint, build, offline test và browser QA | [Kiểm tra](docs/testing.md) |
| Quy ước commit frontend | [Đóng góp](docs/contributing.md) |
| Báo cáo và ảnh của các đợt thiết kế trước | [Lịch sử frontend](docs/archive/frontend-history.md) |

URL lưu chế độ, bộ lọc Khám phá và ID món. Session storage lưu bản nháp và kết quả
hợp lệ trong 24 giờ; refresh không phát lại request chọn món. Nhóm dùng chung một
thiết bị, chưa có phòng realtime hay bỏ phiếu. Ảnh món thiếu sẽ dùng hình thay thế SVG.

Không commit `.env`, dependency, build output hoặc ảnh/báo cáo QA mới sinh.
Giữ hai lockfile riêng cho hai ứng dụng có thể cài đặt và triển khai độc lập.
