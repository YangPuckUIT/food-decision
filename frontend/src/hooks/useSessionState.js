import { useCallback, useRef, useState } from 'react'
import { readSession, writeSession } from '../state/session'

export default function useSessionState(key, fallback, validate, override) {
  const [value, setValue] = useState(() => override !== undefined && validate(override) ? override : readSession(key, fallback, validate))
  const latest = useRef(value)
  const set = useCallback(action => {
    const next = typeof action === 'function' ? action(latest.current) : action
    latest.current = next
    writeSession(key, next, validate)
    setValue(next)
  }, [key, validate])
  return [value, set]
}
