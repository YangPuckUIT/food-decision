import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import Icon from '../components/Icon'
import Landmark from '../components/Landmark'
import KingdomMapScene from '../components/KingdomMapScene'
import { SPOTS } from '../state/kingdomSpots'
import './KingdomMap.css'

const destinations = [
  { key: 'roll', title: 'Tháp Sao Băng', action: 'Food Roll', description: 'Chọn ngân sách, để vận may chọn món.' },
  { key: 'oracle', title: 'Lều Tiên Tri', action: 'Gợi ý theo khẩu vị', description: 'Nhận ba gợi ý cùng lý do phù hợp.' },
  { key: 'group', title: 'Quán Bàn Tròn', action: 'Quyết định nhóm', description: 'Gom món, lọc theo điều kiện của cả nhóm.' },
  { key: 'codex', title: 'Thư Viện Codex', action: 'Khám phá món', description: 'Tìm trong thực đơn và xem từng món.' },
]

export default function KingdomMap({ onNavigate }) {
  const reduced = useReducedMotion()
  const finePointer = useRef(typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 55, damping: 18 })
  const sy = useSpring(my, { stiffness: 55, damping: 18 })
  const farX = useTransform(sx, [-1, 1], [-5, 5])
  const farY = useTransform(sy, [-1, 1], [-4, 4])
  const midX = useTransform(sx, [-1, 1], [-9, 9])
  const midY = useTransform(sy, [-1, 1], [-7, 7])
  const pinX = useTransform(sx, [-1, 1], [-13, 13])
  const pinY = useTransform(sy, [-1, 1], [-10, 10])

  function onPointerMove(event) {
    if (reduced || !finePointer.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    mx.set(((event.clientX - rect.left) / rect.width) * 2 - 1)
    my.set(((event.clientY - rect.top) / rect.height) * 2 - 1)
  }
  function onPointerLeave() { mx.set(0); my.set(0) }

  return <main id="main-content" className="home page-container">
    <header className="home-heading">
      <h1 tabIndex="-1" data-page-title>Hôm nay ăn gì?</h1>
      <p>Chọn nhanh một món, tìm theo khẩu vị hoặc cùng bạn bè quyết định — bốn vùng của vương quốc đang chờ trên bản đồ.</p>
    </header>
    <section className="kingdom-map" aria-label="Bản đồ vương quốc — bốn cách chọn món">
      <div className="map-frame" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        <motion.div className="map-scene" initial={{ opacity: 0, scale: reduced ? 1 : .985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : .5, ease: 'easeOut' }}>
          <KingdomMapScene farX={farX} farY={farY} midX={midX} midY={midY} />
        </motion.div>
        <div className="destinations">
          {destinations.map(({ key, title, action, description }, index) => {
            const spot = SPOTS[key]
            return <motion.button type="button" key={key} className={`destination destination--${key}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, x: reduced ? 0 : pinX, y: reduced ? 0 : pinY }}
              initial={{ opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : .88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={reduced ? { duration: 0 } : { delay: .3 + index * .1, type: 'spring', stiffness: 300, damping: 22 }}
              onClick={() => onNavigate(key)}>
              <span className="destination__pin"><Landmark name={key} /></span>
              <span className="destination__card">
                <span className="destination__title">{title}</span>
                <span className="destination__action">{action}<Icon name="arrow" /></span>
                <span className="destination__description">{description}</span>
              </span>
            </motion.button>
          })}
        </div>
      </div>
    </section>
  </main>
}
