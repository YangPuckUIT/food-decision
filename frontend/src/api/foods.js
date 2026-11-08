// ⚠️ MOCK — chưa gọi Backend thật.
// Sau này thay phần thân hàm bằng:
//   const res = await fetch(`/api/foods/random?maxPrice=${maxPrice}`)
//   return res.json()
// Format trả về giữ y như API thật nên FoodRollPage không phải sửa:
//   thành công: { data: food }
//   không có món (API thật trả 404): { error: { code: 'FOOD_NOT_FOUND', message } }
import { mockFoods } from '../mocks/foods'

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
