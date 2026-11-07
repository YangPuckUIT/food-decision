# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

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
