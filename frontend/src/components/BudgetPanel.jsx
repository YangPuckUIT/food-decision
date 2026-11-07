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
  return (
    <div className="budget-overlay">
      <section
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
