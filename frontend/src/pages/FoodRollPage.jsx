import { useState } from 'react'
import BudgetPanel from '../components/BudgetPanel'
import './FoodRollPage.css'

const DEFAULT_BUDGET = 50000

function FoodRollPage() {
  // 'idle' | 'budget' (sau này thêm 'rolling', 'result', 'empty', 'error')
  const [status, setStatus] = useState('idle')

  // Ngân sách giữ ở đây (component cha), không giữ trong BudgetPanel
  const [budget, setBudget] = useState(DEFAULT_BUDGET)

  function handleConfirm() {
    // TẠM: chưa gọi random, chỉ in ra để kiểm tra
    console.log(budget)
  }

  return (
    <main className="food-roll">
      <h1 className="food-roll__title">Hôm nay ăn gì?</h1>
      <button
        type="button"
        className="food-roll__button"
        onClick={() => setStatus('budget')}
      >
        Roll
      </button>

      {status === 'budget' && (
        <BudgetPanel
          budget={budget}
          onChange={setBudget}
          onCancel={() => setStatus('idle')}
          onConfirm={handleConfirm}
        />
      )}
    </main>
  )
}

export default FoodRollPage
