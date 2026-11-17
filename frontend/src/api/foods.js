const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

async function request(path, options = {}) {
  const controller = new AbortController()
  let timedOut = false
  const timer = window.setTimeout(() => { timedOut = true; controller.abort() }, 15000)
  const cancel = () => controller.abort()
  options.signal?.addEventListener('abort', cancel, { once: true })
  if (options.signal?.aborted) cancel()
  try {
    const response = await fetch(`${BASE}/api${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
    const payload = await response.json()
    if (!response.ok) return { error: payload.error || { code: 'REQUEST_FAILED', message: 'Không thể xử lý yêu cầu.' } }
    return payload
  } catch {
    return { error: { code: timedOut ? 'REQUEST_TIMEOUT' : controller.signal.aborted ? 'REQUEST_ABORTED' : 'NETWORK_ERROR', message: timedOut ? 'Máy chủ phản hồi quá lâu. Hãy thử lại.' : controller.signal.aborted ? 'Đã dừng yêu cầu trước.' : 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.' } }
  } finally {
    window.clearTimeout(timer)
    options.signal?.removeEventListener('abort', cancel)
  }
}
export const getRandomFood = (maxPrice, options = {}) => request(`/foods/random?maxPrice=${encodeURIComponent(maxPrice)}`, options)
export const getFoods = (options = {}) => request('/foods', options)
export const getFood = (id, options = {}) => request(`/foods/${encodeURIComponent(id)}`, options)
export const getRecommendations = (input, options = {}) => request('/recommendations', { ...options, method: 'POST', body: JSON.stringify(input) })
export const getGroupDecision = (input, options = {}) => request('/group-decision', { ...options, method: 'POST', body: JSON.stringify(input) })
