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
