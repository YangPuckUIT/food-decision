import Icon from './Icon'

export default function PageHeading({ place, title, description, onHome }) {
  return <header className="page-heading">
    <button type="button" className="text-button back-link" onClick={onHome}><Icon name="back" />Về bản đồ</button>
    <p className="eyebrow">{place}</p>
    <h1 tabIndex="-1" data-page-title>{title}</h1>
    {description && <p className="page-description">{description}</p>}
  </header>
}
