import { useRef, useState } from 'react'
import BudgetPanel from '../components/BudgetPanel'
import FoodCard from '../components/FoodCard'
import PageHeading from '../components/PageHeading'
import StatusPanel from '../components/StatusPanel'
import Landmark from '../components/Landmark'
import Icon from '../components/Icon'
import { formatPrice } from '../foodPresentation'
import { getRandomFood } from '../api/foods'
import './FoodRollPage.css'

export default function FoodRollPage({ onHome }) {
  const [status, setStatus] = useState('idle')
  const [budget, setBudget] = useState(50000)
  const [food, setFood] = useState(null)
  const [error, setError] = useState('')
  const busy = useRef(false)

  async function rollFood(nextBudget = budget) {
    if (busy.current) return
    busy.current = true
    setStatus('rolling')
    setError('')
    const response = await getRandomFood(nextBudget)
    busy.current = false
    if (response.data) { setFood(response.data); setStatus('result') }
    else if (response.error.code === 'FOOD_NOT_FOUND') { setFood(null); setStatus('empty') }
    else { setError(response.error.message); setStatus('error') }
  }

  const showResult = food && (status === 'result' || status === 'budget')
  return <main id="main-content" className="food-roll page-container">
    <PageHeading place="Tháp Sao Băng" title="Để vận may chọn món" description="Đặt mức chi tối đa. Sao băng sẽ chọn một món trong ngân sách." onHome={onHome} />
    <div className="roll-layout">
      <aside className="roll-budget"><Landmark name="roll" /><h2>Ngân sách mỗi người</h2><p className="roll-budget__amount">{formatPrice(budget)}</p><p>Giá món được chọn sẽ không vượt mức này.</p>{status !== 'rolling' && <button type="button" className="text-button" onClick={() => setStatus('budget')}><Icon name="coin" />Đổi ngân sách</button>}</aside>
      <section className="roll-stage" aria-label="Kết quả Food Roll" aria-busy={status === 'rolling'}>
        {(status === 'idle' || (status === 'budget' && !food)) && <div className="roll-intro"><Icon name="star" /><h2>Sẵn sàng tìm món?</h2><p>Chọn ngân sách rồi thử vận may của bạn.</p><button type="button" className="button button--primary" onClick={() => setStatus('budget')}><Icon name="star" />Chọn ngân sách và roll</button></div>}
        {status === 'rolling' && <StatusPanel kind="loading" title="Đang gọi sao băng">Đang tìm một món trong ngân sách của bạn.</StatusPanel>}
        {status === 'error' && <><StatusPanel kind="error" title="Chưa thể chọn món" onRetry={() => rollFood()}>{error}</StatusPanel><button type="button" className="text-button" onClick={() => setStatus('budget')}>Đổi ngân sách</button></>}
        {status === 'empty' && <StatusPanel title="Chưa có món trong ngân sách"><p>Không tìm thấy món có giá tối đa {formatPrice(budget)}.</p><button type="button" className="button button--primary" onClick={() => setStatus('budget')}>Tăng ngân sách</button></StatusPanel>}
        {showResult && <div className="roll-result" aria-live="polite"><div className="result-heading"><Icon name="check" /><h2>Món được chọn</h2></div><FoodCard key={food._id} food={food}>{food.description && <p className="roll-result__description">{food.description}</p>}</FoodCard><div className="food-roll__actions"><button type="button" className="button button--primary" onClick={() => rollFood()}><Icon name="refresh" />Roll lại</button><button type="button" className="button button--secondary" onClick={() => setStatus('budget')}>Đổi ngân sách</button></div></div>}
      </section>
    </div>
    {status === 'budget' && <BudgetPanel budget={budget} onChange={setBudget} onCancel={() => setStatus(food ? 'result' : 'idle')} onConfirm={rollFood} />}
  </main>
}
