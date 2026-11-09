import { useEffect, useRef, useState } from 'react'
import FoodRollPage from './pages/FoodRollPage'
import FoodCard from './components/FoodCard'
import { getFoods, getFood, getRecommendations, getGroupDecision } from './api/foods'
import './MvpApp.css'

const categories = [
  ['noodle-soup', 'Món nước'], ['rice', 'Cơm'], ['fast-food', 'Ăn nhanh'],
  ['hotpot-grill', 'Lẩu & Nướng'], ['street-snack', 'Ăn vặt'],
]
const reasons = {
  CATEGORY_MATCH: 'Đúng loại món yêu thích', SPICY_MATCH: 'Đúng độ cay', SPICY_CLOSE: 'Gần độ cay mong muốn',
  FULLNESS_MATCH: 'Đúng độ no', FULLNESS_CLOSE: 'Gần độ no mong muốn', WITHIN_BUDGET: 'Trong ngân sách',
  OVER_BUDGET: 'Vượt ngân sách', TOO_SPICY: 'Quá cay', AVOIDED_CATEGORY: 'Thuộc loại món cần tránh',
}
const ready = food => categories.some(([key]) => key === food.category) && [0, 1, 2].includes(food.spicy) && [1, 2, 3].includes(food.fullness) && Number.isInteger(food.price) && food.price >= 20000 && food.price <= 300000
const toggle = (items, item) => items.includes(item) ? items.filter(value => value !== item) : [...items, item]

function CategoryChoices({ title, value, onChange }) {
  return <fieldset><legend>{title}</legend><div className="choice-row">{categories.map(([key, label]) =>
    <label key={key}><input type="checkbox" checked={value.includes(key)} onChange={() => onChange(toggle(value, key))} /> {label}</label>
  )}</div></fieldset>
}
function Budget({ value, onChange }) {
  return <label className="field">Ngân sách mỗi người (đ)<input type="number" min="20000" max="300000" step="1" required value={value} onChange={event => onChange(event.target.value)} /></label>
}

function Workspace({ mode }) {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('price-asc')
  const [detail, setDetail] = useState(null)
  const [budget, setBudget] = useState(50000)
  const [preferred, setPreferred] = useState([])
  const [spicy, setSpicy] = useState(0)
  const [fullness, setFullness] = useState(2)
  const [selected, setSelected] = useState([])
  const [noSpicy, setNoSpicy] = useState(false)
  const [avoided, setAvoided] = useState([])
  const [result, setResult] = useState(null)
  const [winner, setWinner] = useState(null)
  const [busy, setBusy] = useState(false)
  const lock = useRef(false)
  const detailRequest = useRef(0)

  useEffect(() => {
    let active = true
    getFoods().then(response => {
      if (!active) return
      if (response.error) setError(response.error.message)
      else setFoods(response.data)
      setLoading(false)
    })
    return () => { active = false }
  }, [reload])

  function change(action) { action(); setResult(null); setWinner(null) }
  async function showDetail(id) {
    const token = ++detailRequest.current
    setDetail(null)
    setError('')
    const response = await getFood(id)
    if (token !== detailRequest.current) return
    if (response.error) setError(response.error.message)
    else setDetail(response.data)
  }
  async function submit(event) {
    event.preventDefault()
    if (lock.current) return
    lock.current = true
    setBusy(true); setError(''); setResult(null); setWinner(null)
    const response = mode === 'oracle'
      ? await getRecommendations({ budget: Number(budget), categories: preferred, spicy, fullness })
      : await getGroupDecision({ foodIds: selected, budget: Number(budget), noSpicy, avoidCategories: avoided })
    if (response.error) setError(response.error.message)
    else setResult(response.data)
    lock.current = false
    setBusy(false)
  }

  if (loading) return <p role="status">Đang tải thực đơn…</p>
  if (!foods.length && error) return <section><p role="alert">{error}</p><button onClick={() => { setLoading(true); setError(''); setReload(value => value + 1) }}>Tải lại</button></section>
  const visible = foods.filter(food => food.name.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')) && (!category || food.category === category))
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name, 'vi') : sort === 'price-desc' ? b.price - a.price : a.price - b.price)

  return <main className="workspace">
    <h1>{mode === 'codex' ? 'Thư Viện Codex' : mode === 'oracle' ? 'Lều Tiên Tri' : 'Quán Bàn Tròn'}</h1>
    {error && <p role="alert" className="notice">{error}</p>}
    {!foods.length && <p>Thực đơn đang được cập nhật. Vui lòng quay lại sau.</p>}
    {mode === 'codex' ? <>
      <div className="filters"><label>Tìm món<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Phở, cơm, bánh mì…" /></label>
        <label>Loại món<select value={category} onChange={event => setCategory(event.target.value)}><option value="">Tất cả</option>{categories.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label>Sắp xếp<select value={sort} onChange={event => setSort(event.target.value)}><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="name">Tên A–Z</option></select></label>
      </div>
      <p role="status">{visible.length} món</p>
      {detail && <section className="detail" aria-label="Chi tiết món"><button onClick={() => { detailRequest.current++; setDetail(null) }}>Đóng chi tiết</button><h2>{detail.name}</h2><p>{detail.description}</p><p>{detail.price.toLocaleString('vi-VN')}đ · {detail.calories} kcal</p><p>{detail.meal?.join(', ')}</p><p>{detail.tags?.join(' · ')}</p></section>}
      <div className="food-grid">{visible.map(food => <section key={food._id}><FoodCard food={food} /><button onClick={() => showDetail(food._id)}>Chi tiết {food.name}</button></section>)}</div>
    </> : <>
      {foods.some(food => !ready(food)) && <p className="notice">Một số món đang được bổ sung thông tin độ cay, độ no và loại món. Các chế độ này chỉ dùng món có thông tin đầy đủ.</p>}
      <form onSubmit={submit}><fieldset disabled={busy} className="decision-form">
        <Budget value={budget} onChange={value => change(() => setBudget(value))} />
        {mode === 'oracle' ? <>
          <CategoryChoices title="Loại món yêu thích (bỏ trống = bất kỳ)" value={preferred} onChange={value => change(() => setPreferred(value))} />
          <label className="field">Độ cay<select value={spicy} onChange={event => change(() => setSpicy(Number(event.target.value)))}><option value="0">Không cay</option><option value="1">Cay vừa</option><option value="2">Cay</option></select></label>
          <label className="field">Muốn ăn no thế nào?<select value={fullness} onChange={event => change(() => setFullness(Number(event.target.value)))}><option value="1">Nhẹ bụng</option><option value="2">Vừa đủ</option><option value="3">No căng</option></select></label>
        </> : <>
          <label><input type="checkbox" checked={noSpicy} onChange={event => change(() => setNoSpicy(event.target.checked))} /> Tránh món cay nhiều (vẫn giữ cay vừa)</label>
          <CategoryChoices title="Loại món cần tránh" value={avoided} onChange={value => change(() => setAvoided(value))} />
          <fieldset><legend>Chọn 2–12 món ứng viên ({selected.length}/12)</legend><div className="candidate-list">{foods.filter(ready).map(food => <label key={food._id}><input type="checkbox" checked={selected.includes(food._id)} disabled={!selected.includes(food._id) && selected.length >= 12} onChange={() => change(() => setSelected(toggle(selected, food._id)))} /> {food.name} — {food.price.toLocaleString('vi-VN')}đ</label>)}</div></fieldset>
        </>}
        <button disabled={busy || (mode === 'group' && selected.length < 2)}>{busy ? 'Đang lựa chọn…' : mode === 'oracle' ? 'Hỏi Tiên Tri' : 'Tìm món phù hợp cho nhóm'}</button>
      </fieldset></form>
      {mode === 'oracle' && result && <section aria-live="polite"><h2>Gợi ý dành cho bạn</h2>{!result.length && <p>Chưa tìm được món phù hợp. Thử tăng ngân sách hoặc bổ sung thực đơn.</p>}<div className="food-grid">{result.map(item => <section key={item.food._id}><FoodCard food={item.food} /><strong>{item.score}/100 điểm</strong><ul>{item.reasons.map(reason => <li key={reason}>{reasons[reason] || reason}</li>)}</ul></section>)}</div></section>}
      {mode === 'group' && result && <section aria-live="polite"><h2>{result.finalists.length} món vào vòng cuối</h2>{!result.finalists.length && <p>Không có món qua bộ lọc. Hãy đổi lựa chọn hoặc ngân sách.</p>}<div className="food-grid">{result.finalists.map(food => <FoodCard key={food._id} food={food} />)}</div>{result.finalists.length > 0 && <button onClick={() => setWinner(result.finalists[Math.floor(Math.random() * result.finalists.length)])}>Để sao băng quyết định</button>}{winner && <p className="winner">Cả nhóm ăn: <strong>{winner.name}</strong>!</p>}<h3>Món đã loại</h3><ul>{result.eliminated.map(item => <li key={item.food._id}>{item.food.name}: {reasons[item.reason]}</li>)}</ul></section>}
    </>}
  </main>
}

export default function App() {
  const [mode, setMode] = useState('home')
  const tabs = [['home', 'Vương quốc'], ['roll', 'Tháp Sao Băng'], ['codex', 'Thư Viện'], ['oracle', 'Lều Tiên Tri'], ['group', 'Bàn Tròn']]
  return <div className="kingdom"><header className="site-header"><a href="#" onClick={event => { event.preventDefault(); setMode('home') }}>🍜 Vương quốc Ăn Gì</a><nav aria-label="Chế độ">{tabs.map(([key, label]) => <button key={key} aria-current={mode === key ? 'page' : undefined} onClick={() => setMode(key)}>{label}</button>)}</nav></header>
    {mode === 'home' ? <main className="home"><p className="eyebrow">MỖI BỮA ĂN LÀ MỘT CUỘC PHIÊU LƯU</p><h1>Hôm nay,<br />ăn gì đây?</h1><p>Để sao băng chọn món, hỏi lời Tiên Tri hoặc cùng bạn bè tìm một món ai cũng thích.</p><div className="destinations">{[['roll', '☄️', 'Tháp Sao Băng', 'Chọn ngân sách, gọi một món bất ngờ.'], ['oracle', '🔮', 'Lều Tiên Tri', 'Ba gợi ý theo khẩu vị và độ no của bạn.'], ['group', '🍲', 'Quán Bàn Tròn', 'Chọn món cùng nhau trên một thiết bị.'], ['codex', '📖', 'Thư Viện Codex', 'Khám phá thực đơn và xem từng món.']].map(([key, icon, title, description]) => <button key={key} onClick={() => setMode(key)}><span>{icon}</span><h2>{title}</h2><p>{description}</p></button>)}</div></main> : mode === 'roll' ? <FoodRollPage /> : <Workspace key={mode} mode={mode} />}
    <footer>Food Decision · Chọn món dễ hơn, ăn cùng nhau vui hơn.</footer>
  </div>
}
