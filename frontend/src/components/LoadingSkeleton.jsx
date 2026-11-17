import { useEffect, useState } from 'react'

export default function LoadingSkeleton({ kind = 'catalog', title = 'Đang tải thực đơn' }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 180)
    return () => window.clearTimeout(timer)
  }, [])
  return <div className={`loading-shell loading-shell--${kind}`} role="status" aria-live="polite" aria-busy="true"><span className="sr-only">{title}</span>{visible && <div className="skeleton-layout" aria-hidden="true">{Array.from({ length: kind === 'catalog' ? 6 : 1 }, (_, index) => <div className="skeleton-item" key={index}><div className="skeleton-image" /><div className="skeleton-line" /><div className="skeleton-line skeleton-line--short" /></div>)}</div>}</div>
}
