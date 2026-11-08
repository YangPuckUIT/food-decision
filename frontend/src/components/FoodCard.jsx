import FoodPhoto from './FoodPhoto'
import { CATEGORY_LABELS } from '../constants/categories'
import { formatPrice } from '../utils/formatPrice'
import './FoodCard.css'

function FoodCard({ food }) {
  // Category lạ thì hiện nguyên giá trị; không có category thì không hiện
  const categoryLabel = CATEGORY_LABELS[food.category] ?? food.category

  return (
    <article className="food-card wob">
      {/* Khung cố định kích thước; FoodPhoto lấp đầy khung này */}
      <div className="food-card__photo">
        <FoodPhoto food={food} />
      </div>

      {categoryLabel && (
        <p className="food-card__category">{categoryLabel}</p>
      )}
      <h3 className="food-card__name">{food.name}</h3>
      <p className="food-card__price">{formatPrice(food.price)}</p>
    </article>
  )
}

export default FoodCard
