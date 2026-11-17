import { useEffect, useRef, useState } from 'react'
import useSessionState from './useSessionState'
import { optionalFood, readSession } from '../state/session'
import { getRandomFood } from '../api/foods'

export default function useFoodRoll() {
  const [status, setStatus] = useState(() => readSession('roll:food', null, optionalFood) ? 'result' : 'idle')
  const [food, setFood] = useSessionState('roll:food', null, optionalFood)
  const [error, setError] = useState('')
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const [runId, setRunId] = useState(0)
  const session = useRef(null)
  const active = useRef(false)
  useEffect(() => {
    active.current = true
    return () => { active.current = false; session.current?.controller.abort(); session.current = null }
  }, [])

  function publish(current) {
    if (!active.current || session.current !== current) return
    if (!current.response) { setStatus('waiting'); return }
    if (current.response.data) {
      if (!current.animationDone) return
      setFood(current.response.data)
      setStatus('result')
    } else if (current.response.error.code === 'FOOD_NOT_FOUND') setStatus('empty')
    else { setError(current.response.error.message); setStatus('error') }
  }
  function finishAnimation() {
    const current = session.current
    if (!current || current.animationDone) return
    current.animationDone = true
    publish(current)
  }
  function skip() { setSkipped(true); finishAnimation() }
  function closeOverlay() { finishAnimation(); setOverlayOpen(false) }
  async function roll(budget) {
    if (!active.current || (session.current && (!session.current.response || !session.current.animationDone))) return
    const current = { response: null, animationDone: false, controller: new AbortController() }
    session.current = current
    setRunId(value => value + 1)
    setFood(null); setError(''); setSkipped(false); setStatus('rolling'); setOverlayOpen(true)
    const response = await getRandomFood(budget, { signal: current.controller.signal })
    if (!active.current || session.current !== current) return
    current.response = response
    if (!response.data) current.animationDone = true
    publish(current)
  }
  const inFlight = status === 'rolling' || status === 'waiting'
  return { status, setStatus, food, error, overlayOpen, skipped, runId, inFlight, roll, skip, finishAnimation, closeOverlay }
}
