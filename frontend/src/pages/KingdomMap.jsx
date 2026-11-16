import Icon from '../components/Icon'
import Landmark from '../components/Landmark'
import './KingdomMap.css'

const destinations = [
  { key: 'roll', title: 'Tháp Sao Băng', action: 'Food Roll', description: 'Chọn ngân sách, để vận may chọn món.' },
  { key: 'oracle', title: 'Lều Tiên Tri', action: 'Gợi ý theo khẩu vị', description: 'Nhận ba gợi ý cùng lý do phù hợp.' },
  { key: 'group', title: 'Quán Bàn Tròn', action: 'Quyết định nhóm', description: 'Gom món, lọc theo điều kiện của cả nhóm.' },
  { key: 'codex', title: 'Thư Viện Codex', action: 'Khám phá món', description: 'Tìm trong thực đơn và xem từng món.' },
]

export default function KingdomMap({ onNavigate }) {
  return <main id="main-content" className="home page-container">
    <header className="home-heading"><div><p className="eyebrow">Bản đồ vương quốc</p><h1 tabIndex="-1" data-page-title>Hôm nay,<br /><em>ăn gì đây?</em></h1></div><p>Đi một mình hay cùng bạn bè?<br />Chọn một điểm đến để tìm món cho bữa tiếp theo.</p></header>
    <section className="kingdom-map" aria-label="Bốn chế độ chọn món">
      <div className="map-caption"><span className="eyebrow">Chọn điểm đến</span><Icon name="compass" /></div>
      <svg className="map-terrain" viewBox="0 0 1200 480" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <g className="map-contours"><path d="M-40 100C120 0 180 90 240 20S380 0 420-40M-50 130C80 50 220 120 270 60S430 50 470-30M760 480c30-150 240-60 260-180s130-90 210-150M810 490c20-110 220-30 240-170s90-60 180-130M-40 390c180-90 200 60 330 10s170 70 240 70" /><path d="m720 45 24-28 23 28m-37-12 14 5 11-5M785 72l31-40 33 40m-48-21 15 6 15-6M75 285l-10 18h20l-10-18Zm0 18v12M105 301l-10 18h20l-10-18Zm0 18v12M98 271l-10 18h20l-10-18Zm0 18v12M1080 90l-10 18h20l-10-18Zm0 18v12M1110 110l-10 18h20l-10-18Zm0 18v12" /></g>
        <path className="map-river" d="M-20 425C160 330 250 480 405 380S600 350 670 240 800 200 835 110 1000 85 1060-20" />
        <path className="map-route" d="M180 180C300 90 325 270 465 300S650 140 735 170 910 350 1030 300" />
      </svg>
      <div className="destinations">{destinations.map(({ key, title, action, description }, index) =>
        <button type="button" key={key} className={`destination destination--${key}`} onClick={() => onNavigate(key)}>
          <span className="destination__number">0{index + 1}</span><Landmark name={key} />
          <span className="destination__title">{title}</span><span className="destination__action">{action}<Icon name="arrow" /></span><span className="destination__description">{description}</span>
        </button>
      )}</div>
    </section>
  </main>
}
