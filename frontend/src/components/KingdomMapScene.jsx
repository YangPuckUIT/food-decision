import { motion } from 'motion/react'
import { SPOTS } from '../state/kingdomSpots'

function Pine({ x, y, s = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#2a4a3c" strokeWidth="2" strokeLinejoin="round" fill="#2a4a3c">
    <path d="M0 0 9-16h-18Z" fillOpacity=".9" /><path d="M0-10 11-28h-22Z" fillOpacity=".9" /><path d="M0 0v6" stroke="#6f4f38" fill="none" />
  </g>
}

function House({ x, y, w = 74, roof = '#7f3b3b' }) {
  return <g transform={`translate(${x} ${y})`} stroke="#6f4f38" strokeWidth="2.5" strokeLinejoin="round">
    <path d={`M${-w / 2 - 8} 2 ${w / 2 + 8} 2 ${w / 2} ${-26} ${-w / 2} ${-26}Z`} fill={roof} />
    <rect x={-w / 2} y="2" width={w} height={46} fill="#fbf6ea" />
    <path d={`M${-w / 2} 16h${w}M${-w / 2} 30h${w}M0 2v46M${-w / 2} 2l${w} 46M${w / 2} 2l-${w} 46`} strokeWidth="1.6" />
    <rect x={-10} y="26" width="20" height="22" fill="#2a4a3c" strokeWidth="1.6" />
    <rect x={-w / 4 - 6} y="6" width="12" height="10" fill="#8fa7ac" strokeWidth="1.6" />
  </g>
}

export default function KingdomMapScene({ farX, farY, midX, midY }) {
  return <svg className="map-svg" viewBox="0 0 960 640" role="img" aria-label="Bản đồ vẽ tay vương quốc với bốn địa danh" focusable="false">
    <defs>
      <radialGradient id="paperShade" cx="50%" cy="42%" r="78%">
        <stop offset="0%" stopColor="#faf4e4" /><stop offset="68%" stopColor="#f3ecd6" /><stop offset="100%" stopColor="#e7dcc0" />
      </radialGradient>
    </defs>
    <rect width="960" height="640" fill="url(#paperShade)" />

    {/* Lớp xa: đồi, sông, rừng, làng — parallax nhẹ */}
    <motion.g style={{ x: farX, y: farY }}>
      <g fill="none" stroke="#c9bb99" strokeWidth="2">
        <path d="M60 480q90-64 180-34t200-16" /><path d="M420 150q110-50 220-18" /><path d="M620 560q90-40 190-10" />
        <path d="M120 520q60-30 120-12" /><path d="M330 210q70-34 140-8" />
      </g>
      <path d="M712 30C650 130 770 210 700 310s-150 160-80 300" fill="none" stroke="#7d9aa8" strokeWidth="11" strokeOpacity=".4" strokeLinecap="round" />
      <path d="M712 30C650 130 770 210 700 310s-150 160-80 300" fill="none" stroke="#fbf6ea" strokeWidth="2.5" strokeOpacity=".55" strokeLinecap="round" />
      <g opacity=".92">
        <Pine x={92} y={150} /><Pine x={126} y={132} s={1.15} /><Pine x={160} y={152} /><Pine x={112} y={182} s={.8} /><Pine x={150} y={186} s={.9} />
        <Pine x={820} y={420} s={1.05} /><Pine x={854} y={440} /><Pine x={786} y={446} s={.85} /><Pine x={880} y={404} s={.8} />
        <Pine x={300} y={120} s={.9} /><Pine x={332} y={104} s={1.05} /><Pine x={268} y={100} s={.75} />
      </g>
      <g>
        <House x={430} y={592} roof="#7f3b3b" />
        <House x={516} y={596} w={86} roof="#435d69" />
        <House x={614} y={590} w={64} roof="#6f4f38" />
      </g>
      <ellipse cx="300" cy="560" rx="26" ry="6" fill="#2b2820" opacity=".08" />
    </motion.g>

    {/* Lớp giữa: đường đá cuội nối các vùng */}
    <motion.g style={{ x: midX, y: midY }}>
      <path d="M480 585C380 540 300 500 230 435 180 390 170 250 192 154 320 120 560 110 730 115c30 105 10 225-58 307-52 58-132 118-200 163Z"
        fill="none" stroke="#8a6f4d" strokeWidth="5" strokeLinecap="round" strokeDasharray="0.1 13" />
      {Object.values(SPOTS).map((s, i) => <ellipse key={i} cx={s.x * 9.6} cy={s.y * 6.4} rx="20" ry="7" fill="#2b2820" opacity=".1" />)}
    </motion.g>

    {/* La bàn và khung viền */}
    <g stroke="#6f4f38" fill="none">
      <rect x="16" y="16" width="928" height="608" rx="12" strokeWidth="3" />
      <rect x="30" y="30" width="900" height="580" rx="7" strokeWidth="1.2" opacity=".65" />
      <g transform="translate(858 92)">
        <circle r="36" strokeWidth="2" /><circle r="27" strokeWidth="1" opacity=".7" />
        <path d="M0-32 7 0 0 32-7 0Z" fill="#7f3b3b" stroke="none" /><path d="M-32 0 0-7 32 0 0 7Z" fill="#6f4f38" stroke="none" opacity=".85" />
        <text y="-42" textAnchor="middle" fontSize="15" fill="#6f4f38" stroke="none" fontFamily="var(--font-display), Georgia, serif" fontWeight="700">B</text>
      </g>
      <g fill="#c9a227" stroke="#6f4f38" strokeWidth="1.5">
        <circle cx="30" cy="30" r="7" /><circle cx="930" cy="30" r="7" /><circle cx="30" cy="610" r="7" /><circle cx="930" cy="610" r="7" />
      </g>
      <g>
        <rect x="48" y="44" width="236" height="58" rx="7" fill="#fbf6ea" strokeWidth="2" />
        <text x="166" y="70" textAnchor="middle" fontSize="21" letterSpacing="4" fill="#2a4a3c" stroke="none" fontFamily="var(--font-display), Georgia, serif" fontWeight="700">VƯƠNG QUỐC ĂN GÌ</text>
        <text x="166" y="91" textAnchor="middle" fontSize="12.5" fontStyle="italic" fill="#6d6553" stroke="none" fontFamily="var(--font-display), Georgia, serif">bản đồ vẽ tay của bốn vùng chọn món</text>
      </g>
    </g>
  </svg>
}
