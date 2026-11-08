import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import { getFoods, getGroupDecision } from '../api/foods'
import { CATEGORIES, CATEGORY_LABELS } from '../constants/categories'
import { formatPrice } from '../utils/formatPrice'
import './RoundTablePage.css'

const MIN_FOODS = 2
const MAX_FOODS = 12

const BUDGET_MIN = 20000
const BUDGET_MAX = 300000
const BUDGET_STEP = 5000

// Mã lý do từ API -> câu của chủ quán
const REASON_TEXT = {
  OVER_BUDGET: 'Too pricey for this crowd.',
  TOO_SPICY: 'Too fiery for the table tonight.',
  AVOIDED_CATEGORY: 'Someone at the table said no to this kind.',
}

function RoundTablePage() {
  const [status, setStatus] = useState('loading') // 'pick' | 'loading' | 'result' | 'error'

  // Danh sách món để chọn (từ getFoods)
  const [foods, setFoods] = useState([])
  const [foodsLoaded, setFoodsLoaded] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  // Lựa chọn của bàn — giữ nguyên khi quay lại bước pick
  const [selectedIds, setSelectedIds] = useState([])
  const [budget, setBudget] = useState(50000)
  const [noSpicy, setNoSpicy] = useState(false)
  const [avoidCategories, setAvoidCategories] = useState([])

  // Kết quả
  const [decision, setDecision] = useState(null) // { finalists, eliminated }
  const [chosenId, setChosenId] = useState(null) // món sao băng chọn

  // Bước 1: tải danh sách món khi vào trang
  useEffect(() => {
    let ignore = false

    async function loadFoods() {
      try {
        const response = await getFoods()
        if (ignore) return
        if (response.data) {
          setFoods(response.data)
          setFoodsLoaded(true)
          setStatus('pick')
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
    return () => {
      ignore = true
    }
  }, [reloadKey])

  // Có kết quả / lỗi: đưa focus tới tiêu đề (nút vừa bấm đã biến mất)
  const headingRef = useRef(null)
  useEffect(() => {
    if (status === 'result' || status === 'error') {
      headingRef.current?.focus()
    }
  }, [status])

  const selectedCount = selectedIds.length
  const canGather = selectedCount >= MIN_FOODS
  const isFull = selectedCount >= MAX_FOODS

  function toggleFood(id) {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    )
  }

  function toggleAvoid(category) {
    setAvoidCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category],
    )
  }

  async function gatherTable() {
    setStatus('loading')
    setChosenId(null)

    // Gửi id theo thứ tự trong danh sách (không theo thứ tự bấm)
    const foodIds = foods
      .filter((food) => selectedIds.includes(food._id))
      .map((food) => food._id)

    try {
      const response = await getGroupDecision({
        foodIds,
        budget,
        noSpicy,
        avoidCategories,
      })
      if (response.data) {
        setDecision(response.data)
        setStatus('result')
      } else {
        console.error(response.error)
        setStatus('error')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (canGather) gatherTable()
  }

  function handleRetry() {
    if (foodsLoaded) {
      gatherTable() // lỗi lúc quyết định -> gửi lại
    } else {
      setStatus('loading') // lỗi lúc tải danh sách -> tải lại
      setReloadKey((key) => key + 1)
    }
  }

  // Random ĐỀU 1 món trong finalists (ở FE, không gọi API)
  function letStarDecide() {
    const { finalists } = decision
    const index = Math.floor(Math.random() * finalists.length)
    setChosenId(finalists[index]._id)
  }

  const chosenFood = decision?.finalists.find((food) => food._id === chosenId)

  return (
    <main className="round">
      <title>Round Table Inn · Food Decision</title>
      <h1 className="round__title">Round Table Inn</h1>

      {status === 'loading' && (
        <p className="round__message" role="status">
          {foodsLoaded ? 'The innkeeper is checking the house rules…' : 'Setting the table…'}
        </p>
      )}

      {status === 'error' && (
        <div className="round__state">
          <h2 className="round__state-title" ref={headingRef} tabIndex={-1}>
            Oops, the innkeeper dropped the tray
          </h2>
          <button type="button" className="round__button wob" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}

      {status === 'pick' && (
        <form className="round__form" onSubmit={handleSubmit}>
          <p className="round__intro">
            Welcome, friends! Put the dishes you're arguing about on the table,
            set the house rules, and I'll clear away the ones that don't fit.
          </p>

          {/* Món trên bàn */}
          <fieldset className="round__section wob">
            <legend className="round__legend">What's on the table?</legend>
            {/* aria-live: đọc lại số món mỗi khi chọn / bỏ chọn */}
            <p className="round__count" aria-live="polite">
              {selectedCount} / {MAX_FOODS} chosen
            </p>
            {isFull && (
              <p className="round__hint">The table is full! Remove one to add another.</p>
            )}

            {foods.length === 0 ? (
              <p className="round__hint">The pantry is empty tonight.</p>
            ) : (
              <ul className="round__foods">
                {foods.map((food) => {
                  const checked = selectedIds.includes(food._id)
                  // Đã đủ 12 món: khoá những món chưa chọn
                  const disabled = !checked && isFull
                  return (
                    <li key={food._id}>
                      <label
                        className={
                          'round__food wob2' + (disabled ? ' round__food--disabled' : '')
                        }
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggleFood(food._id)}
                        />
                        <span className="round__food-name">{food.name}</span>
                        <span className="round__food-meta">
                          {CATEGORY_LABELS[food.category] ?? food.category} ·{' '}
                          {formatPrice(food.price)}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </fieldset>

          {/* Luật chung của bàn */}
          <fieldset className="round__section wob2">
            <legend className="round__legend">House rules</legend>

            <label className="round__label" htmlFor="round-budget">
              Budget per person
            </label>
            <p className="round__amount" aria-hidden="true">
              {formatPrice(budget)}
            </p>
            <input
              id="round-budget"
              className="round__range"
              type="range"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={budget}
              aria-valuetext={formatPrice(budget)}
              onChange={(event) => setBudget(Number(event.target.value))}
            />

            <label className="round__check wob2">
              <input
                type="checkbox"
                checked={noSpicy}
                onChange={(event) => setNoSpicy(event.target.checked)}
              />
              No very spicy food
            </label>

            <div role="group" aria-labelledby="round-avoid-label">
              <p id="round-avoid-label" className="round__label">
                Nobody wants…
              </p>
              <div className="round__chips">
                {CATEGORIES.map((category) => {
                  const avoided = avoidCategories.includes(category)
                  return (
                    <button
                      key={category}
                      type="button"
                      className={
                        avoided ? 'round__chip round__chip--on wob2' : 'round__chip wob2'
                      }
                      aria-pressed={avoided}
                      onClick={() => toggleAvoid(category)}
                    >
                      {CATEGORY_LABELS[category]}
                    </button>
                  )
                })}
              </div>
            </div>
          </fieldset>

          <div className="round__submit">
            <button
              type="submit"
              className="round__button wob"
              disabled={!canGather}
              aria-describedby={canGather ? undefined : 'round-need-more'}
            >
              Gather the table
            </button>
            {!canGather && (
              <p id="round-need-more" className="round__hint">
                Pick at least {MIN_FOODS} dishes so the table has something to argue about.
              </p>
            )}
          </div>
        </form>
      )}

      {status === 'result' && decision && (
        <div className="round__result">
          {decision.finalists.length === 0 ? (
            <h2 className="round__state-title" ref={headingRef} tabIndex={-1}>
              The table is empty. Try loosening the rules.
            </h2>
          ) : (
            <>
              <h2 className="round__state-title" ref={headingRef} tabIndex={-1}>
                Finalists
              </h2>

              <ul className="round__finalists">
                {decision.finalists.map((food) => {
                  const chosen = food._id === chosenId
                  return (
                    <li
                      key={food._id}
                      className={
                        'round__finalist' + (chosen ? ' round__finalist--chosen' : '')
                      }
                    >
                      {/* key đổi mỗi lần chọn lại -> nhãn được tạo mới, hiệu ứng chạy lại */}
                      {chosen && (
                        <p key={chosenId} className="round__badge wob2">
                          ★ The star's choice
                        </p>
                      )}
                      <Link to={`/codex/${food._id}`} className="round__card-link">
                        <FoodCard food={food} />
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="round__decide">
                <button type="button" className="round__button wob" onClick={letStarDecide}>
                  Let the shooting star decide
                </button>
                {/* role="status": đọc lên món được chọn */}
                <p className="round__verdict" role="status">
                  {chosenFood ? `The shooting star picked ${chosenFood.name}!` : ''}
                </p>
              </div>
            </>
          )}

          {decision.eliminated.length > 0 && (
            <section className="round__left wob" aria-labelledby="round-left-title">
              <h2 id="round-left-title" className="round__left-title">
                Left the table
              </h2>
              <ul className="round__left-list">
                {decision.eliminated.map(({ food, reason }) => (
                  <li key={food._id}>
                    <span className="round__left-name">{food.name}</span>{' '}
                    <span className="round__left-reason">
                      — {REASON_TEXT[reason] ?? 'Left without a word.'}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <button
            type="button"
            className="round__button round__button--secondary wob2"
            onClick={() => setStatus('pick')}
          >
            Change the rules
          </button>
        </div>
      )}
    </main>
  )
}

export default RoundTablePage
