import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FoodPhoto from '../components/FoodPhoto'
import { getFoodById } from '../api/foods'
import { CATEGORY_LABELS } from '../constants/categories'
import { formatPrice } from '../utils/formatPrice'
import './FoodDetailPage.css'

// Số trong data -> chữ dễ hiểu
const SPICY_LABELS = { 0: 'not spicy', 1: 'mild', 2: 'hot' }
const FULLNESS_LABELS = { 1: 'light', 2: 'satisfying', 3: 'very filling' }

function FoodDetailPage() {
  // /codex/mock-food-002 -> id = 'mock-food-002'
  const { id } = useParams()

  // Kết quả lần tải gần nhất, kèm id đã tải: { id, food } | { id, error }
  const [result, setResult] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    async function loadFood() {
      try {
        const response = await getFoodById(id)
        if (!ignore) setResult({ id, ...response })
      } catch (error) {
        if (ignore) return
        console.error(error)
        setResult({ id, error: { code: 'NETWORK_ERROR' } })
      }
    }

    loadFood()
    return () => {
      ignore = true
    }
  }, [id, reloadKey]) // chạy lại khi id trên URL đổi

  function handleRetry() {
    setResult(null)
    setReloadKey((key) => key + 1)
  }

  // Chưa có kết quả, hoặc kết quả là của id cũ -> đang tải
  const isLoading = !result || result.id !== id
  const food = isLoading ? null : result.data

  if (isLoading) {
    return (
      <main className="food-detail food-detail--center">
        <title>Codex Entry · Food Decision</title>
        <p className="food-detail__message" role="status">
          Opening the codex…
        </p>
      </main>
    )
  }

  if (!food) {
    const notFound = result.error?.code === 'FOOD_NOT_FOUND'
    return (
      <main className="food-detail food-detail--center">
        <title>{notFound ? 'Not Found · Food Decision' : 'Codex Entry · Food Decision'}</title>
        <h1 className="food-detail__state-title">
          {notFound ? "This creature isn't in the codex" : "Can't reach the library"}
        </h1>
        {!notFound && (
          <button
            type="button"
            className="food-detail__button wob"
            onClick={handleRetry}
          >
            Try again
          </button>
        )}
        <Link to="/codex" className="link-button wob2">
          Back to the codex
        </Link>
      </main>
    )
  }

  const facts = [
    ['Cuisine', food.cuisine],
    ['Meals', food.meal?.join(', ')],
    ['Calories', food.calories != null && `${food.calories} kcal`],
    ['Spicy', SPICY_LABELS[food.spicy]],
    ['Fullness', FULLNESS_LABELS[food.fullness]],
  ].filter(([, value]) => value) // bỏ dòng nào chưa có dữ liệu

  return (
    <main className="food-detail">
      <title>{`${food.name} · Food Decision`}</title>

      <Link to="/codex" className="link-button wob2 food-detail__back">
        Back to the codex
      </Link>

      <article className="food-detail__entry">
        <div className="food-detail__photo">
          {/* key: đổi món thì FoodPhoto tạo mới -> reset trạng thái ảnh lỗi */}
          <FoodPhoto key={food._id} food={food} />
        </div>

        <div className="food-detail__info">
          {CATEGORY_LABELS[food.category] && (
            <p className="food-detail__category">
              {CATEGORY_LABELS[food.category]}
            </p>
          )}
          <h1 className="food-detail__name">{food.name}</h1>
          <p className="food-detail__price">{formatPrice(food.price)}</p>
          <p className="food-detail__description">{food.description}</p>

          <dl className="food-detail__facts">
            {facts.map(([label, value]) => (
              <div key={label} className="food-detail__fact">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {food.tags?.length > 0 && (
            <ul className="food-detail__tags" aria-label="Tags">
              {food.tags.map((tag) => (
                <li key={tag} className="food-detail__tag wob2">
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </main>
  )
}

export default FoodDetailPage
