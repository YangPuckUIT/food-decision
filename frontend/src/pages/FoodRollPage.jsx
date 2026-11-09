import { useRef, useState } from 'react'
import BudgetPanel from '../components/BudgetPanel'
import FoodCard from '../components/FoodCard'
import { getRandomFood } from '../api/foods'
import './FoodRollPage.css'

const DEFAULT_BUDGET = 50000

function FoodRollPage() {
  // idle | budget | rolling | result | empty | error
  const [status, setStatus] = useState('idle')

  // Ngân sách giữ ở đây (component cha), không giữ trong BudgetPanel
  const [budget, setBudget] = useState(DEFAULT_BUDGET)

  // Món vừa roll được; null khi chưa có
  const [food, setFood] = useState(null)
  const [error, setError] = useState('')
  const busy = useRef(false)

  // Gọi API random với ngân sách hiện tại rồi chuyển trạng thái
  async function rollFood() {
    if (busy.current) return
    busy.current = true
    setStatus('rolling')
    setError('')
    const response = await getRandomFood(budget)
    busy.current = false

    if (response.data) {
      setFood(response.data)
      setStatus('result')
    } else if (response.error.code === 'FOOD_NOT_FOUND') {
      setFood(null)
      setStatus('empty')
    } else {
      setError(response.error.message)
      setStatus('error')
    }
  }

  const formattedBudget = budget.toLocaleString('vi-VN') + 'đ'

  return (
    <main className="food-roll">
      {status === 'rolling' && <p role="status">Đang gọi sao băng…</p>}
      {status === 'error' && <section><p role="alert">{error}</p><button type="button" onClick={() => setStatus('budget')}>Thử lại</button></section>}
      {status === 'result' && (
        <>
          <FoodCard key={food._id} food={food} />
          <div className="food-roll__actions">
            <button
              type="button"
              className="food-roll__button"
              onClick={rollFood}
            >
              Roll lại
            </button>
            <button
              type="button"
              className="food-roll__button food-roll__button--secondary"
              onClick={() => setStatus('budget')}
            >
              Đổi ngân sách
            </button>
          </div>
        </>
      )}

      {status === 'empty' && (
        <>
          <h2 className="food-roll__title">Sao băng chưa tìm thấy món nào</h2>
          <p className="food-roll__message">
            Không có món nào dưới {formattedBudget}. Thử tăng ngân sách nhé.
          </p>
          <button
            type="button"
            className="food-roll__button"
            onClick={() => setStatus('budget')}
          >
            Tăng ngân sách
          </button>
        </>
      )}

      {(status === 'idle' || status === 'budget') && (
        <>
          <h1 className="food-roll__title">Hôm nay ăn gì?</h1>
          <button
            type="button"
            className="food-roll__button"
            onClick={() => setStatus('budget')}
          >
            Roll
          </button>
        </>
      )}

      {status === 'budget' && (
        <BudgetPanel
          budget={budget}
          onChange={setBudget}
          onCancel={() => setStatus(food ? 'result' : 'idle')}
          onConfirm={rollFood}
        />
      )}
    </main>
  )
}

export default FoodRollPage
