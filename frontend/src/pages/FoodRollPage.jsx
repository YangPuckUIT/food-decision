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

  const formattedBudget = budget.toLocaleString('vi-VN') + 'đ'

  return (
    <main className="food-roll">
      {/* Luôn có trên trang; chỉ đổi chữ bên trong để trình đọc màn hình đọc lên */}
      <p className="visually-hidden" role="status">
        {status === 'rolling' ? 'Đang gọi sao băng…' : ''}
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

      {screen === 'empty' && (
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

      {screen === 'error' && (
        <>
          <h2 className="food-roll__title">Không kết nối được tới bếp</h2>
          <p className="food-roll__message">Kiểm tra mạng rồi thử lại.</p>
          <button
            type="button"
            className="food-roll__button"
            onClick={rollFood}
          >
            Roll lại
          </button>
        </>
      )}

      {screen === 'idle' && (
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
          onCancel={() => setStatus(cancelTarget)}
          onConfirm={rollFood}
        />
      )}
    </main>
  )
}

export default FoodRollPage
