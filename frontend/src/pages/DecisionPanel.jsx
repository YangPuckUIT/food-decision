import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import FoodCard from '../components/FoodCard'
import Icon from '../components/Icon'
import Landmark from '../components/Landmark'
import StatusPanel from '../components/StatusPanel'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { getRecommendations, getGroupDecision } from '../api/foods'
import { categories, formatPrice, reasons, ready, toggle } from '../foodPresentation'
import useSessionState from '../hooks/useSessionState'
import { budgetDraft, categoryList, ids, optionalFood, snapshotValid, text, readSession } from '../state/session'
import './DecisionPanel.css'

function CategoryChoices({ title, value, onChange }) {
  return <fieldset className="category-choices"><legend>{title}</legend><div className="choice-row">{categories.map(([key, label]) => <label key={key}><input type="checkbox" checked={value.includes(key)} onChange={() => onChange(toggle(value, key))} /><span>{label}</span></label>)}</div></fieldset>
}

function Budget({ value, onChange }) {
  return <div className="field"><label htmlFor="decision-budget">Ngân sách mỗi người (đ)</label><input id="decision-budget" type="number" min="20000" max="300000" step="1" required value={value} onChange={event => onChange(event.target.value)} aria-describedby="decision-budget-hint" /><span id="decision-budget-hint" className="field-hint">Từ 20.000đ đến 300.000đ.</span></div>
}

export default function DecisionPanel({ foods, mode }) {
  const reduced = useReducedMotion()
  const [budget, setBudget] = useSessionState(`${mode}:budget`, 50000, budgetDraft)
  const [preferred, setPreferred] = useSessionState(`${mode}:preferred`, [], categoryList)
  const [spicy, setSpicy] = useSessionState(`${mode}:spicy`, 0, value => [0, 1, 2].includes(value))
  const [fullness, setFullness] = useSessionState(`${mode}:fullness`, 2, value => [1, 2, 3].includes(value))
  const [selected, setSelected] = useSessionState(`${mode}:selected`, [], ids)
  const [noSpicy, setNoSpicy] = useSessionState(`${mode}:noSpicy`, false, value => typeof value === 'boolean')
  const [avoided, setAvoided] = useSessionState(`${mode}:avoided`, [], categoryList)
  const [query, setQuery] = useSessionState(`${mode}:query`, '', text)
  const [snapshot, setSnapshot] = useSessionState(`${mode}:result`, null, snapshotValid(mode))
  const [winner, setWinner] = useSessionState(`${mode}:winner`, null, optionalFood)
  const [restored, setRestored] = useState(() => Boolean(readSession(`${mode}:result`, null, snapshotValid(mode))))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  const active = useRef(true)
  const request = useRef(null)
  useEffect(() => { active.current = true; return () => { active.current = false; request.current?.abort() } }, [])
  const oracle = mode === 'oracle'
  const candidates = foods.filter(ready)
  const visible = candidates.filter(food => food.name.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')))

  const validSelected = selected.filter(id => candidates.some(food => food._id === id))
  const input = oracle ? { budget: Number(budget), categories: preferred, spicy, fullness } : { foodIds: validSelected, budget: Number(budget), noSpicy, avoidCategories: avoided }
  const inputKey = JSON.stringify(input)
  const result = snapshot?.input === inputKey ? snapshot.data : null
  const visibleWinner = winner && result?.finalists?.some(food => food._id === winner._id) ? winner : null

  function change(action) { action(); setRestored(false); setSnapshot(null); setWinner(null); setError('') }
  async function submit(event) {
    event?.preventDefault()
    if (lock.current) return
    lock.current = true
    const controller = new AbortController()
    request.current = controller
    setRestored(false); setBusy(true); setError(''); setSnapshot(null); setWinner(null)
    const response = oracle
      ? await getRecommendations(input, { signal: controller.signal })
      : await getGroupDecision(input, { signal: controller.signal })
    if (!active.current) return
    if (response.error) setError(response.error.message)
    else setSnapshot({ input: inputKey, data: response.data })
    lock.current = false
    setBusy(false)
  }

  return <>
    {candidates.length !== foods.length && <p className="notice">Một số món đang được bổ sung loại món, độ cay hoặc độ no. Chỉ món có thông tin đầy đủ được dùng trong chế độ này.</p>}
    <div className={`decision-layout ${oracle ? 'decision-layout--oracle' : 'decision-layout--group'}`}>
      <form className="preference-panel" onSubmit={submit} aria-label={oracle ? 'Khẩu vị của bạn' : 'Chọn món và điều kiện nhóm'}><fieldset disabled={busy} className="decision-form">
        {oracle ? <><h2>Khẩu vị của bạn</h2><Budget value={budget} onChange={value => change(() => setBudget(value))} />
          <CategoryChoices title="Loại món yêu thích" value={preferred} onChange={value => change(() => setPreferred(value))} />
          <p className="field-hint category-hint">Không chọn loại nào nghĩa là món nào cũng được.</p>
          <div className="preference-pair"><div className="field"><label htmlFor="preference-spicy">Độ cay</label><select id="preference-spicy" value={spicy} onChange={event => change(() => setSpicy(Number(event.target.value)))}><option value="0">Không cay</option><option value="1">Cay vừa</option><option value="2">Cay</option></select></div><div className="field"><label htmlFor="preference-fullness">Độ no</label><select id="preference-fullness" value={fullness} onChange={event => change(() => setFullness(Number(event.target.value)))}><option value="1">Nhẹ bụng</option><option value="2">Vừa đủ</option><option value="3">No căng</option></select></div></div>
        </> : <>
          <div className="form-step"><span aria-hidden="true">1</span><h2>Gom món cho bàn</h2></div>
          <p id="candidate-count" className="selection-count" role="status">Đã chọn {selected.length} trên 12 món. Cần ít nhất 2 món.</p>
          {!!selected.length && <ul className="selected-foods" aria-label="Món đã chọn">{selected.map(id => { const food = foods.find(item => item._id === id) || { name: 'Món không còn trong thực đơn' }; return <li key={id}><button type="button" aria-label={`Bỏ chọn ${food.name}`} onClick={() => change(() => setSelected(toggle(selected, id)))}>{food.name}<Icon name="close" /></button></li> })}</ul>}
          <label className="field">Tìm món ứng viên<span className="search-field"><Icon name="search" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm theo tên món" /></span></label>
          <fieldset className="candidate-fieldset"><legend className="sr-only">Chọn từ 2 đến 12 món</legend><div className="candidate-list" aria-describedby="candidate-count">{visible.map(food => <label key={food._id}><input type="checkbox" checked={selected.includes(food._id)} disabled={!selected.includes(food._id) && selected.length >= 12} onChange={() => change(() => setSelected(toggle(selected, food._id)))} /><span className="candidate-name">{food.name}</span><span className="candidate-price">{formatPrice(food.price)}</span></label>)}</div>{!visible.length && <p className="field-hint">Không tìm thấy món. Thử tên khác.</p>}</fieldset>
          <div className="form-step form-step--conditions"><span aria-hidden="true">2</span><h2>Điều kiện chung</h2></div>
          <Budget value={budget} onChange={value => change(() => setBudget(value))} />
          <label className="check-field"><input type="checkbox" checked={noSpicy} onChange={event => change(() => setNoSpicy(event.target.checked))} /><span>Tránh món cay nhiều<small>Vẫn giữ các món cay vừa.</small></span></label>
          <CategoryChoices title="Loại món cần tránh" value={avoided} onChange={value => change(() => setAvoided(value))} />
        </>}
        <button className="button button--primary decision-submit" type="submit" disabled={busy || (!oracle && validSelected.length < 2)}><Icon name={busy ? 'refresh' : oracle ? 'oracle' : 'group'} className={busy ? 'is-loading' : ''} />{busy ? 'Đang lựa chọn' : oracle ? 'Gợi ý cho tôi' : 'Lọc món cho nhóm'}</button>
      </fieldset></form>
      <motion.section layout="position" animate={{ opacity: busy ? .7 : 1 }} transition={{ duration: reduced ? 0 : .16 }} className="decision-results" aria-label={oracle ? 'Kết quả gợi ý' : 'Kết quả nhóm'} aria-live="polite" aria-busy={busy}>
        {restored && result !== null && <p className="restored-note">Kết quả lần trước. Bạn có thể chọn lại.</p>}
        {busy ? <LoadingSkeleton kind="decision" title={oracle ? 'Đang tìm món hợp khẩu vị' : 'Đang xem điều kiện của nhóm'} />
          : error ? <StatusPanel kind="error" title="Chưa nhận được kết quả" onRetry={() => submit()}>{error}</StatusPanel>
            : result === null ? <div className="decision-placeholder"><Landmark name={mode} /><h2>{oracle ? 'Gợi ý dành cho bạn' : 'Những món vào vòng cuối'}</h2><p>{oracle ? 'Chọn khẩu vị rồi nhấn Gợi ý cho tôi.' : 'Gom món và đặt điều kiện để tìm lựa chọn chung.'}</p></div>
              : oracle ? <>
                <div className="section-heading"><h2>Gợi ý dành cho bạn</h2><p>Tối đa 3 món theo độ phù hợp</p></div>
                {!result.length ? <StatusPanel title="Chưa tìm được món phù hợp">Thử tăng ngân sách hoặc thay đổi lựa chọn.</StatusPanel> : <ol className="recommendation-list">{result.map((item, index) => <li key={item.food._id}><div className="recommendation-rank"><span>#{index + 1}</span><strong>{item.score}<small>/100 điểm</small></strong></div><FoodCard food={item.food}><ul className="reason-list">{item.reasons.map(reason => <li key={reason}><Icon name="check" />{reasons[reason] || reason}</li>)}</ul></FoodCard></li>)}</ol>}
              </> : <>
                <div className="section-heading"><h2>{result.finalists.length} món vào vòng cuối</h2><p>Xem kết quả theo điều kiện đã chọn</p></div>
                {!result.finalists.length ? <StatusPanel title="Chưa có lựa chọn chung">Không có món qua bộ lọc. Hãy đổi lựa chọn hoặc ngân sách.</StatusPanel> : <><div className="food-grid finalist-grid">{result.finalists.map(food => <FoodCard key={food._id} food={food} />)}</div><button type="button" className="button button--primary" onClick={() => setWinner(result.finalists[Math.floor(Math.random() * result.finalists.length)])}><Icon name="star" />Chọn ngẫu nhiên trong vòng cuối</button></>}
                {visibleWinner && <div className="group-winner"><Icon name="check" /><div><p>Cả nhóm ăn</p><h3>{visibleWinner.name}</h3><strong>{formatPrice(visibleWinner.price)}</strong></div></div>}
                <div className="eliminated-section"><h3>Món đã loại ({result.eliminated.length})</h3>{result.eliminated.length ? <ul className="eliminated-list">{result.eliminated.map(item => <li key={item.food._id}><Icon name="close" /><div><strong>{item.food.name}</strong><p>{reasons[item.reason] || item.reason}</p></div><span>{formatPrice(item.food.price)}</span></li>)}</ul> : <p className="field-hint">Tất cả món đã chọn đều phù hợp.</p>}</div>
              </>}
      </motion.section>
    </div>
  </>
}
