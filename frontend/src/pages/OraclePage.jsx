import { Link } from 'react-router-dom'

// TẠM: Oracle's Tent, sẽ là form 4 câu -> top 3 gợi ý
function OraclePage() {
  return (
    <main className="page">
      <title>Oracle's Tent · Food Decision</title>
      <h1 className="page__title">Oracle's Tent</h1>
      <p className="page__text">Coming soon.</p>
      <Link to="/" className="link-button wob2">
        Back to the map
      </Link>
    </main>
  )
}

export default OraclePage
