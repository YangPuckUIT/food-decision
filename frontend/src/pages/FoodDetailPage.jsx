import { Link, useParams } from 'react-router-dom'

// TẠM: trang chi tiết 1 món trong Codex (/codex/:id)
function FoodDetailPage() {
  // useParams đọc phần động của URL: /codex/abc123 -> { id: 'abc123' }
  const { id } = useParams()

  return (
    <main className="page">
      <title>Codex Entry · Food Decision</title>
      <h1 className="page__title">Codex Entry</h1>
      <p className="page__text">Coming soon: details for entry “{id}”.</p>
      <Link to="/" className="link-button wob2">
        Back to the map
      </Link>
    </main>
  )
}

export default FoodDetailPage
