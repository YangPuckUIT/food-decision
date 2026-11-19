import { useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig, motion, useAnimate, useReducedMotion } from 'motion/react'
import Dialog from './Dialog'
import FoodCard from './FoodCard'
import StatusPanel from './StatusPanel'
import Icon from './Icon'
import { formatPrice } from '../foodPresentation'
import './FoodRollOverlay.css'

// Bầu trời sao cố định (seeded) để không vẽ lại mỗi khung hình.
const STARS = Array.from({ length: 46 }, (_, i) => {
  const a = Math.sin(i * 127.1 + 311.7) * 43758.5453
  const b = Math.sin(i * 269.5 + 183.3) * 28001.8384
  return { x: (a - Math.floor(a)) * 800, y: (b - Math.floor(b)) * 460, r: 0.7 + ((a * 7) % 1.4), o: 0.35 + ((b * 13) % 0.55) }
})

function SummoningScene({ onComplete, reduced }) {
  const [scope, animate] = useAnimate()
  const complete = useRef(onComplete)
  useEffect(() => { complete.current = onComplete }, [onComplete])
  useEffect(() => {
    let mounted = true
    if (reduced) { complete.current(); return }
    const playback = animate([
      ['.summon-stars', { opacity: [0, 1] }, { duration: .8 }],
      ['.summon-ring--outer', { rotate: [0, 360] }, { duration: 2.6, ease: 'linear' }],
      ['.summon-ring--inner', { rotate: [360, 0] }, { at: 0, duration: 2.6, ease: 'linear' }],
      ['.summon-emblem', { opacity: [0, 1], scale: [.8, 1] }, { at: .15, duration: .5, ease: 'easeOut' }],
      ['.summon-traveler', { x: ['-30vw', '30vw'], y: [-70, 70], opacity: [0, 1, 1, 0] }, { at: .6, duration: 1.4, ease: [.22, .55, .32, 1] }],
      ['.summon-wash', { opacity: [0, .16, 0] }, { at: 2.0, duration: .5 }],
    ])
    playback.then(() => { if (mounted) complete.current() })
    return () => { mounted = false; playback.stop() }
  }, [animate, reduced])
  return <div ref={scope} className="summon-scene" aria-hidden="true">
    <svg className="summon-stars" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice">
      {STARS.map((star, i) => <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#f2ead8" opacity={star.o} />)}
    </svg>
    <div className="summon-ring summon-ring--outer" />
    <div className="summon-ring summon-ring--inner" />
    <div className="summon-emblem"><Icon name="crest" /></div>
    <div className="summon-traveler"><span /><Icon name="star" /></div>
    <div className="summon-wash" />
  </div>
}

export default function FoodRollOverlay({ status, food, error, budget, skipped, runId, onSkip, onClose, onComplete, onRetry }) {
  const reduced = useReducedMotion()
  const pending = status === 'rolling' || status === 'waiting'
  const outcome = useRef(null)
  const message = status === 'result' ? `Món được chọn: ${food.name}, ${formatPrice(food.price)}` : status === 'error' ? error : status === 'empty' ? 'Chưa có món trong ngân sách' : status === 'waiting' ? 'Đang tìm món' : 'Đang gọi vận may'
  return <MotionConfig reducedMotion="user"><Dialog title="Food Roll" titleId="roll-overlay-title" onClose={onClose} className="roll-overlay">
    {pending && <button type="button" className="button button--secondary roll-overlay__skip" onClick={onSkip} aria-pressed={skipped} aria-label="Skip">Skip</button>}
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{message}</p>
    <motion.div className="roll-overlay__body" initial={{ opacity: 0, scale: reduced ? 1 : .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : .2 }}>
      <AnimatePresence initial={false} mode="wait">
        {pending ? <motion.section key={`scene-${runId}`} className="roll-overlay__scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: skipped || reduced ? 0 : .12 }} aria-busy="true">
          {status === 'rolling' && !skipped ? <SummoningScene onComplete={onComplete} reduced={reduced} /> : <div className="summon-scene summon-scene--waiting" aria-hidden="true"><Icon name="crest" /></div>}
          <div className="roll-overlay__caption"><p className="eyebrow">Tháp Sao Băng</p><h2>{status === 'waiting' ? 'Đang tìm món' : 'Đang gọi vận may'}</h2><p>Ngân sách {formatPrice(budget)}</p></div>
        </motion.section> : <motion.section key={`outcome-${runId}`} ref={outcome} tabIndex={-1} className="roll-overlay__outcome" layout="position" initial={{ opacity: 0, scale: skipped || reduced ? 1 : .96 }} animate={{ opacity: 1, scale: 1 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }} onAnimationComplete={() => outcome.current?.focus({ preventScroll: true })}>
          {status === 'result' && <><div className="result-heading"><Icon name="check" /><h2>Món được chọn</h2></div><div className="roll-result"><FoodCard food={food}>{food.description && <p className="roll-result__description">{food.description}</p>}</FoodCard></div></>}
          {status === 'error' && <StatusPanel kind="error" title="Chưa thể chọn món">{error}</StatusPanel>}
          {status === 'empty' && <StatusPanel title="Chưa có món trong ngân sách">Không tìm thấy món có giá tối đa {formatPrice(budget)}.</StatusPanel>}
          <div className="food-roll__actions"><button type="button" className="button button--primary" onClick={onRetry}><Icon name="refresh" />{status === 'result' ? 'Roll lại' : 'Thử lại'}</button><button type="button" className="button button--secondary" onClick={onClose}>Đóng kết quả</button></div>
        </motion.section>}
      </AnimatePresence>
    </motion.div>
  </Dialog></MotionConfig>
}
