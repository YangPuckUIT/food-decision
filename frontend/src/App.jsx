import FoodCard from './components/FoodCard'
import { mockFoods } from './mocks/foods'

function App() {
  return (
    <main>
      <h1>Food Decision</h1>

      {/* Tạm thời: hiển thị mock data để test FoodCard */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {mockFoods.map((food) => (
          <FoodCard key={food._id} food={food} />
        ))}
      </div>
    </main>
  )
}

export default App
