import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { motion, useReducedMotion } from 'motion/react'

export default function Dialog({ title, titleId, onClose, className = '', children }) {
  const ref = useRef(null)
  const [closing, setClosing] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    const dialog = ref.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    dialog.querySelector('[data-autofocus]')?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [])

  function containFocus(event) {
    if (event.key !== 'Tab') return
    const controls = [...ref.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')]
      .filter(element => element.getClientRects().length)
    const first = controls[0]
    const last = controls.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }

  return <motion.dialog ref={ref} initial={{ opacity: 0, scale: reduced ? 1 : .985 }} animate={{ opacity: closing ? 0 : 1, scale: reduced ? 1 : closing ? .985 : 1 }} transition={{ duration: reduced ? 0 : closing ? .1 : .18 }} onAnimationComplete={() => { if (closing) onClose() }} className={`dialog ${className}`} aria-labelledby={titleId} onKeyDown={containFocus} onCancel={event => { event.preventDefault(); setClosing(true) }}>
    <div className="dialog-heading"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" aria-label="Đóng" onClick={() => setClosing(true)}><Icon name="close" /></button></div>
    {children}
  </motion.dialog>
}
