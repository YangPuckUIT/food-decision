import { useState } from 'react'
import './FoodCard.css'

function FoodCard({ food }) {
  // true khi ảnh tải bị lỗi (sai đường dẫn, file không tồn tại...)
  const [imageError, setImageError] = useState(false)

  // Chỉ hiện <img> khi có imageUrl VÀ ảnh chưa bị lỗi
  const showImage = food.imageUrl && !imageError

  // 45000 -> "45.000đ"
  const formattedPrice = food.price.toLocaleString('vi-VN') + 'đ'

  return (
    <article className="food-card">
      {showImage ? (
        <img
          className="food-card__image"
          src={food.imageUrl}
          alt={food.name}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="food-card__image food-card__image--placeholder"
          role="img"
          aria-label={food.name}
        />
      )}

      <div className="food-card__body">
        <p className="food-card__cuisine">{food.cuisine}</p>
        <h3 className="food-card__name">{food.name}</h3>
        <p className="food-card__price">{formattedPrice}</p>
      </div>
    </article>
  )
}

export default FoodCard
