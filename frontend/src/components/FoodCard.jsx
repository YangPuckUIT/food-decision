import FoodImage from './FoodImage'
import { categoryLabel, formatPrice } from '../foodPresentation'
import './FoodCard.css'

export default function FoodCard({ food, children }) {
  return <article className="food-card">
    <FoodImage food={food} />
    <div className="food-card__body">
      <p className="food-card__category">{categoryLabel(food.category)}</p>
      <h3 className="food-card__name">{food.name}</h3>
      <div className="food-card__summary"><p className="food-card__price">{formatPrice(food.price)}</p>{food.cuisine && <p className="food-card__cuisine">{food.cuisine}</p>}</div>
      {children}
    </div>
  </article>
}
