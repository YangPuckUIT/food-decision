import { Link } from 'react-router-dom'
import './MapPage.css'

// TẠM: 4 thẻ địa điểm. Sau thay bằng ảnh bản đồ vẽ tay + 4 công trình bấm được.
const PLACES = [
  {
    path: '/gacha',
    name: 'Shooting Star Tower',
    description: 'Set a budget and let a falling star pick your meal.',
  },
  {
    path: '/codex',
    name: 'Codex Library',
    description: 'Browse every food creature in the kingdom.',
  },
  {
    path: '/oracle',
    name: "Oracle's Tent",
    description: 'Answer four questions and hear the top three picks.',
  },
  {
    path: '/round-table',
    name: 'Round Table Inn',
    description: 'Bring your group, list the options, crown one winner.',
  },
]

function MapPage() {
  return (
    <main className="map">
      {/* React 19: <title> viết ở đâu cũng được, React tự đưa lên <head> */}
      <title>Map · Food Decision</title>

      <h1 className="map__title">The Food Kingdom</h1>

      <ul className="map__places">
        {PLACES.map((place, index) => (
          <li key={place.path}>
            {/* Link: đổi URL mà KHÔNG tải lại trang. Xen kẽ wob/wob2 cho tự nhiên */}
            <Link
              to={place.path}
              className={'map__place ' + (index % 2 === 0 ? 'wob' : 'wob2')}
            >
              <span className="map__place-name">{place.name}</span>
              <span className="map__place-text">{place.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default MapPage
