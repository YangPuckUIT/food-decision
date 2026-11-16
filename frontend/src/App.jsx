import { useEffect, useRef, useState } from 'react'
import FoodRollPage from './pages/FoodRollPage'
import KingdomMap from './pages/KingdomMap'
import Workspace from './pages/Workspace'
import Icon from './components/Icon'
import './MvpApp.css'

const tabs = [
  ['home', 'map', 'Bản đồ'], ['roll', 'star', 'Food Roll'], ['oracle', 'oracle', 'Gợi ý'],
  ['group', 'group', 'Nhóm'], ['codex', 'book', 'Khám phá'],
]

export default function App() {
  const [mode, setMode] = useState('home')
  const pendingNavigation = useRef(false)
  useEffect(() => {
    if (!pendingNavigation.current) return
    pendingNavigation.current = false
    document.querySelector('[data-page-title]')?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [mode])

  function navigate(next) {
    if (next === mode) return
    pendingNavigation.current = true
    setMode(next)
  }

  return <div className="kingdom">
    <a className="skip-link" href="#main-content">Đến nội dung chính</a>
    <header className="site-header"><div className="site-header__inner">
      <a className="brand" href="#ban-do" onClick={event => { event.preventDefault(); navigate('home') }} aria-label="Vương quốc Ăn Gì, về bản đồ"><span className="brand__crest"><Icon name="bowl" /></span><span><span className="brand__overline">Vương quốc</span><span className="brand__name">Ăn Gì</span></span></a>
      <nav aria-label="Chế độ chọn món">{tabs.map(([key, icon, label]) => <button type="button" key={key} aria-current={mode === key ? 'page' : undefined} onClick={() => navigate(key)}><Icon name={icon} /><span>{label}</span></button>)}</nav>
    </div></header>
    {mode === 'home' ? <KingdomMap onNavigate={navigate} /> : mode === 'roll' ? <FoodRollPage onHome={() => navigate('home')} /> : <Workspace key={mode} mode={mode} onHome={() => navigate('home')} />}
    <footer className="site-footer"><Icon name="bowl" /><span>Vương quốc Ăn Gì</span></footer>
  </div>
}
