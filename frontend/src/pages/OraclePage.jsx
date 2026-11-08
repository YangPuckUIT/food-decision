import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import { getRecommendations } from '../api/foods'
import { CATEGORIES, CATEGORY_LABELS } from '../constants/categories'
import { formatPrice } from '../utils/formatPrice'
import './OraclePage.css'

const BUDGET_MIN = 20000
const BUDGET_MAX = 300000
const BUDGET_STEP = 5000

const SPICY_OPTIONS = [
  { value: 0, label: 'No fire' },
  { value: 1, label: 'A little spark' },
  { value: 2, label: 'Bring the flames' },
]

const FULLNESS_OPTIONS = [
  { value: 1, label: 'Just a nibble' },
  { value: 2, label: 'A proper meal' },
  { value: 3, label: 'Feast mode' },
]

// Mã lý do từ API -> câu nói của bà tiên tri
const REASON_TEXT = {
  CATEGORY_MATCH: 'It is exactly the kind of food you seek.',
  SPICY_MATCH: 'The flames are just as you wish.',
  SPICY_CLOSE: 'The flames are close to your liking.',
  FULLNESS_MATCH: 'It will fill your belly just right.',
  FULLNESS_CLOSE: 'It will fill your belly almost right.',
  WITHIN_BUDGET: 'Your purse can afford it.',
}

const DEFAULT_ANSWERS = {
  budget: 50000,
  categories: [], // rỗng = "anything"
  spicy: 1,
  fullness: 2,
}

function OraclePage() {
  const [status, setStatus] = useState('form') // 'form' | 'loading' | 'result' | 'error'
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS)
  const [results, setResults] = useState([])

  // Khi có kết quả / lỗi: đưa focus tới tiêu đề để trình đọc màn hình đọc lên
  // (nút vừa bấm đã biến mất cùng form)
  const headingRef = useRef(null)
  useEffect(() => {
    if (status === 'result' || status === 'error') {
      headingRef.current?.focus()
    }
  }, [status])

  // Cập nhật 1 câu trả lời, giữ nguyên các câu khác
  function updateAnswer(field, value) {
    setAnswers((previous) => ({ ...previous, [field]: value }))
  }

  function toggleCategory(category) {
    setAnswers((previous) => ({
      ...previous,
      categories: previous.categories.includes(category)
        ? previous.categories.filter((item) => item !== category)
        : [...previous.categories, category],
    }))
  }

  async function askOracle() {
    setStatus('loading')
    try {
      const response = await getRecommendations(answers)
      if (response.data) {
        setResults(response.data)
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
    event.preventDefault() // không để form tải lại trang
    askOracle()
  }

  return (
    <main className="oracle">
      <title>Oracle's Tent · Food Decision</title>
      <h1 className="oracle__title">Oracle's Tent</h1>

      {status === 'form' && (
        <form className="oracle__form" onSubmit={handleSubmit}>
          <p className="oracle__intro">
            Answer my four questions, traveler, and I shall name three dishes.
          </p>

          {/* a) Ngân sách */}
          <fieldset className="oracle__question wob">
            <legend className="oracle__legend">
              How much gold is in your purse?
            </legend>
            <label className="oracle__label" htmlFor="oracle-budget">
              Spend at most
            </label>
            <p className="oracle__amount" aria-hidden="true">
              {formatPrice(answers.budget)}
            </p>
            <input
              id="oracle-budget"
              className="oracle__range"
              type="range"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={answers.budget}
              // trình đọc màn hình đọc "50,000₫" thay vì "50000"
              aria-valuetext={formatPrice(answers.budget)}
              onChange={(event) =>
                updateAnswer('budget', Number(event.target.value))
              }
            />
          </fieldset>

          {/* b) Loại món: bật/tắt nhiều nút */}
          <fieldset className="oracle__question wob2">
            <legend className="oracle__legend">
              Which kinds of food call to you?
            </legend>
            <p className="oracle__hint">
              Choose none and I will consider anything.
            </p>
            <div className="oracle__chips">
              {CATEGORIES.map((category) => {
                const selected = answers.categories.includes(category)
                return (
                  <button
                    key={category}
                    type="button"
                    className={
                      selected
                        ? 'oracle__chip oracle__chip--on wob2'
                        : 'oracle__chip wob2'
                    }
                    aria-pressed={selected}
                    onClick={() => toggleCategory(category)}
                  >
                    {CATEGORY_LABELS[category]}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* c) Độ cay: radio, phím mũi tên đổi lựa chọn */}
          <fieldset className="oracle__question wob">
            <legend className="oracle__legend">
              How much fire can you handle?
            </legend>
            <div className="oracle__options">
              {SPICY_OPTIONS.map((option) => (
                <label key={option.value} className="oracle__option wob2">
                  <input
                    type="radio"
                    name="spicy"
                    value={option.value}
                    checked={answers.spicy === option.value}
                    onChange={() => updateAnswer('spicy', option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* d) Độ no */}
          <fieldset className="oracle__question wob2">
            <legend className="oracle__legend">How hungry is your belly?</legend>
            <div className="oracle__options">
              {FULLNESS_OPTIONS.map((option) => (
                <label key={option.value} className="oracle__option wob2">
                  <input
                    type="radio"
                    name="fullness"
                    value={option.value}
                    checked={answers.fullness === option.value}
                    onChange={() => updateAnswer('fullness', option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="oracle__button wob">
            Ask the oracle
          </button>
        </form>
      )}

      {status === 'loading' && (
        <p className="oracle__message" role="status">
          The oracle gazes into her crystal ball…
        </p>
      )}

      {status === 'error' && (
        <div className="oracle__state">
          <h2 className="oracle__state-title" ref={headingRef} tabIndex={-1}>
            The crystal ball is cloudy
          </h2>
          <button
            type="button"
            className="oracle__button wob"
            onClick={askOracle}
          >
            Try again
          </button>
        </div>
      )}

      {status === 'result' && (
        <div className="oracle__state">
          {results.length === 0 ? (
            <h2 className="oracle__state-title" ref={headingRef} tabIndex={-1}>
              The crystal ball sees nothing within your purse.
            </h2>
          ) : (
            <>
              <h2 className="oracle__state-title" ref={headingRef} tabIndex={-1}>
                The oracle has spoken
              </h2>
              <ol className="oracle__results">
                {results.map(({ food, score, reasons }) => (
                  <li key={food._id} className="oracle__result">
                    <Link to={`/codex/${food._id}`} className="oracle__card-link">
                      <FoodCard food={food} />
                    </Link>
                    <p className="oracle__score">
                      <span className="oracle__score-label">Match</span>{' '}
                      {score} / 100
                    </p>
                    <ul className="oracle__reasons">
                      {reasons
                        .filter((code) => REASON_TEXT[code]) // bỏ mã lạ
                        .map((code) => (
                          <li key={code}>{REASON_TEXT[code]}</li>
                        ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </>
          )}
          <button
            type="button"
            className="oracle__button wob"
            onClick={() => setStatus('form')}
          >
            Ask again
          </button>
        </div>
      )}
    </main>
  )
}

export default OraclePage
