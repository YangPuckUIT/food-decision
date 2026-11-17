import Icon from '../components/Icon'
import Landmark from '../components/Landmark'
import TownSignboard from '../components/TownSignboard'
import './KingdomMap.css'

const destinations = [
  { key: 'roll', title: 'Tháp Sao Băng', action: 'Food Roll', description: 'Chọn ngân sách, để vận may chọn món.' },
  { key: 'oracle', title: 'Lều Tiên Tri', action: 'Gợi ý theo khẩu vị', description: 'Nhận ba gợi ý cùng lý do phù hợp.' },
  { key: 'group', title: 'Quán Bàn Tròn', action: 'Quyết định nhóm', description: 'Gom món, lọc theo điều kiện của cả nhóm.' },
  { key: 'codex', title: 'Thư Viện Codex', action: 'Khám phá món', description: 'Tìm trong thực đơn và xem từng món.' },
]

export default function KingdomMap({ onNavigate }) {
  return <main id="main-content" className="home page-container">
    <div className="town-layout"><section className="town-choices"><header className="home-heading"><h1 tabIndex="-1" data-page-title>Hôm nay ăn gì?</h1><p>Chọn nhanh một món, tìm theo khẩu vị hoặc cùng bạn bè quyết định.</p></header>
    <section className="kingdom-map" aria-label="Bốn chế độ chọn món">
      <div className="destinations">{destinations.map(({ key, title, action, description }) =>
        <button type="button" key={key} className={`destination destination--${key}`} onClick={() => onNavigate(key)}>
          <Landmark name={key} />
          <span className="destination__title">{title}</span><span className="destination__action">{action}<Icon name="arrow" /></span><span className="destination__description">{description}</span>
        </button>
      )}</div>
    </section></section><div className="town-picture"><TownSignboard /><p>Vương quốc Ăn Gì</p></div></div>
  </main>
}
