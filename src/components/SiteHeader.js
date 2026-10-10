import Brand from './Brand';
import Icon from './Icon';
import { useLanguage } from '../context/LanguageContext';

const links = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Destinations', path: '/destinations', icon: 'pin' },
  { label: 'Experiences', path: '/experiences', icon: 'mountain' },
  { label: 'About Lesotho', path: '/about', icon: 'globe' },
];

function SiteHeader({ page, mobileMenuOpen, onNavigate, onToggleMenu, search, onSearchChange }) {
  const { language, setLanguage, t } = useLanguage();
  function handleNavigation(event, path) {
    event.preventDefault();
    onNavigate(path);
  }

  function handleSearch(event) {
    event.preventDefault();
    onNavigate('/destinations');
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button className="mobile-menu-toggle" type="button" aria-label={t(mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu')} aria-expanded={mobileMenuOpen} onClick={onToggleMenu}>
          <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
        </button>
        <nav className={`main-nav${mobileMenuOpen ? ' main-nav--open' : ''}`} aria-label={t('Main navigation')}>
          {links.map(({ label, path, icon }) => (
            <a key={path} href={path} aria-current={page === path ? 'page' : undefined} onClick={(event) => handleNavigation(event, path)}><Icon name={icon} size={15} /><span>{t(label)}</span></a>
          ))}
          <form className="nav-search" role="search" onSubmit={handleSearch}>
            <Icon name="search" size={17} />
            <input type="search" aria-label={t('Search all destinations')} placeholder={t('Search places')} value={search} onChange={(event) => onSearchChange(event.target.value)} />
          </form>
          <label className="language-picker">
            <span className="visually-hidden">{t('Select language')}</span>
            <select aria-label={t('Select language')} value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="en">🇬🇧 English</option>
              <option value="st">🇱🇸 Sesotho</option>
            </select>
          </label>
        </nav>
        <a className="header-cta" href="/plan" onClick={(event) => handleNavigation(event, '/plan')}>{t('Plan your trip')}</a>
      </div>
    </header>
  );
}

export default SiteHeader;
