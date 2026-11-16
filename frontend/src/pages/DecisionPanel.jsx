import { useEffect, useRef, useState } from 'react'
import FoodCard from '../components/FoodCard'
import Icon from '../components/Icon'
import Landmark from '../components/Landmark'
import StatusPanel from '../components/StatusPanel'
import { getRecommendations, getGroupDecision } from '../api/foods'
import { categories, formatPrice, reasons, ready, toggle } from '../foodPresentation'
import './DecisionPanel.css'

function CategoryChoices({ title, value, onChange }) {
  return <fieldset className="category-choices"><legend>{title}</legend><div className="choice-row">{categories.map(([key, label]) => <label key={key}><input type="checkbox" checked={value.includes(key)} onChange={() => onChange(toggle(value, key))} /><span>{label}</span></label>)}</div></fieldset>
}

function Budget({ value, onChange }) {
  return <div className="field"><label htmlFor="decision-budget">Ngân sách mỗi người (đ)</label><input id="decision-budget" type="number" min="20000" max="300000" step="1" required value={value} onChange={event => onChange(event.target.value)} aria-describedby="decision-budget-hint" /><span id="decision-budget-hint" className="field-hint">Từ 20.000đ đến 300.000đ.</span></div>
}

export default function DecisionPanel({ foods, mode }) {
  const [budget, setBudget] = useState(50000)
  const [preferred, setPreferred] = useState([])
  const [spicy, setSpicy] = useState(0)
  const [fullness, setFullness] = useState(2)
  const [selected, setSelected] = useState([])
  const [noSpicy, setNoSpicy] = useState(false)
  const [avoided, setAvoided] = useState([])
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [winner, setWinner] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  const active = useRef(true)
  useEffect(() => { active.current = true; return () => { active.current = false } }, [])
  const oracle = mode === 'oracle'
  const candidates = foods.filter(ready)
  const visible = candidates.filter(food => food.name.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')))

  function change(action) { action(); setResult(null); setWinner(null); setError('') }
  async function submit(event) {
    event?.preventDefault()
    if (lock.current) return
    lock.current = true
    setBusy(true); setError(''); setResult(null); setWinner(null)
    const response = oracle
      ? await getRecommendations({ budget: Number(budget), categories: preferred, spicy, fullness })
      : await getGroupDecision({ foodIds: selected, budget: Number(budget), noSpicy, avoidCategories: avoided })
    if (!active.current) return
    if (response.error) setError(response.error.message)
    else setResult(response.data)
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
          {!!selected.length && <ul className="selected-foods" aria-label="Món đã chọn">{selected.map(id => { const food = foods.find(item => item._id === id); return <li key={id}><button type="button" aria-label={`Bỏ chọn ${food.name}`} onClick={() => change(() => setSelected(toggle(selected, id)))}>{food.name}<Icon name="close" /></button></li> })}</ul>}
          <label className="field">Tìm món ứng viên<span className="search-field"><Icon name="search" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm theo tên món" /></span></label>
          <fieldset className="candidate-fieldset"><legend className="sr-only">Chọn từ 2 đến 12 món</legend><div className="candidate-list" aria-describedby="candidate-count">{visible.map(food => <label key={food._id}><input type="checkbox" checked={selected.includes(food._id)} disabled={!selected.includes(food._id) && selected.length >= 12} onChange={() => change(() => setSelected(toggle(selected, food._id)))} /><span className="candidate-name">{food.name}</span><span className="candidate-price">{formatPrice(food.price)}</span></label>)}</div>{!visible.length && <p className="field-hint">Không tìm thấy món. Thử tên khác.</p>}</fieldset>
          <div className="form-step form-step--conditions"><span aria-hidden="true">2</span><h2>Điều kiện chung</h2></div>
          <Budget value={budget} onChange={value => change(() => setBudget(value))} />
          <label className="check-field"><input type="checkbox" checked={noSpicy} onChange={event => change(() => setNoSpicy(event.target.checked))} /><span>Tránh món cay nhiều<small>Vẫn giữ các món cay vừa.</small></span></label>
          <CategoryChoices title="Loại món cần tránh" value={avoided} onChange={value => change(() => setAvoided(value))} />
        </>}
        <button className="button button--primary decision-submit" type="submit" disabled={busy || (!oracle && selected.length < 2)}><Icon name={busy ? 'refresh' : oracle ? 'oracle' : 'group'} className={busy ? 'is-loading' : ''} />{busy ? 'Đang lựa chọn' : oracle ? 'Gợi ý cho tôi' : 'Lọc món cho nhóm'}</button>
      </fieldset></form>
      <section className="decision-results" aria-label={oracle ? 'Kết quả gợi ý' : 'Kết quả nhóm'} aria-live="polite" aria-busy={busy}>
        {busy ? <StatusPanel kind="loading" title={oracle ? 'Đang tìm món hợp khẩu vị' : 'Đang xem điều kiện của nhóm'}>Chờ một chút để nhận kết quả.</StatusPanel>
          : error ? <StatusPanel kind="error" title="Chưa nhận được kết quả" onRetry={() => submit()}>{error}</StatusPanel>
            : result === null ? <div className="decision-placeholder"><Landmark name={mode} /><h2>{oracle ? 'Gợi ý dành cho bạn' : 'Những món vào vòng cuối'}</h2><p>{oracle ? 'Chọn khẩu vị rồi nhấn Gợi ý cho tôi.' : 'Gom món và đặt điều kiện để tìm lựa chọn chung.'}</p></div>
              : oracle ? <>
                <div className="section-heading"><h2>Gợi ý dành cho bạn</h2><p>Tối đa 3 món theo độ phù hợp</p></div>
                {!result.length ? <StatusPanel title="Chưa tìm được món phù hợp">Thử tăng ngân sách hoặc thay đổi lựa chọn.</StatusPanel> : <ol className="recommendation-list">{result.map((item, index) => <li key={item.food._id}><div className="recommendation-rank"><span>#{index + 1}</span><strong>{item.score}<small>/100 điểm</small></strong></div><FoodCard food={item.food}><ul className="reason-list">{item.reasons.map(reason => <li key={reason}><Icon name="check" />{reasons[reason] || reason}</li>)}</ul></FoodCard></li>)}</ol>}
              </> : <>
                <div className="section-heading"><h2>{result.finalists.length} món vào vòng cuối</h2><p>Xem kết quả theo điều kiện đã chọn</p></div>
                {!result.finalists.length ? <StatusPanel title="Chưa có lựa chọn chung">Không có món qua bộ lọc. Hãy đổi lựa chọn hoặc ngân sách.</StatusPanel> : <><div className="food-grid finalist-grid">{result.finalists.map(food => <FoodCard key={food._id} food={food} />)}</div><button type="button" className="button button--primary" onClick={() => setWinner(result.finalists[Math.floor(Math.random() * result.finalists.length)])}><Icon name="star" />Chọn ngẫu nhiên trong vòng cuối</button></>}
                {winner && <div className="group-winner"><Icon name="check" /><div><p>Cả nhóm ăn</p><h3>{winner.name}</h3><strong>{formatPrice(winner.price)}</strong></div></div>}
                <div className="eliminated-section"><h3>Món đã loại ({result.eliminated.length})</h3>{result.eliminated.length ? <ul className="eliminated-list">{result.eliminated.map(item => <li key={item.food._id}><Icon name="close" /><div><strong>{item.food.name}</strong><p>{reasons[item.reason] || item.reason}</p></div><span>{formatPrice(item.food.price)}</span></li>)}</ul> : <p className="field-hint">Tất cả món đã chọn đều phù hợp.</p>}</div>
              </>}
      </section>
    </div>
  </>
}
