import { useState } from 'react'
import BudgetPanel from '../components/BudgetPanel'
import FoodCard from '../components/FoodCard'
import PageHeading from '../components/PageHeading'
import StatusPanel from '../components/StatusPanel'
import Landmark from '../components/Landmark'
import Icon from '../components/Icon'
import FoodRollOverlay from '../components/FoodRollOverlay'
import useFoodRoll from '../hooks/useFoodRoll'
import { formatPrice } from '../foodPresentation'
import './FoodRollPage.css'

export default function FoodRollPage({ onHome }) {
  const { status, setStatus, food, error, overlayOpen, skipped, runId, inFlight, roll, skip, finishAnimation, closeOverlay } = useFoodRoll()
  const [budget, setBudget] = useState(50000)
  const rollFood = (nextBudget = budget) => roll(nextBudget)

  const showResult = food && (status === 'result' || status === 'budget')
  const announcement = status === 'result' ? `Món được chọn: ${food.name}, ${formatPrice(food.price)}`
    : { rolling: 'Đang gọi vận may', waiting: 'Đang tìm món' }[status] || ''
  return <main id="main-content" className="food-roll page-container">
    <PageHeading place="Tháp Sao Băng" title="Để vận may chọn món" description="Đặt mức chi tối đa. Sao băng sẽ chọn một món trong ngân sách." onHome={onHome} />
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{overlayOpen ? '' : announcement}</p>
    <div className="roll-layout">
      <aside className="roll-budget"><Landmark name="roll" /><h2>Ngân sách mỗi người</h2><p className="roll-budget__amount">{formatPrice(budget)}</p><p>Giá món được chọn sẽ không vượt mức này.</p><button type="button" className="text-button" disabled={inFlight} onClick={() => setStatus('budget')}><Icon name="coin" />Đổi ngân sách</button></aside>
      <section className="roll-stage" aria-label="Kết quả Food Roll" aria-busy={inFlight}>
        {(overlayOpen || status === 'idle' || (status === 'budget' && !food)) && <div className="roll-intro"><Icon name="star" /><h2>Sẵn sàng tìm món?</h2><p>Chọn ngân sách rồi thử vận may của bạn.</p><button type="button" className="button button--primary" disabled={inFlight || overlayOpen} onClick={() => setStatus('budget')}><Icon name="star" />Chọn ngân sách và roll</button></div>}
        {inFlight && !overlayOpen && <StatusPanel title="Đang tìm món">Yêu cầu đang được xử lý.</StatusPanel>}
        {status === 'error' && !overlayOpen && <><StatusPanel kind="error" title="Chưa thể chọn món" onRetry={() => rollFood()}>{error}</StatusPanel><button type="button" className="text-button" onClick={() => setStatus('budget')}>Đổi ngân sách</button></>}
        {status === 'empty' && !overlayOpen && <StatusPanel title="Chưa có món trong ngân sách"><p>Không tìm thấy món có giá tối đa {formatPrice(budget)}.</p><button type="button" className="button button--primary" onClick={() => setStatus('budget')}>Tăng ngân sách</button></StatusPanel>}
        {showResult && !overlayOpen && <div className="roll-result" data-roll-outcome><div className="result-heading"><Icon name="check" /><h2>Món được chọn</h2></div><FoodCard key={food._id} food={food}>{food.description && <p className="roll-result__description">{food.description}</p>}</FoodCard><div className="food-roll__actions"><button type="button" className="button button--primary" onClick={() => rollFood()}><Icon name="refresh" />Roll lại</button><button type="button" className="button button--secondary" onClick={() => setStatus('budget')}>Đổi ngân sách</button></div></div>}
      </section>
    </div>
    {status === 'budget' && <BudgetPanel budget={budget} onChange={setBudget} onCancel={() => setStatus(food ? 'result' : 'idle')} onConfirm={rollFood} />}
    {overlayOpen && <FoodRollOverlay status={status} food={food} error={error} budget={budget} skipped={skipped} runId={runId} onSkip={skip} onClose={closeOverlay} onComplete={finishAnimation} onRetry={() => rollFood()} />}
  </main>
}
