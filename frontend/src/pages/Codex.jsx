import { useEffect, useRef, useState } from 'react'
import FoodCard from '../components/FoodCard'
import FoodImage from '../components/FoodImage'
import Dialog from '../components/Dialog'
import Icon from '../components/Icon'
import StatusPanel from '../components/StatusPanel'
import { getFood } from '../api/foods'
import { categories, categoryLabel, formatPrice } from '../foodPresentation'
import './Codex.css'

const meals = { Breakfast: 'Bữa sáng', Lunch: 'Bữa trưa', Dinner: 'Bữa tối', Snack: 'Bữa phụ' }

export default function Codex({ foods }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('price-asc')
  const [detailId, setDetailId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const token = useRef(0)
  useEffect(() => () => { token.current++ }, [])

  async function showDetail(id) {
    const request = ++token.current
    setDetailId(id); setDetail(null); setError(''); setLoading(true)
    const response = await getFood(id)
    if (request !== token.current) return
    if (response.error) setError(response.error.message)
    else setDetail(response.data)
    setLoading(false)
  }
  function closeDetail() { token.current++; setDetailId(null) }
  function clearFilters() { setQuery(''); setCategory(''); setSort('price-asc') }
  const visible = foods.filter(food => food.name.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')) && (!category || food.category === category))
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name, 'vi') : sort === 'price-desc' ? b.price - a.price : a.price - b.price)

  return <>
    <form className="filters codex-filters" role="search" onSubmit={event => event.preventDefault()}>
      <label>Tìm món<span className="search-field"><Icon name="search" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tên món bạn muốn tìm" /></span></label>
      <label>Loại món<select value={category} onChange={event => setCategory(event.target.value)}><option value="">Tất cả loại món</option>{categories.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label>Sắp xếp<select value={sort} onChange={event => setSort(event.target.value)}><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="name">Tên A–Z</option></select></label>
    </form>
    <div className="catalog-summary"><p role="status">{visible.length} món trong thực đơn</p>{(query || category || sort !== 'price-asc') && <button type="button" className="text-button" onClick={clearFilters}>Xóa bộ lọc<Icon name="close" /></button>}</div>
    {!visible.length ? <StatusPanel title="Không tìm thấy món">Thử một tên khác hoặc xóa bộ lọc để xem lại thực đơn.</StatusPanel>
      : <div className="food-grid codex-grid">{visible.map(food => <FoodCard key={food._id} food={food}><button type="button" className="text-button" aria-label={`Chi tiết ${food.name}`} onClick={() => showDetail(food._id)}>Xem chi tiết<Icon name="arrow" /></button></FoodCard>)}</div>}
    {detailId && <Dialog title={detail?.name || 'Chi tiết món'} titleId="food-detail-title" onClose={closeDetail} className="food-detail">
      {loading && <StatusPanel kind="loading" title="Đang mở sổ món" />}
      {error && <StatusPanel kind="error" title="Chưa tải được chi tiết" onRetry={() => showDetail(detailId)}>{error}</StatusPanel>}
      {detail && <div className="food-detail__content"><FoodImage food={detail} /><div className="food-detail__summary"><p className="eyebrow">{categoryLabel(detail.category)}</p><strong>{formatPrice(detail.price)}</strong></div><p className="food-detail__description">{detail.description}</p>
        <dl className="food-facts"><div><dt>Ẩm thực</dt><dd>{detail.cuisine || 'Chưa có thông tin'}</dd></div><div><dt>Năng lượng</dt><dd>{detail.calories == null ? 'Chưa có thông tin' : `${detail.calories} kcal`}</dd></div><div><dt>Độ cay</dt><dd>{['Không cay', 'Cay vừa', 'Cay'][detail.spicy] || 'Chưa có thông tin'}</dd></div><div><dt>Độ no</dt><dd>{['', 'Nhẹ bụng', 'Vừa đủ', 'No căng'][detail.fullness] || 'Chưa có thông tin'}</dd></div></dl>
        {!!detail.meal?.length && <p className="food-detail__meta"><strong>Bữa ăn: </strong>{detail.meal.map(value => meals[value] || value).join(', ')}</p>}
        {!!detail.tags?.length && <p className="food-detail__meta"><strong>Đặc điểm: </strong>{detail.tags.join(', ')}</p>}
      </div>}
      <button type="button" className="text-button food-detail__back" onClick={closeDetail}><Icon name="back" />Quay lại danh sách</button>
    </Dialog>}
  </>
}
