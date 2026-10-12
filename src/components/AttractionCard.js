import Icon from './Icon';
import WeatherCard from './WeatherCard';
import { localizeAttraction, useLanguage } from '../context/LanguageContext';

function AttractionCard({ attraction, onSelect, isSaved, onToggleSaved }) {
  const { language, t } = useLanguage();
  const place = localizeAttraction(attraction, language);

  return (
    <article className="place-card">
      <button className="place-card__image-button" type="button" onClick={() => onSelect(attraction)} aria-label={`${t('Explore destination')} ${place.name}`}>
        <img className="place-card__image" src={place.image} alt={t(place.imageAlt)} loading="lazy" />
        <span className="place-card__category">{t(place.category)}</span>
      </button>
      <button
        className={`save-button${isSaved ? ' save-button--active' : ''}`}
        type="button"
        onClick={() => onToggleSaved(attraction.id)}
        aria-label={`${t(isSaved ? 'Remove' : 'Save')} ${place.name} ${t(isSaved ? 'from favourites' : 'to favourites')}`}
        aria-pressed={isSaved}
      >
        <Icon name="heart" size={19} />
      </button>
      <div className="place-card__content">
        <span className="place-card__location"><Icon name="pin" size={14} />{place.location}</span>
        <h3>{place.name}</h3>
        <p>{place.description}</p>
        <WeatherCard placeId={attraction.id} placeName={place.name} />
        <div className="place-card__bottom">
          <span className="place-card__cost"><small>{t('ENTRY / VISIT')}</small>{attraction.cost}</span>
          <button className="text-link" type="button" onClick={() => onSelect(attraction)} aria-label={`${t('View details for')} ${place.name}`}>
            {t('Explore')} <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default AttractionCard;
