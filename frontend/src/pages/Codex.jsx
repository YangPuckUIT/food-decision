import { useCallback, useEffect, useRef, useState } from 'react'
import FoodCard from '../components/FoodCard'
import FoodImage from '../components/FoodImage'
import Dialog from '../components/Dialog'
import Icon from '../components/Icon'
import StatusPanel from '../components/StatusPanel'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { getFood } from '../api/foods'
import { categories, categoryLabel, formatPrice } from '../foodPresentation'
import useSessionState from '../hooks/useSessionState'
import { useLocationSearch, updateRoute } from '../state/navigation'
import { category as categoryValid, text, id as idValid } from '../state/session'
import './Codex.css'

const meals = { Breakfast: 'Bữa sáng', Lunch: 'Bữa trưa', Dinner: 'Bữa tối', Snack: 'Bữa phụ' }

export default function Codex({ foods }) {
  const search = useLocationSearch()
  const params = new URLSearchParams(search)
  const [savedQuery, saveQuery] = useSessionState('codex:query', '', text)
  const [savedCategory, saveCategory] = useSessionState('codex:category', '', value => value === '' || categoryValid(value))
  const [savedSort, saveSort] = useSessionState('codex:sort', 'price-asc', value => ['price-asc', 'price-desc', 'name'].includes(value))
  const query = params.has('q') && text(params.get('q')) ? params.get('q') : savedQuery
  const category = params.has('category') && (params.get('category') === '' || categoryValid(params.get('category'))) ? params.get('category') : savedCategory
  const sort = ['price-asc', 'price-desc', 'name'].includes(params.get('sort')) ? params.get('sort') : savedSort
  const detailId = idValid(params.get('food')) ? params.get('food') : null
  function updateFilters(next) { updateRoute({ page: 'codex', q: query, category, sort, ...next }, { replace: true }) }
  function setQuery(value) { saveQuery(value); updateFilters({ q: value }) }
  function setCategory(value) { saveCategory(value); updateFilters({ category: value }) }
  function setSort(value) { saveSort(value); updateFilters({ sort: value }) }
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const token = useRef(0)
  const pendingDetail = useRef(null)
  const invalidate = useCallback(() => { token.current++; pendingDetail.current?.abort() }, [])
  useEffect(() => invalidate, [invalidate])

  async function fetchDetail(id) {
    const request = ++token.current
    pendingDetail.current?.abort()
    const controller = new AbortController()
    pendingDetail.current = controller
    setDetail(null); setError(''); setLoading(true)
    const response = await getFood(id, { signal: controller.signal })
    if (request !== token.current) return
    if (response.error) setError(response.error.message)
    else setDetail(response.data)
    setLoading(false)
  }
  useEffect(() => {
    if (detailId) {
      const timer = window.setTimeout(() => fetchDetail(detailId), 0)
      return () => { window.clearTimeout(timer); invalidate() }
    }
  }, [detailId, invalidate])
  function showDetail(id) { updateRoute({ food: id }) }
  function closeDetail() { invalidate(); updateRoute({ food: null }, { replace: true }) }
  function clearFilters() { saveQuery(''); saveCategory(''); saveSort('price-asc'); updateFilters({ q: '', category: '', sort: 'price-asc' }) }
  const visible = foods.filter(food => food.name.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')) && (!category || food.category === category))
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name, 'vi') : sort === 'price-desc' ? b.price - a.price : a.price - b.price)

  return <>
    <form className="filters codex-filters" role="search" onSubmit={event => event.preventDefault()}>
      <label>Tìm món<span className="search-field"><Icon name="search" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tên món bạn muốn tìm" /></span></label>
      <div className="field"><label htmlFor="codex-category">Loại món</label><select id="codex-category" value={category} onChange={event => setCategory(event.target.value)}><option value="">Tất cả loại món</option>{categories.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
      <div className="field"><label htmlFor="codex-sort">Sắp xếp</label><select id="codex-sort" value={sort} onChange={event => setSort(event.target.value)}><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="name">Tên A–Z</option></select></div>
    </form>
    <div className="catalog-summary"><p role="status">{visible.length} món trong thực đơn</p>{(query || category || sort !== 'price-asc') && <button type="button" className="text-button" onClick={clearFilters}>Xóa bộ lọc<Icon name="close" /></button>}</div>
    {!visible.length ? <StatusPanel title="Không tìm thấy món">Thử một tên khác hoặc xóa bộ lọc để xem lại thực đơn.</StatusPanel>
      : <div className="food-grid codex-grid">{visible.map(food => <FoodCard key={food._id} food={food}><button type="button" className="text-button" aria-label={`Chi tiết ${food.name}`} onClick={() => showDetail(food._id)}>Xem chi tiết<Icon name="arrow" /></button></FoodCard>)}</div>}
    {detailId && <Dialog title={detail?.name || 'Chi tiết món'} titleId="food-detail-title" onClose={closeDetail} className="food-detail">
      {loading && <LoadingSkeleton kind="detail" title="Đang mở sổ món" />}
      {error && <StatusPanel kind="error" title="Chưa tải được chi tiết" onRetry={() => fetchDetail(detailId)}>{error}</StatusPanel>}
      {detail && <div className="food-detail__content"><FoodImage food={detail} /><div className="food-detail__summary"><p className="eyebrow">{categoryLabel(detail.category)}</p><strong>{formatPrice(detail.price)}</strong></div><p className="food-detail__description">{detail.description}</p>
        <dl className="food-facts"><div><dt>Ẩm thực</dt><dd>{detail.cuisine || 'Chưa có thông tin'}</dd></div><div><dt>Năng lượng</dt><dd>{detail.calories == null ? 'Chưa có thông tin' : `${detail.calories} kcal`}</dd></div><div><dt>Độ cay</dt><dd>{['Không cay', 'Cay vừa', 'Cay'][detail.spicy] || 'Chưa có thông tin'}</dd></div><div><dt>Độ no</dt><dd>{['', 'Nhẹ bụng', 'Vừa đủ', 'No căng'][detail.fullness] || 'Chưa có thông tin'}</dd></div></dl>
        {!!detail.meal?.length && <p className="food-detail__meta"><strong>Bữa ăn: </strong>{detail.meal.map(value => meals[value] || value).join(', ')}</p>}
        {!!detail.tags?.length && <p className="food-detail__meta"><strong>Đặc điểm: </strong>{detail.tags.join(', ')}</p>}
      </div>}
      <button type="button" className="text-button food-detail__back" onClick={closeDetail}><Icon name="back" />Quay lại danh sách</button>
    </Dialog>}
  </>
}
