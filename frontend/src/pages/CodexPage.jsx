import { Link } from 'react-router-dom'

// TẠM: trang Codex Library, sẽ là danh sách món (tìm, lọc, sắp xếp)
function CodexPage() {
  return (
    <main className="page">
      <title>Codex Library · Food Decision</title>
      <h1 className="page__title">Codex Library</h1>
      <p className="page__text">Coming soon.</p>
      <Link to="/" className="link-button wob2">
        Back to the map
      </Link>
    </main>
  )
}

export default CodexPage
