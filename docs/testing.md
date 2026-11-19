# Kiểm tra project

## Kiểm tra nhanh

Chạy từ repo root:

```powershell
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run build
npm.cmd --prefix backend test
```

Backend test chạy offline, không cần `.env` hay kết nối MongoDB. Không chạy seed
hoặc migrate để kiểm tra giao diện. Muốn thử Postman, dùng
`npm.cmd --prefix backend run test:fixture` và collection trong `backend/postman/`.

## Browser QA

Mở frontend ở một terminal:

```powershell
npm.cmd --prefix frontend run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Các harness sử dụng Playwright/Chromium đã cài sẵn, chặn HTTP API và trả dữ liệu
cục bộ trong browser. Không cần bật backend thật. Nếu module/browser ở ngoài
Node resolution, đặt đường dẫn trên máy của bạn trong terminal thứ hai:

```powershell
$env:UI_PLAYWRIGHT_PATH = 'C:\path\to\node_modules\playwright-core'
$env:UI_BROWSER_EXECUTABLE = 'C:\path\to\chrome.exe'
node frontend/tools/check-ui.cjs
node frontend/tools/check-roll-animation.cjs
node frontend/tools/check-restoration.cjs
```

| Harness | Phạm vi |
| --- | --- |
| `check-ui.cjs` | Điều hướng, form, payload, lỗi/thử lại, focus, layout 320/375/390/768/820/1024/1440px, tên dài và chữ phóng lớn |
| `check-roll-animation.cjs` | Food Roll, Skip, request chậm, đóng/mở, lỗi và reduced motion |
| `check-restoration.cjs` | URL, reload, Back/Forward, session storage, timeout và khôi phục kết quả |

`UI_PREVIEW_URL` đổi URL preview. `UI_QA_OUTPUT` đổi thư mục kết quả của UI harness;
mặc định báo cáo/ảnh nằm trong thư mục tạm của hệ điều hành. Hai harness còn lại
lưu kết quả trong thư mục tạm riêng, xem biến `out` trong từng file.
Không đưa file sinh tự động vào cây source. Ảnh và JSON trong `docs/archive/`
là chứng cứ lịch sử được giữ lại, không phải kết quả của lần chạy mới.

Kiểm tra thủ công thêm trên thiết bị thật: tên món dài, giá lớn, bàn phím mở,
dialog trên màn hình thấp, font không tải được, độ tương phản và screen reader.
Browser giả lập không xác minh catalog MongoDB thật hoặc hosting production.

## Lần kiểm tra ngày 19/11/2026

- Frontend lint và production build: đạt.
- Backend offline: 51 kiểm tra HTTP/service và 17 trường hợp schema đạt.
- Browser: 130 kiểm tra UI, 34 kiểm tra Food Roll và 24 kiểm tra khôi phục phiên đạt;
  không có lỗi JavaScript trong cả ba harness.
- Layout kiểm tra ở 320, 375, 390, 768, 820, 1024 và 1440px: không cuộn ngang,
  nhãn bản đồ không chồng lấn hoặc ra ngoài khung, dialog không tràn ngang.
- Toàn bộ liên kết tài liệu tới file cục bộ tồn tại; 16 ảnh QA lịch sử được giữ
  nguyên byte khi chuyển sang `archive/`.
- Sau lượt rà bổ sung: link logo có URL trang chủ hợp lệ; đã kiểm tra bằng phím
  Tab rằng cả bốn nút bản đồ có viền focus rõ ở 320/390/768/1024/1440px.

Các số liệu trên dùng HTTP giả lập và Chromium cục bộ, không kết nối MongoDB thật.

### Bộ gate thiết kế landing page

`GATE: FAIL 26 (round 1 of 3)` là kết quả của bộ rà `design-taste-frontend`
trên bản build. Không có waiver. Sáu phát hiện về hash logo và viền focus đã
được sửa, build/lint lại và xác minh riêng bằng bàn phím như ghi ở trên.

Các phát hiện còn lại thuộc bộ tiêu chí website quảng bá: `hero-fill`, `flush`,
`nav` (wordmark hai dòng), `cta`, `copy-headline`, `copy-fact`, `moment-none`,
`hero-screen`, `section-height`, `one-section`, `container-edges`, `container`.
App hiện có tiêu đề, bản đồ và navigation thao tác trực tiếp, không dùng hero
toàn màn hình, section quảng bá hay lớp `.wrap` của skill. Không chuyển app
sang bố cục landing page để thỏa các tiêu chí này. Gate tổng thể chưa đạt;
kiểm tra layout và chức năng của app được xác minh bằng các harness bên trên.

Các cảnh báo của gate được giữ lại: `copy-buttons`, `copy-actions`, `skip-link`,
`share-meta`, `nav`. Copy tiếng Việt và navigation của app được giữ nguyên;
skip link đã qua kiểm tra bàn phím, metadata chia sẻ chưa nằm trong lần chỉnh này.
Không thêm ảnh stock, dữ kiện giả định hay form/địa chỉ liên hệ.
