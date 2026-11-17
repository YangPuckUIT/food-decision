import Icon from './Icon'

export default function PageHeading({ place, title, description, onHome }) {
  return <header className="page-heading">
    <div className="page-trail"><button type="button" className="text-button back-link" onClick={onHome}><Icon name="back" />Về bản đồ</button>
    <span className="location-label">{place}</span></div>
    <h1 tabIndex="-1" data-page-title>{title}</h1>
    {description && <p className="page-description">{description}</p>}
  </header>
}
