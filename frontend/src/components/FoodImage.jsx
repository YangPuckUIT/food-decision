import { useState } from 'react'
import Icon from './Icon'

export default function FoodImage({ food, className = '' }) {
  const [failedUrl, setFailedUrl] = useState(null)
  return food.imageUrl && failedUrl !== food.imageUrl
    ? <img className={`food-image ${className}`} src={food.imageUrl} alt={food.name} loading="lazy" onError={() => setFailedUrl(food.imageUrl)} />
    : <div className={`food-image food-image--empty ${className}`} role="img" aria-label={`${food.name}, chưa có ảnh`}><Icon name="bowl" /><span>Chưa có ảnh món</span></div>
}
