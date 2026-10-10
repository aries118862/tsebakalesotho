import { useEffect, useState } from 'react';
import AttractionCard from './components/AttractionCard';
import AttractionModal from './components/AttractionModal';
import AnimatedMetric from './components/AnimatedMetric';
import EnquiryForm from './components/EnquiryForm';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import Icon from './components/Icon';
import useTourismController from './controllers/useTourismController';
import { attractions, categories, findAttractionById } from './models/attractions';
import PageContent from './pages/PageContent';
import { LanguageProvider, localizeAttraction, useLanguage } from './context/LanguageContext';
import './App.css';

function App() {
  return <LanguageProvider><AppContent /></LanguageProvider>;
}

function AppContent() {
  const { language, t } = useLanguage();
  const [showAllHomePlaces, setShowAllHomePlaces] = useState(false);
  const [enquiryRevealKey, setEnquiryRevealKey] = useState(0);
  const getPage = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return ['/', '/destinations', '/experiences', '/about', '/plan'].includes(path)
      ? path
      : '/';
  };
  const [page, setPage] = useState(getPage);
  const {
    category,
    closeAttraction,
    mobileMenuOpen,
    openAttraction,
    planVisit,
    savedAttractionIds,
    search,
    selectedAttraction,
    selectedDestination,
    setCategory,
    setMobileMenuOpen,
    setSearch,
    setShowSavedOnly,
    showSavedOnly,
    toggleSavedAttraction,
    visibleAttractions,
  } = useTourismController();

  useEffect(() => {
    const handlePopState = () => setPage(getPage());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(path) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    if (path === '/plan') setEnquiryRevealKey((current) => current + 1);
    setPage(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleEnquiryLinkClick(event) {
    if (event.target.closest?.('a[href="#enquire"]')) {
      setEnquiryRevealKey((current) => current + 1);
    }
  }

  const saniPass = localizeAttraction(findAttractionById('sani-pass'), language);
  const maletsunyaneFalls = localizeAttraction(findAttractionById('maletsunyane-falls'), language);
  const thabaBosiu = localizeAttraction(findAttractionById('thaba-bosiu'), language);
  const homeAttractions = showAllHomePlaces ? visibleAttractions : visibleAttractions.slice(0, 4);

  function handlePlanVisit(destination) {
    const originalDestination = attractions.find((attraction) => (
      attraction.name === destination || localizeAttraction(attraction, language).name === destination
    ));
    planVisit(originalDestination ? originalDestination.name : destination);
    navigate('/plan');
  }

  return (
    <div className="site-shell" onClickCapture={handleEnquiryLinkClick}>
      <SiteHeader page={page} mobileMenuOpen={mobileMenuOpen} onNavigate={navigate} onToggleMenu={() => setMobileMenuOpen((open) => !open)} search={search} onSearchChange={setSearch} />

      <main>{page === '/' ? <>
        <section className="hero" id="home">
          <img className="hero__image" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=90" alt={t('Sunlit mountain range disappearing into the clouds')} />
          <div className="hero__overlay" />
          <div className="hero__content">
            <h1 className="hero-typewriter hero-typewriter--title">{t('Find your own way.')}</h1>
            <p className="hero-typewriter hero-typewriter--copy">{t('Up where the air feels different, the welcome is warmer, and the stories stay with you.')}</p>
            <div className="hero__actions">
              <a className="button button--gold" href="#destinations">{t('Find your somewhere')} <Icon name="arrow" size={17} /></a>
              <a className="hero__discover" href="#about"><span className="hero__play">↓</span>{t('Get to know Lesotho')}</a>
            </div>
          </div>
        </section>

        <section className="intro-section section-wrap" id="about">
          <div className="intro-section__top">
            <span className="eyebrow"><span className="eyebrow__dash" /> {t('A SMALL COUNTRY WITH A BIG SOUL')}</span>
            <h2>{t('Some places you visit.')}<br /><em>{t('Some get under your skin.')}</em></h2>
          </div>
          <div className="intro-section__body">
            <span className="intro-section__number">01 <span>—</span> 04</span>
            <div>
              <p>{t('Meet Lesotho: a kingdom in the clouds, wrapped entirely in South Africa and rising high into the sky. This is a place of wide-open horizons, Basotho hospitality and adventures that are anything but ordinary.')}</p>
              <a className="text-link text-link--underlined" href="#experiences">{t('A different kind of escape')} <Icon name="arrow" size={16} /></a>
            </div>
          </div>
          <div className="intro-stats">
            <div><AnimatedMetric value={2161} suffix="m" /><small>{t('ABOVE SEA LEVEL, ALWAYS')}</small></div>
            <div><AnimatedMetric value={1000} suffix="s" /><small>{t('OF STORIES TO TAKE HOME')}</small></div>
            <div><AnimatedMetric value={4} suffix="×" /><small>{t('SEASONS OF ADVENTURE')}</small></div>
            <div className="intro-stats__note"><Icon name="sun" size={20} /><span>{t('One country.')}<br />{t('A whole new altitude.')}</span></div>
          </div>
        </section>

        <section className="featured-section" id="experiences">
          <div className="section-wrap">
            <div className="section-heading">
              <div><span className="eyebrow"><span className="eyebrow__dash" /> {t('A LITTLE OF EVERYTHING')}</span><h2>{t('Take the')} <em>{t('scenic route.')}</em></h2></div>
              <p>{t('Pick a path. Follow a feeling.')}<br />{t('There’s no wrong way to get lost here.')}</p>
            </div>
            <div className="feature-layout">
              <button className="feature-main" type="button" onClick={() => openAttraction(saniPass)}>
                <img src={saniPass.image} alt={saniPass.imageAlt} loading="lazy" />
                <span className="feature-main__scrim" />
                <span className="feature-main__top"><span>{t('THE ROAD LESS TRAVELLED')}</span><span>01 / 04</span></span>
                <span className="feature-main__bottom"><span><small>{t('MOKHOTLONG DISTRICT')}</small><strong>Sani Pass <Icon name="arrow" size={19} /></strong></span><span className="feature-main__round-arrow"><Icon name="arrow" size={20} /></span></span>
              </button>
              <div className="feature-side">
                <button className="feature-small" type="button" onClick={() => openAttraction(maletsunyaneFalls)}>
                  <img src={maletsunyaneFalls.image} alt={maletsunyaneFalls.imageAlt} loading="lazy" />
                  <span className="feature-small__shade" />
                  <span className="feature-small__copy"><small>{t('CHASING WATERFALLS')}</small><strong>Maletsunyane Falls <Icon name="arrow" size={17} /></strong></span>
                </button>
                <button className="feature-small" type="button" onClick={() => openAttraction(thabaBosiu)}>
                  <img src={thabaBosiu.image} alt={thabaBosiu.imageAlt} loading="lazy" />
                  <span className="feature-small__shade" />
                  <span className="feature-small__copy"><small>{t('ROOTED IN HISTORY')}</small><strong>Thaba Bosiu <Icon name="arrow" size={17} /></strong></span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="destinations-section section-wrap" id="destinations">
          <div className="section-heading destinations-heading">
            <div><span className="eyebrow"><span className="eyebrow__dash" /> {t('THE GOOD PLACES')}</span><h2>{t('Find your')} <em>{t('somewhere.')}</em></h2></div>
            <p>{t('Big views, little villages, stories carved')}<br className="desktop-break" /> {t('in stone. It’s all waiting up here.')}</p>
          </div>
          <div className="browse-toolbar">
            <div className="filter-tabs" aria-label={t('Filter destinations by category')}>
              {categories.map((item) => <button key={item} className={`filter-tab${category === item ? ' filter-tab--active' : ''}`} type="button" onClick={() => setCategory(item)} aria-pressed={category === item}>{t(item)}</button>)}
            </div>
            <div className="browse-controls">
              <label className="search-box"><Icon name="search" size={18} /><input type="search" aria-label={t('Search destinations by name or location')} placeholder={t('Find a place...')} value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌕</kbd></label>
              <button className={`saved-filter${showSavedOnly ? ' saved-filter--active' : ''}`} type="button" onClick={() => setShowSavedOnly((current) => !current)} aria-pressed={showSavedOnly}><Icon name="heart" size={17} /> {t('Saved')} <span>{savedAttractionIds.length}</span></button>
            </div>
          </div>
          <div className="results-caption"><span>{homeAttractions.length} {t(homeAttractions.length === 1 ? 'place' : 'places')} {t('to fall for')}</span><span>{t('LESOTHO, AFRICA')} <Icon name="pin" size={13} /></span></div>
          {homeAttractions.length > 0 ? (
            <div className="places-grid">
              {homeAttractions.map((attraction) => <AttractionCard key={attraction.id} attraction={attraction} onSelect={openAttraction} isSaved={savedAttractionIds.includes(attraction.id)} onToggleSaved={toggleSavedAttraction} />)}
            </div>
          ) : (
            <div className="empty-results">
              <span className="empty-results__icon"><Icon name={showSavedOnly ? 'heart' : 'mountain'} size={23} /></span>
              <h3>{t(showSavedOnly && savedAttractionIds.length === 0 ? 'Your travel wish list is waiting.' : 'Nothing on this trail just yet.')}</h3>
              <p>{t(showSavedOnly && savedAttractionIds.length === 0 ? 'Tap the heart on a destination to keep it close.' : 'Try another search or choose a different category.')}</p>
              <button type="button" className="text-link" onClick={() => { setSearch(''); setCategory('All places'); setShowSavedOnly(false); }}>{t('See all places')} <Icon name="arrow" size={16} /></button>
            </div>
          )}
          {(visibleAttractions.length > 4 || showAllHomePlaces) && (
            <button className="all-places-link" type="button" onClick={() => setShowAllHomePlaces((showAll) => !showAll)}>
              {t('EIGHT PLACES. NO WRONG TURNS.')} <span>{t(showAllHomePlaces ? 'SHOW FEWER PLACES' : 'EXPLORE THEM ALL')} <Icon name="arrow" size={15} /></span>
            </button>
          )}
        </section>

        <section className="culture-strip">
          <div className="culture-strip__image"><img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85" alt="African highlands beneath a wide open sky" loading="lazy" /></div>
          <div className="culture-strip__content">
            <span className="eyebrow eyebrow--light"><span className="eyebrow__dash" /> {t('MORE THAN A MOUNTAIN')}</span>
            <h2>{t('Come for the view.')}<br /><em>{t('Stay for the welcome.')}</em></h2>
            <p>{t('Here, a journey is measured in stories shared, a warm blanket after sunset, and one more cup of tea. The Basotho way isn’t just something to see. It’s something you feel.')}</p>
            <a className="culture-strip__link" href="#enquire">{t('Meet the Mountain Kingdom')} <Icon name="arrow" size={16} /></a>
            <span className="culture-strip__ornament" aria-hidden="true">✳</span>
          </div>
        </section>

        <section className="experience-bar section-wrap">
          <span className="eyebrow"><span className="eyebrow__dash" /> {t('MAKE IT YOURS')}</span>
          <div className="experience-bar__grid">
            <div><span className="experience-icon"><Icon name="mountain" /></span><span><strong>{t('High-altitude adventures')}</strong><small>{t('More mountain, less ordinary.')}</small></span></div>
            <div><span className="experience-icon"><Icon name="leaf" /></span><span><strong>{t('Wide-open nature')}</strong><small>{t('Find your own kind of quiet.')}</small></span></div>
            <div><span className="experience-icon"><Icon name="globe" /></span><span><strong>{t('Culture & connection')}</strong><small>{t('Come curious. Leave closer.')}</small></span></div>
            <div><span className="experience-icon"><Icon name="sun" /></span><span><strong>{t('A season for everyone')}</strong><small>{t('Every visit has its moment.')}</small></span></div>
          </div>
        </section>

        <EnquiryForm selectedDestination={selectedDestination} revealKey={enquiryRevealKey} />
      </> : <PageContent
        page={page}
        category={category}
        closeAttraction={closeAttraction}
        openAttraction={openAttraction}
        planVisit={planVisit}
        savedAttractionIds={savedAttractionIds}
        search={search}
        selectedDestination={selectedDestination}
        selectedAttraction={selectedAttraction}
        setCategory={setCategory}
        setSearch={setSearch}
        setShowSavedOnly={setShowSavedOnly}
        showSavedOnly={showSavedOnly}
        toggleSavedAttraction={toggleSavedAttraction}
        visibleAttractions={visibleAttractions}
        enquiryRevealKey={enquiryRevealKey}
      />}</main>

      <SiteFooter onNavigate={navigate} />

      <AttractionModal attraction={selectedAttraction} onClose={closeAttraction} onEnquire={handlePlanVisit} />
    </div>
  );
}

export default App;
