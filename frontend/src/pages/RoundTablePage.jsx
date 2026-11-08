import { Link } from 'react-router-dom'

// TẠM: Round Table Inn, sẽ là chế độ quyết định theo nhóm
function RoundTablePage() {
  return (
    <main className="page">
      <title>Round Table Inn · Food Decision</title>
      <h1 className="page__title">Round Table Inn</h1>
      <p className="page__text">Coming soon.</p>
      <Link to="/" className="link-button wob2">
        Back to the map
      </Link>
    </main>
  )
}

export default RoundTablePage
