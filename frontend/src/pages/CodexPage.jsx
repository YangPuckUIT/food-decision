import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import { getFoods } from '../api/foods'
import { CATEGORIES, CATEGORY_LABELS } from '../constants/categories'
import './CodexPage.css'

// "Phở Bò" -> "pho bo", "BÁNH" -> "banh": bỏ dấu + chữ thường để so sánh
function normalizeText(text) {
  return text
    .normalize('NFD') // tách chữ và dấu: "ở" -> "o" + dấu móc + dấu hỏi
    .replace(/[̀-ͯ]/g, '') // xoá các ký tự dấu vừa tách ra
    .replace(/đ/g, 'd') // "đ" không tách được bằng NFD nên đổi riêng
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

function CodexPage() {
  // Dữ liệu từ "API"
  const [foods, setFoods] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  // Tăng số này để useEffect chạy lại (nút "Try again")
  const [reloadKey, setReloadKey] = useState(0)

  // Lựa chọn của người dùng — chỉ lưu những gì người dùng nhập/chọn
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortOrder, setSortOrder] = useState('price-asc')

  // Gọi API khi vào trang (và mỗi khi reloadKey đổi)
  useEffect(() => {
    // Nếu rời trang trước khi API trả về thì bỏ qua kết quả cũ
    let ignore = false

    async function loadFoods() {
      try {
        const response = await getFoods()
        if (ignore) return
        if (response.data) {
          setFoods(response.data)
          setStatus('ready')
        } else {
          console.error(response.error)
          setStatus('error')
        }
      } catch (error) {
        if (ignore) return
        console.error(error)
        setStatus('error')
      }
    }

    loadFoods()

    // Cleanup: chạy khi rời trang hoặc trước lần chạy effect tiếp theo
    return () => {
      ignore = true
    }
  }, [reloadKey])

  function handleRetry() {
    setStatus('loading')
    setReloadKey((key) => key + 1)
  }

  function clearFilters() {
    setQuery('')
    setCategory('all')
  }

  // Derived state: tính lại mỗi lần render từ foods + lựa chọn, KHÔNG lưu vào state
  const normalizedQuery = normalizeText(query.trim())
  const visibleFoods = foods
    .filter((food) => category === 'all' || food.category === category)
    .filter((food) => normalizeText(food.name).includes(normalizedQuery))
    // slice() tạo bản sao trước khi sort, vì sort() sửa thẳng vào mảng gốc
    .slice()
    .sort((a, b) =>
      sortOrder === 'price-asc' ? a.price - b.price : b.price - a.price,
    )

  const countLabel =
    visibleFoods.length === 1 ? '1 creature' : `${visibleFoods.length} creatures`

  return (
    <main className="codex">
      <title>Codex Library · Food Decision</title>
      <h1 className="codex__title">Codex Library</h1>

      {status === 'loading' && (
        <p className="codex__message" role="status">
          Opening the codex…
        </p>
      )}

      {status === 'error' && (
        <div className="codex__state">
          <h2 className="codex__state-title">Can't reach the library</h2>
          <button
            type="button"
            className="codex__button wob"
            onClick={handleRetry}
          >
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && (
        <>
          <div className="codex__controls">
            <div className="codex__field codex__field--search">
              <label htmlFor="codex-search">Search by name</label>
              <input
                id="codex-search"
                className="codex__input wob2"
                type="search"
                placeholder="e.g. pho"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="codex__field">
              <label htmlFor="codex-sort">Sort by price</label>
              <select
                id="codex-sort"
                className="codex__input wob2"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value="price-asc">Low to high</option>
                <option value="price-desc">High to low</option>
              </select>
            </div>
          </div>

          <div
            className="codex__filters"
            role="group"
            aria-label="Filter by category"
          >
            {['all', ...CATEGORIES].map((value) => (
              <button
                key={value}
                type="button"
                className={
                  value === category
                    ? 'codex__filter codex__filter--active wob2'
                    : 'codex__filter wob2'
                }
                aria-pressed={value === category}
                onClick={() => setCategory(value)}
              >
                {value === 'all' ? 'All' : CATEGORY_LABELS[value]}
              </button>
            ))}
          </div>

          {/* role="status": trình đọc màn hình đọc lại số món mỗi khi đổi */}
          <p className="codex__count" role="status">
            {countLabel}
          </p>

          {visibleFoods.length === 0 ? (
            <div className="codex__state">
              <h2 className="codex__state-title">
                No creatures match your search
              </h2>
              <button
                type="button"
                className="codex__button wob"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="codex__grid">
              {visibleFoods.map((food) => (
                <li key={food._id} className="codex__item">
                  {/* Cả thẻ là 1 link sang trang chi tiết */}
                  <Link to={`/codex/${food._id}`} className="codex__card-link">
                    <FoodCard food={food} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}

export default CodexPage
