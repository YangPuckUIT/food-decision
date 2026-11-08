import { useState } from 'react'
import './FoodPhoto.css'

// Ảnh món (PNG tách nền, kiểu sticker), hoặc khung chờ "Food photo"
// khi món chưa có ảnh / ảnh tải lỗi.
// Kích thước + cỡ chữ do khung cha quyết định (FoodPhoto lấp đầy khung cha).
// Cha nên đặt key={food._id} để đổi món thì state imageError được reset.
function FoodPhoto({ food }) {
  // true khi ảnh tải bị lỗi (sai đường dẫn, file không tồn tại...)
  const [imageError, setImageError] = useState(false)

  if (food.imageUrl && !imageError) {
    return (
      <img
        className="food-photo food-photo--image"
        src={food.imageUrl}
        alt={food.name}
        onError={() => setImageError(true)}
      />
    )
  }

  // aria-hidden: chỉ là hình trang trí, tên món đã có ở tiêu đề bên cạnh
  return (
    <div className="food-photo food-photo--placeholder wob2 boil" aria-hidden="true">
      Food photo
    </div>
  )
}

export default FoodPhoto
