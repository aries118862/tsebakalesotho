import { useEffect } from 'react';
import Icon from './Icon';
import { localizeAttraction, useLanguage } from '../context/LanguageContext';

function AttractionModal({ attraction, onClose, onEnquire }) {
  const { language, t } = useLanguage();
  useEffect(() => {
    if (!attraction) return undefined;

    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('modal-open');
    };
  }, [attraction, onClose]);

  if (!attraction) return null;
  const place = localizeAttraction(attraction, language);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="detail-modal__close" type="button" onClick={onClose} aria-label={t('Close attraction details')}><Icon name="close" /></button>
        <img className="detail-modal__image" src={place.image} alt={t(place.imageAlt)} />
        <div className="detail-modal__body">
          <span className="eyebrow"><Icon name="pin" size={14} />{place.location} <span>·</span> {t(place.category)}</span>
          <h2 id="detail-title">{place.name}</h2>
          <p>{place.description}</p>
          <div className="detail-modal__facts">
            <div><small>{t('ESTIMATED COST')}</small><strong>{attraction.cost} <span>{t('/ person')}</span></strong></div>
            <div><small>{t('TIME TO EXPLORE')}</small><strong>{t(attraction.duration)}</strong></div>
          </div>
          <h3>{t('Make a day of it')}</h3>
          <ul className="activity-list">
            {attraction.activities.map((activity) => <li key={activity}><Icon name="check" size={16} />{t(activity)}</li>)}
          </ul>
          <button className="button button--green detail-modal__cta" type="button" onClick={() => onEnquire(attraction.name)}>
            {t('Plan a visit')} <Icon name="arrow" size={17} />
          </button>
          <span className="modal-note">{t('Costs are estimates. Please confirm locally before you travel.')}</span>
        </div>
      </section>
    </div>
  );
}

export default AttractionModal;
