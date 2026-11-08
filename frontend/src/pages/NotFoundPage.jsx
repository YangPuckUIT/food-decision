import { Link } from 'react-router-dom'

// Trang 404: hiện khi URL không khớp route nào (path="*")
function NotFoundPage() {
  return (
    <main className="page">
      <title>Not Found · Food Decision</title>
      <h1 className="page__title">This land is not on the map</h1>
      <Link to="/" className="link-button wob2">
        Back to the map
      </Link>
    </main>
  )
}

export default NotFoundPage
