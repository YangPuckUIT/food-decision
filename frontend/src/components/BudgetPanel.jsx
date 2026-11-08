import { useEffect, useRef } from 'react'
import './BudgetPanel.css'

// Giới hạn slider và các mức chọn nhanh (VND)
const BUDGET_MIN = 20000
const BUDGET_MAX = 300000
const BUDGET_STEP = 5000
const PRESETS = [30000, 50000, 100000, 200000]

// 50000 -> "50,000₫"
function formatPrice(value) {
  return value.toLocaleString('en-US') + '₫'
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
        className="budget-panel wob"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-title"
      >
        <h2 id="budget-title" className="budget-panel__title">
          Your budget
        </h2>

        <p className="budget-panel__amount">{formatPrice(budget)}</p>

        <label className="budget-panel__label" htmlFor="budget-range">
          Drag to set your max price ({formatPrice(BUDGET_MIN)} –{' '}
          {formatPrice(BUDGET_MAX)})
        </label>
        <input
          ref={rangeRef}
          id="budget-range"
          className="budget-panel__range"
          type="range"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
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
                  ? 'budget-panel__preset budget-panel__preset--active wob2'
                  : 'budget-panel__preset wob2'
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
            className="budget-panel__button budget-panel__button--secondary wob2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="budget-panel__button budget-panel__button--primary wob"
            onClick={onConfirm}
          >
            Call a shooting star
          </button>
        </div>
      </section>
    </div>
  )
}

export default BudgetPanel
