import { useState } from 'react'
import './FoodCard.css'

// Giá trị category trong data -> nhãn hiển thị
const CATEGORY_LABELS = {
  'noodle-soup': 'Noodle Soup',
  rice: 'Rice',
  'fast-food': 'Fast Food',
  'hotpot-grill': 'Hotpot & Grill',
  'street-snack': 'Street Snack',
}

function FoodCard({ food }) {
  // true khi ảnh tải bị lỗi (sai đường dẫn, file không tồn tại...)
  const [imageError, setImageError] = useState(false)

  // Chỉ hiện <img> khi có imageUrl VÀ ảnh chưa bị lỗi
  const showImage = food.imageUrl && !imageError

  // 45000 -> "45,000₫"
  const formattedPrice = food.price.toLocaleString('en-US') + '₫'

  // Category lạ thì hiện nguyên giá trị; không có category thì không hiện
  const categoryLabel = CATEGORY_LABELS[food.category] ?? food.category

  return (
    <article className="food-card wob">
      {showImage ? (
        <img
          className="food-card__image"
          src={food.imageUrl}
          alt={food.name}
          onError={() => setImageError(true)}
        />
      ) : (
        // Khung chờ art: thay cho ảnh khi chưa có hoặc ảnh lỗi
        <div
          className="food-card__placeholder wob2"
          role="img"
          aria-label={food.name}
        >
          Food photo
        </div>
      )}

      {categoryLabel && (
        <p className="food-card__category">{categoryLabel}</p>
      )}
      <h3 className="food-card__name">{food.name}</h3>
      <p className="food-card__price">{formattedPrice}</p>
    </article>
  )
}

export default FoodCard
