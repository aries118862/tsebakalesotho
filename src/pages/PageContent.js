import AttractionCard from '../components/AttractionCard';
import AnimatedMetric from '../components/AnimatedMetric';
import EnquiryForm from '../components/EnquiryForm';
import Icon from '../components/Icon';
import { attractions, categories } from '../models/attractions';
import { useLanguage } from '../context/LanguageContext';

function PageTitle({ kicker, title, description }) {
  const { t } = useLanguage();
  return (
    <section className="page-title section-wrap">
      <span className="eyebrow">{t(kicker)}</span>
      <h1>{title}</h1>
      <p>{t(description)}</p>
    </section>
  );
}

function DestinationsPage({ category, search, setCategory, setSearch, setShowSavedOnly, showSavedOnly, visibleAttractions, savedAttractionIds, toggleSavedAttraction, openAttraction }) {
  const { t } = useLanguage();
  return (
    <>
      <PageTitle kicker="THE GOOD PLACES" title={<>{t('Find your')} <em>{t('somewhere.')}</em></>} description="From high mountain passes to quiet villages, discover the places that make Lesotho unforgettable." />
      <section className="destinations-section section-wrap page-section">
        <div className="browse-toolbar">
          <div className="filter-tabs" aria-label={t('Filter destinations by category')}>
            {categories.map((item) => <button key={item} className={`filter-tab${category === item ? ' filter-tab--active' : ''}`} type="button" onClick={() => setCategory(item)} aria-pressed={category === item}>{t(item)}</button>)}
          </div>
          <div className="browse-controls">
            <label className="search-box"><Icon name="search" size={18} /><input type="search" aria-label={t('Search destinations by name or location')} placeholder={t('Find a place...')} value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            <button className={`saved-filter${showSavedOnly ? ' saved-filter--active' : ''}`} type="button" onClick={() => setShowSavedOnly((current) => !current)} aria-pressed={showSavedOnly}><Icon name="heart" size={17} /> {t('Saved')} <span>{savedAttractionIds.length}</span></button>
          </div>
        </div>
        <div className="results-caption"><span>{visibleAttractions.length} {t(visibleAttractions.length === 1 ? 'place' : 'places')} {t('to fall for')}</span><span>{t('LESOTHO, AFRICA')} <Icon name="pin" size={13} /></span></div>
        {visibleAttractions.length > 0 ? (
          <div className="places-grid">
            {visibleAttractions.map((attraction) => <AttractionCard key={attraction.id} attraction={attraction} onSelect={openAttraction} isSaved={savedAttractionIds.includes(attraction.id)} onToggleSaved={toggleSavedAttraction} />)}
          </div>
        ) : (
          <div className="empty-results">
            <span className="empty-results__icon"><Icon name={showSavedOnly ? 'heart' : 'mountain'} size={23} /></span>
            <h3>{t(showSavedOnly && savedAttractionIds.length === 0 ? 'Your travel wish list is waiting.' : 'Nothing on this trail just yet.')}</h3>
            <p>{t(showSavedOnly && savedAttractionIds.length === 0 ? 'Tap the heart on a destination to keep it close.' : 'Try another search or choose a different category.')}</p>
            <button type="button" className="text-link" onClick={() => { setSearch(''); setCategory('All places'); setShowSavedOnly(false); }}>{t('See all places')} <Icon name="arrow" size={16} /></button>
          </div>
        )}
      </section>
    </>
  );
}

function ExperiencesPage({ openAttraction, savedAttractionIds, toggleSavedAttraction }) {
  const { t } = useLanguage();
  const experiences = attractions.filter((attraction) => attraction.category !== 'Culture');
  return (
    <>
      <PageTitle kicker="MAKE IT YOURS" title={<>{t('Take the')} <em>{t('scenic route.')}</em></>} description="Choose your own pace: ride the mountain roads, chase waterfalls, or find a quieter trail into the highlands." />
      <section className="section-wrap page-section">
        <div className="places-grid">
          {experiences.map((attraction) => <AttractionCard key={attraction.id} attraction={attraction} onSelect={openAttraction} isSaved={savedAttractionIds.includes(attraction.id)} onToggleSaved={toggleSavedAttraction} />)}
        </div>
      </section>
      <section className="experience-bar section-wrap">
        <span className="eyebrow">{t('A DIFFERENT KIND OF ADVENTURE')}</span>
        <div className="experience-bar__grid">
          <div><span className="experience-icon"><Icon name="mountain" /></span><span><strong>{t('High-altitude adventures')}</strong><small>{t('More mountain, less ordinary.')}</small></span></div>
          <div><span className="experience-icon"><Icon name="leaf" /></span><span><strong>{t('Wide-open nature')}</strong><small>{t('Find your own kind of quiet.')}</small></span></div>
          <div><span className="experience-icon"><Icon name="globe" /></span><span><strong>{t('Culture & connection')}</strong><small>{t('Come curious. Leave closer.')}</small></span></div>
          <div><span className="experience-icon"><Icon name="sun" /></span><span><strong>{t('A season for everyone')}</strong><small>{t('Every visit has its moment.')}</small></span></div>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageTitle kicker="A SMALL COUNTRY WITH A BIG SOUL" title={<>{t('Meet the Mountain')} <em>{t('Kingdom.')}</em></>} description="Lesotho is a kingdom in the clouds, wrapped entirely in South Africa and rising high into the sky." />
      <section className="intro-section section-wrap page-section">
        <div className="intro-section__top">
          <span className="eyebrow">{t('ROOTED IN THE HIGHLANDS')}</span>
          <h2>{t('One country.')}<br /><em>{t('A whole new altitude.')}</em></h2>
        </div>
        <div className="intro-section__body">
          <span className="intro-section__number">01 <span>—</span> 04</span>
          <div><p>{t('Meet Lesotho: a kingdom in the clouds, wrapped entirely in South Africa and rising high into the sky. This is a place of wide-open horizons, Basotho hospitality and adventures that are anything but ordinary.')}</p></div>
        </div>
        <div className="intro-stats">
          <div><AnimatedMetric value={2161} suffix="m" /><small>{t('ABOVE SEA LEVEL, ALWAYS')}</small></div>
          <div><AnimatedMetric value={1000} suffix="s" /><small>{t('OF STORIES TO TAKE HOME')}</small></div>
          <div><AnimatedMetric value={4} suffix="×" /><small>{t('SEASONS OF ADVENTURE')}</small></div>
          <div className="intro-stats__note"><Icon name="sun" size={20} /><span>{t('One country.')}<br />{t('A whole new altitude.')}</span></div>
        </div>
      </section>
      <section className="culture-strip">
        <div className="culture-strip__image"><img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85" alt="African highlands beneath a wide open sky" loading="lazy" /></div>
        <div className="culture-strip__content">
          <span className="eyebrow eyebrow--light">{t('MORE THAN A MOUNTAIN')}</span>
          <h2>{t('Come for the view.')}<br /><em>{t('Stay for the welcome.')}</em></h2>
          <p>{t('Here, a journey is measured in stories shared, a warm blanket after sunset, and one more cup of tea. The Basotho way isn’t just something to see. It’s something you feel.')}</p>
        </div>
      </section>
    </>
  );
}

function PageContent(props) {
  if (props.page === '/destinations') return <DestinationsPage {...props} />;
  if (props.page === '/experiences') return <ExperiencesPage {...props} />;
  if (props.page === '/about') return <AboutPage />;
  return <EnquiryForm selectedDestination={props.selectedDestination} revealKey={props.enquiryRevealKey} />;
}

export default PageContent;
