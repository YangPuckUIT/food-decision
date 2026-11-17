import { categories } from '../foodPresentation'

const PREFIX = 'food-decision:v2:'
const VERSION = 2
const MAX_AGE = 24 * 60 * 60 * 1000
export const text = value => typeof value === 'string' && value.length <= 300
export const budgetDraft = value => (typeof value === 'string' && /^\d{0,6}$/.test(value)) || (Number.isInteger(value) && value >= 0 && value <= 999999)
export const id = value => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)
export const ids = value => Array.isArray(value) && value.length <= 12 && value.every(id) && new Set(value).size === value.length
export const category = value => categories.some(([key]) => value === key)
export const categoryList = value => Array.isArray(value) && value.length <= categories.length && value.every(category) && new Set(value).size === value.length
export const foodValid = value => value && typeof value === 'object' && id(value._id) && text(value.name) && value.name.length > 0 && Number.isSafeInteger(value.price) && value.price >= 0 &&
  category(value.category) && [0, 1, 2].includes(value.spicy) && [1, 2, 3].includes(value.fullness) &&
  ['cuisine', 'description'].every(key => value[key] === undefined || (typeof value[key] === 'string' && value[key].length <= 5000)) &&
  (value.imageUrl === undefined || (typeof value.imageUrl === 'string' && /^(?:$|\/images\/foods\/[a-z0-9.-]+)$/i.test(value.imageUrl))) &&
  ['meal', 'tags'].every(key => value[key] === undefined || (Array.isArray(value[key]) && value[key].every(text))) &&
  (value.calories === undefined || (Number.isFinite(value.calories) && value.calories >= 0))
export const optionalFood = value => value === null || foodValid(value)
const reasonCodes = ['WITHIN_BUDGET', 'CATEGORY_MATCH', 'SPICY_MATCH', 'SPICY_CLOSE', 'FULLNESS_MATCH', 'FULLNESS_CLOSE']
export const recommendationValid = value => Array.isArray(value) && value.length <= 3 && value.every(item => item && foodValid(item.food) && Number.isInteger(item.score) && item.score >= 0 && item.score <= 100 && Array.isArray(item.reasons) && item.reasons.every(reason => reasonCodes.includes(reason)))
export const groupValid = value => value && Array.isArray(value.finalists) && Array.isArray(value.eliminated) && value.finalists.length + value.eliminated.length <= 12 && value.finalists.every(foodValid) && value.eliminated.every(item => item && foodValid(item.food) && ['OVER_BUDGET', 'TOO_SPICY', 'AVOIDED_CATEGORY'].includes(item.reason))
export const snapshotValid = mode => value => value === null || (value && typeof value.input === 'string' && value.input.length < 3000 && (mode === 'oracle' ? recommendationValid(value.data) : groupValid(value.data)))

export function readSession(key, fallback, validate) {
  try {
    const raw = window.sessionStorage.getItem(PREFIX + key)
    if (!raw || raw.length > 500000) return fallback
    const stored = JSON.parse(raw)
    return stored.version === VERSION && Number.isFinite(stored.savedAt) && Date.now() - stored.savedAt >= 0 && Date.now() - stored.savedAt < MAX_AGE && validate(stored.value) ? stored.value : fallback
  } catch { return fallback }
}

export function writeSession(key, value, validate) {
  try {
    if (validate(value)) window.sessionStorage.setItem(PREFIX + key, JSON.stringify({ version: VERSION, savedAt: Date.now(), value }))
  } catch { /* An unavailable browser store must not prevent an interaction. */ }
}
