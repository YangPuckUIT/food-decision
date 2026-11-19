import { useEffect, useRef } from 'react'
import FoodRollPage from './pages/FoodRollPage'
import KingdomMap from './pages/KingdomMap'
import Workspace from './pages/Workspace'
import Icon from './components/Icon'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useLocationSearch, modeFromSearch, updateRoute } from './state/navigation'
import './MvpApp.css'
import './storybook.css'

const tabs = [
  ['home', 'map', 'Bản đồ'], ['roll', 'star', 'Food Roll'], ['oracle', 'oracle', 'Gợi ý'],
  ['group', 'group', 'Nhóm'], ['codex', 'book', 'Khám phá'],
]

export default function App() {
  const search = useLocationSearch()
  const mode = modeFromSearch(search)
  const reduced = useReducedMotion()
  const previousMode = useRef(mode)
  const pendingNavigation = useRef(false)
  useEffect(() => {
    if (previousMode.current === mode) return
    previousMode.current = mode
    pendingNavigation.current = true
    window.scrollTo(0, 0)
  }, [mode])

  function navigate(next) {
    if (next === mode) return
    pendingNavigation.current = true
    updateRoute({ page: next }, { clear: true })
  }

  return <MotionConfig reducedMotion="user"><div className={`kingdom kingdom--${mode}`}>
    <a className="skip-link" href="#main-content">Đến nội dung chính</a>
    <header className="site-header"><div className="site-header__inner">
      <a className="brand" href="#ban-do" onClick={event => { event.preventDefault(); navigate('home') }} aria-label="Vương quốc Ăn Gì, về bản đồ"><span className="brand__crest"><Icon name="crest" /></span><span><span className="brand__overline">Vương quốc</span><span className="brand__name">Ăn Gì</span></span></a>
      <nav aria-label="Chế độ chọn món">{tabs.map(([key, icon, label]) => <button type="button" key={key} aria-current={mode === key ? 'page' : undefined} onClick={() => navigate(key)}><Icon name={icon} /><span>{label}</span></button>)}</nav>
    </div></header>
    <AnimatePresence initial={false} mode="wait"><motion.div key={mode} data-route={mode} className="route-stage" initial={{ opacity: 0, y: reduced ? 0 : 12, scale: reduced ? 1 : .995 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }} onAnimationComplete={() => {
      if (pendingNavigation.current) {
        const title = document.querySelector(`[data-route="${mode}"] [data-page-title]`)
        if (title) { title.focus({ preventScroll: true }); pendingNavigation.current = false }
      }
    }}>
    {mode === 'home' ? <KingdomMap onNavigate={navigate} /> : mode === 'roll' ? <FoodRollPage onHome={() => navigate('home')} /> : <Workspace key={mode} mode={mode} onHome={() => navigate('home')} />}
    </motion.div></AnimatePresence>
    <footer className="site-footer"><Icon name="bowl" /><span>Vương quốc Ăn Gì</span></footer>
  </div></MotionConfig>
}
