import { useState } from 'react'
import Dialog from './Dialog'
import Icon from './Icon'
import { formatPrice } from '../foodPresentation'
import './BudgetPanel.css'

const PRESETS = [30000, 50000, 100000, 200000]

export default function BudgetPanel({ budget, onChange, onCancel, onConfirm }) {
  const [draft, setDraft] = useState(String(budget))
  const numeric = Number(draft)
  const valid = Number.isInteger(numeric) && numeric >= 20000 && numeric <= 300000
  return <Dialog title="Ngân sách của bạn" titleId="budget-title" onClose={onCancel} className="budget-panel">
    <form onSubmit={event => { event.preventDefault(); if (valid) { onChange(numeric); onConfirm(numeric) } }}>
      <p className="budget-panel__amount">{draft && Number.isFinite(numeric) ? formatPrice(numeric) : 'Nhập số tiền'}</p>
      <label className="field" htmlFor="budget-number">Mức chi tối đa (đ)<input autoFocus id="budget-number" type="number" min="20000" max="300000" step="1" required value={draft} onChange={event => setDraft(event.target.value)} aria-describedby="budget-hint" /></label>
      <p id="budget-hint" className="field-hint">Từ 20.000đ đến 300.000đ cho một người.</p>
      <label className="budget-panel__range-label" htmlFor="budget-range">Kéo để chọn nhanh</label>
      <input id="budget-range" className="budget-panel__range" type="range" min="20000" max="300000" step="5000" value={valid ? numeric : 20000} onChange={event => setDraft(event.target.value)} />
      <div className="budget-panel__range-labels" aria-hidden="true"><span>20.000đ</span><span>300.000đ</span></div>
      <div className="budget-panel__presets" aria-label="Mức ngân sách chọn nhanh">{PRESETS.map(value => <button type="button" key={value} aria-pressed={numeric === value} onClick={() => setDraft(String(value))}>{value / 1000}k</button>)}</div>
      <div className="budget-panel__actions"><button type="button" className="button button--secondary" onClick={onCancel}>Huỷ</button><button type="submit" className="button button--primary"><Icon name="star" />Gọi sao băng</button></div>
    </form>
  </Dialog>
}
