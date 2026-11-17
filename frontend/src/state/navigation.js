import { useSyncExternalStore } from 'react'

const MODES = ['home', 'roll', 'codex', 'oracle', 'group']
const subscribe = callback => {
  window.addEventListener('popstate', callback)
  window.addEventListener('food-route', callback)
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener('food-route', callback) }
}
export function useLocationSearch() { return useSyncExternalStore(subscribe, () => window.location.search, () => '') }
export function modeFromSearch(search) {
  const mode = new URLSearchParams(search).get('page')
  return MODES.includes(mode) ? mode : 'home'
}
export function updateRoute(values, { replace = false, clear = false } = {}) {
  const url = new URL(window.location.href)
  if (clear) url.search = ''
  for (const [key, value] of Object.entries(values)) {
    if (value === null) url.searchParams.delete(key)
    else url.searchParams.set(key, value)
  }
  try { window.history[replace ? 'replaceState' : 'pushState']({}, '', url) } catch { return }
  window.dispatchEvent(new Event('food-route'))
}
