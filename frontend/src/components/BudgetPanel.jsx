import { useEffect, useRef } from 'react'
import './BudgetPanel.css'

// Các mức ngân sách chọn nhanh (VND)
const PRESETS = [30000, 50000, 100000, 200000]

// 50000 -> "50.000đ"
function formatPrice(value) {
  return value.toLocaleString('vi-VN') + 'đ'
}

// 50000 -> "50k"
function formatShort(value) {
  return value / 1000 + 'k'
}

// Component "không giữ state": budget do FoodRollPage giữ,
// BudgetPanel chỉ hiển thị và báo ngược lên qua các hàm onXxx.
function BudgetPanel({ budget, onChange, onCancel, onConfirm }) {
  // useRef: "con trỏ" tới phần tử DOM thật, đổi giá trị không làm render lại
  const panelRef = useRef(null)
  const rangeRef = useRef(null)

  useEffect(() => {
    // Lúc panel vừa mở, focus đang ở nút đã mở nó -> nhớ lại
    const opener = document.activeElement
    rangeRef.current.focus()

    // Hàm cleanup: React gọi khi panel bị gỡ khỏi màn hình (đóng panel)
    return () => {
      // Chỉ trả focus nếu nút đó vẫn còn trên trang
      if (opener && opener.isConnected) {
        opener.focus()
      }
    }
  }, []) // [] = chỉ chạy 1 lần khi mở, cleanup 1 lần khi đóng

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      onCancel()
      return
    }

    if (event.key !== 'Tab') return

    // Focus trap: Tab ở phần tử cuối -> vòng về đầu, Shift+Tab ở đầu -> về cuối
    const focusables = Array.from(
      panelRef.current.querySelectorAll('input, button'),
    )
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    // -1 nếu focus đang ở lớp phủ (vd người dùng vừa click ra nền tối)
    const index = focusables.indexOf(document.activeElement)

    if (event.shiftKey && index <= 0) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && index === focusables.length - 1) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    // tabIndex={-1}: click vào nền tối thì focus vẫn nằm trong overlay,
    // nên phím Tab / Esc vẫn được handleKeyDown bắt
    <div className="budget-overlay" tabIndex={-1} onKeyDown={handleKeyDown}>
      <section
        ref={panelRef}
        className="budget-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-title"
      >
        <h2 id="budget-title" className="budget-panel__title">
          Ngân sách của bạn
        </h2>

        <p className="budget-panel__amount">{formatPrice(budget)}</p>

        <label className="budget-panel__label" htmlFor="budget-range">
          Kéo để chọn mức giá tối đa
        </label>
        <input
          ref={rangeRef}
          id="budget-range"
          className="budget-panel__range"
          type="range"
          min="20000"
          max="300000"
          step="5000"
          value={budget}
          // value của input luôn là string -> đổi sang number trước khi báo lên
          onChange={(event) => onChange(Number(event.target.value))}
        />

        <div className="budget-panel__presets">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={
                preset === budget
                  ? 'budget-panel__preset budget-panel__preset--active'
                  : 'budget-panel__preset'
              }
              aria-pressed={preset === budget}
              onClick={() => onChange(preset)}
            >
              {formatShort(preset)}
            </button>
          ))}
        </div>

        <div className="budget-panel__actions">
          <button
            type="button"
            className="budget-panel__button"
            onClick={onCancel}
          >
            Huỷ
          </button>
          <button
            type="button"
            className="budget-panel__button budget-panel__button--primary"
            onClick={onConfirm}
          >
            Gọi sao băng
          </button>
        </div>
      </section>
    </div>
  )
}

export default BudgetPanel
