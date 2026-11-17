export const categories = [
  ['noodle-soup', 'Mì & bún'], ['rice', 'Cơm'], ['fast-food', 'Ăn nhanh'],
  ['hotpot-grill', 'Lẩu & nướng'], ['street-snack', 'Ăn vặt'], ['other', 'Khác'],
]
export const categoryLabel = category => categories.find(([key]) => key === category)?.[1] || category || 'Chưa phân loại'
export const formatPrice = value => Number(value).toLocaleString('vi-VN') + 'đ'
export const reasons = {
  CATEGORY_MATCH: 'Đúng loại món yêu thích', SPICY_MATCH: 'Đúng độ cay', SPICY_CLOSE: 'Gần độ cay mong muốn',
  FULLNESS_MATCH: 'Đúng độ no', FULLNESS_CLOSE: 'Gần độ no mong muốn', WITHIN_BUDGET: 'Trong ngân sách',
  OVER_BUDGET: 'Vượt ngân sách', TOO_SPICY: 'Quá cay', AVOIDED_CATEGORY: 'Thuộc loại món cần tránh',
}
export const ready = food => categories.some(([key]) => key === food.category) && [0, 1, 2].includes(food.spicy) &&
  [1, 2, 3].includes(food.fullness) && Number.isSafeInteger(food.price) && food.price >= 0
export const toggle = (items, item) => items.includes(item) ? items.filter(value => value !== item) : [...items, item]
