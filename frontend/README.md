# Frontend

React/Vite cho Vương quốc Ăn Gì: bản đồ, Food Roll, Gợi ý, Nhóm và Khám phá món.

Từ thư mục này:

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

Dùng Node.js 22.12+ hoặc 24. Vite proxy `/api` đến port 3000.
Chạy backend fixture offline hoặc cấu hình API thật theo [README gốc](../README.md).
Khi host riêng, đặt `VITE_API_BASE_URL` thành origin của backend.

- [Thiết kế và cấu trúc CSS](../docs/design.md)
- [Kiểm tra browser và cấu hình Playwright](../docs/testing.md)
- [Quy ước commit](../docs/contributing.md)
- [API contract](../docs/api.md)
