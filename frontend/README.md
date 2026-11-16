# Food Decision frontend

Giao diện React/Vite cho Vương quốc Ăn Gì. Gồm bản đồ chọn chế độ, Food Roll,
Khám phá và chi tiết món, Gợi ý theo khẩu vị, Quyết định nhóm.

## Chạy và kiểm tra

Dùng Node.js 22.12+ hoặc 24. Từ `frontend/`:

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

Vite proxy `/api` tới backend đã cấu hình ở port 3000. Khi host riêng, dùng biến
cấu hình hiện có VITE_API_BASE_URL. Không commit .env và không chạy seed/migrate
để kiểm tra giao diện. API adapter `src/api/foods.js` giữ nguyên contract hiện tại.

## Thiết kế và browser QA

- [Design system](../design-system/food-decision/MASTER.md) và
  [CSS tokens](../design-system/food-decision/tokens.css).
- [Báo cáo QA và ảnh chụp](../design-system/food-decision/QA.md).
- `tools/check-ui.cjs` chạy kiểm tra giao diện với Playwright/Chromium đã có sẵn
  và HTTP giả lập trong browser, không cần backend thật hoặc Atlas. Không cài thêm
  dependency kiểm thử vào website; xem hướng dẫn cấu hình trong báo cáo QA.
- Font ngoài có fallback hệ thống. Ảnh chỉ lấy từ imageUrl của API; chưa có ảnh
  thì hiện fallback SVG. Không tạo dữ liệu món hay ảnh món giả trong ứng dụng.

## Quy ước Git — Frontend

> Áp dụng cho code trong `frontend/`. Backend có quy ước riêng.

### Commit message — Conventional Commits

```
<type>(fe/<feature>): <mô tả ngắn>

<body — tuỳ chọn: giải thích vì sao>

<footer — tuỳ chọn: Refs>
```

**Mô tả ngắn:** tiếng Anh, viết thường, dạng mệnh lệnh (`add`, không phải `added`), không có dấu chấm cuối, tối đa khoảng 72 ký tự.

Scope luôn bắt đầu bằng `fe/` để phân biệt với commit của backend trong lịch sử chung của repo.

#### Type

| Type       | Ý nghĩa                | Khi nào dùng                                               |
| ---------- | ---------------------- | ---------------------------------------------------------- |
| `feat`     | Feature                | Thêm chức năng mới                                         |
| `fix`      | Bug Fix                | Sửa lỗi trong code                                         |
| `docs`     | Documentation          | Thêm hoặc sửa tài liệu, README                             |
| `style`    | Code Style             | Chỉnh format, khoảng trắng, dấu chấm phẩy; không đổi logic |
| `refactor` | Refactoring            | Cải thiện cấu trúc code, không đổi hành vi                 |
| `perf`     | Performance            | Tối ưu hiệu suất                                           |
| `test`     | Testing                | Thêm, sửa hoặc cải thiện test                              |
| `build`    | Build System           | Đổi dependency hoặc cấu hình build                         |
| `ci`       | Continuous Integration | Đổi GitHub Actions, CI/CD                                  |
| `chore`    | Maintenance            | Bảo trì, cấu hình phụ                                      |
| `revert`   | Revert                 | Hoàn tác một commit trước đó                               |

#### Feature

| Feature     | Phần code                                |
| ----------- | ---------------------------------------- |
| `gacha`     | Food Roll — Tháp Sao Băng                |
| `recommend` | Recommendation — Lều Tiên Tri            |
| `group`     | Group Decision — Quán Bàn Tròn           |
| `codex`     | Explore + Food Detail — Thư Viện Codex   |
| `map`       | Trang chủ bản đồ                         |
| `ui`        | Component dùng chung: FoodCard, Loading… |
| `assets`    | Ảnh, art, font                           |

Việc chung cho cả frontend (cài thư viện, cấu hình Vite) thì chỉ ghi `fe`, ví dụ `build(fe): add axios dependency`.

#### Ví dụ

```
feat(fe/ui): add FoodCard component
feat(fe/gacha): show empty state when no food fits budget
fix(fe/gacha): update budget label on slider change
feat(fe/map): zoom to building on click
chore(fe/assets): add meteor and burst sprites
build(fe): add axios dependency
docs(fe): add setup steps to README
```

### Cách commit

- **Chỉ đưa folder `frontend/` vào commit:**

```bash
  git status
  git add frontend/
  git commit -m "feat(fe/gacha): add budget slider"
```

Không dùng `git add .` khi folder `backend/` cũng đang có thay đổi.

- **Mỗi commit làm một việc.** Sửa lỗi và thêm tính năng thì tách thành 2 commit.
- **Ghi mã task ở footer** nếu có, để dễ tra khi viết report: `Refs: T-008`.
- **Tên branch:** `<type>/fe-<việc>`, ví dụ `feat/fe-food-card`, `fix/fe-slider`.
- **Không commit** `.env`, `node_modules/`, `dist/`.

### Thống nhất với Backend

1. Không commit lẫn `frontend/` và `backend/` trong cùng một commit.
2. Backend đổi format JSON của API → báo Frontend trước khi merge. Frontend sửa theo bằng một commit riêng, ví dụ `fix(fe/gacha): adapt to new gacha response`.
