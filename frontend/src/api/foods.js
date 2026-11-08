// ⚠️ MOCK — chưa gọi Backend thật.
// Sau này thay phần thân hàm bằng:
//   const res = await fetch(`/api/foods/random?maxPrice=${maxPrice}`)
//   return res.json()
// Format trả về giữ y như API thật nên FoodRollPage không phải sửa:
//   thành công: { data: food }
//   không có món (API thật trả 404): { error: { code: 'FOOD_NOT_FOUND', message } }
import { mockFoods } from '../mocks/foods'
import { CATEGORIES } from '../constants/categories'

export async function getRandomFood(maxPrice) {
  const affordable = mockFoods.filter((food) => food.price <= maxPrice)

  if (affordable.length === 0) {
    return {
      error: {
        code: 'FOOD_NOT_FOUND',
        message: 'No food found within the given budget.',
      },
    }
  }

  // Chọn ngẫu nhiên đều: mỗi món có xác suất 1 / affordable.length
  const index = Math.floor(Math.random() * affordable.length)
  return { data: affordable[index] }
}

// ⚠️ MOCK — GET /api/foods. Sau này thay phần thân bằng:
//   const res = await fetch('/api/foods')
//   return res.json()
// Trả về: { data: [food, ...] } — danh sách rỗng vẫn là 200 + mảng rỗng
export async function getFoods() {
  return { data: mockFoods }
}

// ⚠️ MOCK — GET /api/foods/:id. Sau này thay phần thân bằng:
//   const res = await fetch(`/api/foods/${encodeURIComponent(id)}`)
//   return res.json()
// Trả về: { data: food }
//   hoặc (API thật trả 404): { error: { code: 'FOOD_NOT_FOUND', message } }
export async function getFoodById(id) {
  const food = mockFoods.find((item) => item._id === id)

  if (!food) {
    return {
      error: {
        code: 'FOOD_NOT_FOUND',
        message: `No food found with id "${id}".`,
      },
    }
  }

  return { data: food }
}

// ⚠️ MOCK — POST /api/recommendations. Sau này thay phần thân bằng:
//   const res = await fetch('/api/recommendations', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(input),
//   })
//   return res.json()
// input  = { budget, categories, spicy, fullness }
// Trả về: { data: [ { food, score, reasons }, ... ] } (tối đa 3, có thể rỗng)
//   hoặc  { error: { code: 'INVALID_INPUT', message: 'Invalid input: <field>' } }
// Luật chấm điểm (Backend làm y hệt):
//   category 40 · spicy 30 · fullness 30 = tối đa 100
export async function getRecommendations(input) {
  const invalidField = findInvalidField(input)
  if (invalidField) {
    return {
      error: {
        code: 'INVALID_INPUT',
        message: `Invalid input: ${invalidField}`,
      },
    }
  }

  const { budget, categories, spicy, fullness } = input

  const scored = mockFoods
    .filter((food) => food.price <= budget) // bỏ món vượt ngân sách
    .map((food) => {
      const reasons = []

      // Category 40: không chọn gì (= ăn gì cũng được) hoặc chọn đúng -> 40
      let categoryScore = 0
      if (categories.length === 0) {
        categoryScore = 40
      } else if (categories.includes(food.category)) {
        categoryScore = 40
        reasons.push('CATEGORY_MATCH')
      }

      // Spicy / fullness 30: lệch 0 -> 30, lệch 1 -> 15, lệch 2 -> 0
      const spicyGap = Math.abs(food.spicy - spicy)
      const spicyScore = closenessScore(spicyGap)
      if (spicyGap === 0) reasons.push('SPICY_MATCH')
      if (spicyGap === 1) reasons.push('SPICY_CLOSE')

      const fullnessGap = Math.abs(food.fullness - fullness)
      const fullnessScore = closenessScore(fullnessGap)
      if (fullnessGap === 0) reasons.push('FULLNESS_MATCH')
      if (fullnessGap === 1) reasons.push('FULLNESS_CLOSE')

      reasons.push('WITHIN_BUDGET') // còn lại sau bước lọc nên luôn đúng

      return { food, score: categoryScore + spicyScore + fullnessScore, reasons }
    })

  // Điểm giảm dần -> bằng điểm thì giá tăng dần -> vẫn bằng thì tên A→Z
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      a.food.price - b.food.price ||
      a.food.name.localeCompare(b.food.name),
  )

  return { data: scored.slice(0, 3) }
}

// Độ lệch 0 / 1 / 2 -> 30 / 15 / 0 điểm
function closenessScore(gap) {
  if (gap === 0) return 30
  if (gap === 1) return 15
  return 0
}

// Trả về tên field đầu tiên bị sai, hoặc null nếu input hợp lệ
function findInvalidField(input) {
  if (!input || typeof input !== 'object') return 'body'
  const { budget, categories, spicy, fullness } = input

  if (!Number.isInteger(budget) || budget <= 0) return 'budget'
  if (
    !Array.isArray(categories) ||
    !categories.every((category) => CATEGORIES.includes(category))
  ) {
    return 'categories'
  }
  if (![0, 1, 2].includes(spicy)) return 'spicy'
  if (![1, 2, 3].includes(fullness)) return 'fullness'
  return null
}
