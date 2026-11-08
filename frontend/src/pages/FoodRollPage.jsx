import { useState } from 'react'
import BudgetPanel from '../components/BudgetPanel'
import FoodCard from '../components/FoodCard'
import MeteorAnimation from '../components/MeteorAnimation'
import { getRandomFood } from '../api/foods'
import './FoodRollPage.css'

const DEFAULT_BUDGET = 50000

// Thời gian animation sao băng (3,6s) + một chút đệm
const ROLL_DURATION = 3700

// Trả về Promise xong sau `ms` mili-giây
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// true nếu người dùng bật "giảm chuyển động" trong hệ điều hành
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function FoodRollPage() {
  // 'idle' | 'budget' | 'rolling' | 'result' | 'empty' (sau này thêm 'error')
  const [status, setStatus] = useState('idle')

  // Ngân sách giữ ở đây (component cha), không giữ trong BudgetPanel
  const [budget, setBudget] = useState(DEFAULT_BUDGET)

  // Món vừa roll được; null khi chưa có
  const [food, setFood] = useState(null)

  // Chạy animation VÀ gọi "API" cùng lúc, chờ cả hai xong mới chuyển trạng thái
  async function rollFood() {
    setStatus('rolling')

    // Giảm chuyển động: không chờ animation, ra kết quả ngay khi API xong
    const animationDone = prefersReducedMotion() ? null : wait(ROLL_DURATION)

    // Promise.all chờ mọi phần tử xong; kết quả trả về theo đúng thứ tự mảng
    const [response] = await Promise.all([
      getRandomFood(budget),
      animationDone,
    ])

    if (response.data) {
      setFood(response.data)
      setStatus('result')
    } else if (response.error.code === 'FOOD_NOT_FOUND') {
      setFood(null)
      setStatus('empty')
    } else {
      // Trạng thái 'error' chưa làm: tạm về idle để không kẹt ở 'rolling'
      console.error(response.error)
      setStatus('idle')
    }
  }

  const formattedBudget = budget.toLocaleString('vi-VN') + 'đ'

  return (
    <main className="food-roll">
      {/* Đang roll: chỉ có animation, không có nút nào để bấm */}
      {status === 'rolling' && <MeteorAnimation />}

      {status === 'result' && (
        <>
          {/* Bọc ngoài để làm hiệu ứng nảy, không cần sửa FoodCard */}
          <div className="food-roll__card">
            <FoodCard key={food._id} food={food} />
          </div>
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
