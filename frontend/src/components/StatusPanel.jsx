import Icon from './Icon'

export default function StatusPanel({ title, children, kind = 'empty', onRetry }) {
  return <section className={`status-panel status-panel--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
    <Icon name={kind === 'error' ? 'warning' : kind === 'loading' ? 'refresh' : 'bowl'} className={kind === 'loading' ? 'is-loading' : ''} />
    <div><h2>{title}</h2>{children && <div className="status-panel__description">{children}</div>}{onRetry && <button type="button" className="button button--secondary" onClick={onRetry}><Icon name="refresh" />Thử lại</button>}</div>
  </section>
}
