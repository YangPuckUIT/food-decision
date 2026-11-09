const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE}/api${path}`, {
      ...options,
      signal: AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
    const payload = await response.json()
    if (!response.ok) return { error: payload.error || { code: 'REQUEST_FAILED', message: 'Không thể xử lý yêu cầu.' } }
    return payload
  } catch {
    return { error: { code: 'NETWORK_ERROR', message: 'Không kết nối được máy chủ. Kiểm tra backend rồi thử lại.' } }
  }
}
export const getRandomFood = maxPrice => request(`/foods/random?maxPrice=${encodeURIComponent(maxPrice)}`)
export const getFoods = () => request('/foods')
export const getFood = id => request(`/foods/${encodeURIComponent(id)}`)
export const getRecommendations = input => request('/recommendations', { method: 'POST', body: JSON.stringify(input) })
export const getGroupDecision = input => request('/group-decision', { method: 'POST', body: JSON.stringify(input) })
