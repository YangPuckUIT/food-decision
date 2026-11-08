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
  // 'idle' | 'budget' | 'rolling' | 'result' | 'empty' | 'error'
  const [status, setStatus] = useState('idle')

  // Ngân sách giữ ở đây (component cha), không giữ trong BudgetPanel
  const [budget, setBudget] = useState(DEFAULT_BUDGET)

  // Món vừa roll được; null khi chưa có
  const [food, setFood] = useState(null)

  // Gọi "API"; nếu bị throw (mất mạng, server sập...) thì trả về null
  // thay vì để lỗi lan ra ngoài -> Promise.all vẫn chờ đủ animation
  async function fetchRandomFood() {
    try {
      return await getRandomFood(budget)
    } catch (error) {
      console.error(error)
      return null
    }
  }

  // Chạy animation VÀ gọi "API" cùng lúc, chờ cả hai xong mới chuyển trạng thái
  async function rollFood() {
    setStatus('rolling')

    // Giảm chuyển động: không chờ animation, ra kết quả ngay khi API xong
    const animationDone = prefersReducedMotion() ? null : wait(ROLL_DURATION)

    // Promise.all chờ mọi phần tử xong; kết quả trả về theo đúng thứ tự mảng
    const [response] = await Promise.all([fetchRandomFood(), animationDone])

    // ?. : nếu vế trái là null/undefined thì trả undefined thay vì báo lỗi
    if (response?.data) {
      setFood(response.data)
      setStatus('result')
    } else if (response?.error?.code === 'FOOD_NOT_FOUND') {
      setFood(null)
      setStatus('empty')
    } else {
      // Bị throw (response = null) hoặc mã lỗi khác
      if (response) console.error(response.error)
      setStatus('error')
    }
  }

  // Bấm "Huỷ" trong panel thì quay về đâu
  const cancelTarget = food ? 'result' : 'idle'

  // Màn hiển thị: khi panel mở, phía sau giữ nguyên màn mà "Huỷ" sẽ quay về.
  // Nhờ vậy nút đã mở panel vẫn còn trên trang để trả focus về.
  const screen = status === 'budget' ? cancelTarget : status

  // 50000 -> "50,000₫"
  const formattedBudget = budget.toLocaleString('en-US') + '₫'

  return (
    <main className="food-roll">
      <title>Shooting Star Tower · Food Decision</title>

      {/* Luôn có trên trang; chỉ đổi chữ bên trong để trình đọc màn hình đọc lên */}
      <p className="visually-hidden" role="status">
        {status === 'rolling' ? 'Calling a shooting star…' : ''}
      </p>

      {/* Đang roll: chỉ có animation, không có nút nào để bấm */}
      {screen === 'rolling' && <MeteorAnimation />}

      {screen === 'result' && (
        <>
          {/* Bọc ngoài để làm hiệu ứng nảy, không cần sửa FoodCard */}
          <div className="food-roll__card">
            <FoodCard key={food._id} food={food} />
          </div>
          <div className="food-roll__actions">
            <button
              type="button"
              className="food-roll__button wob"
              onClick={rollFood}
            >
              Roll again
            </button>
            <button
              type="button"
              className="food-roll__button food-roll__button--secondary wob2"
              onClick={() => setStatus('budget')}
            >
              Change budget
            </button>
          </div>
        </>
      )}

      {screen === 'empty' && (
        <>
          <h2 className="food-roll__title">The shooting star found nothing</h2>
          <p className="food-roll__message">
            No food under {formattedBudget}. Try a bigger budget.
          </p>
          <button
            type="button"
            className="food-roll__button wob"
            onClick={() => setStatus('budget')}
          >
            Raise budget
          </button>
        </>
      )}

      {screen === 'error' && (
        <>
          <h2 className="food-roll__title">Can't reach the kitchen</h2>
          <p className="food-roll__message">
            Check your connection and try again.
          </p>
          <button
            type="button"
            className="food-roll__button wob"
            onClick={rollFood}
          >
            Roll again
          </button>
        </>
      )}

      {screen === 'idle' && (
        <>
          <h1 className="food-roll__title">Today's pick?</h1>
          <button
            type="button"
            className="food-roll__button food-roll__button--big wob"
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
          onCancel={() => setStatus(cancelTarget)}
          onConfirm={rollFood}
        />
      )}
    </main>
  )
}

export default FoodRollPage
