import Brand from './Brand';
import Icon from './Icon';
import { useLanguage } from '../context/LanguageContext';

function SiteFooter({ onNavigate }) {
  const { t } = useLanguage();
  function handleNavigation(event, path) {
    event.preventDefault();
    onNavigate(path);
  }

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block"><Brand footer /><p>{t('A little country at the top of the world.')}<br />{t('A big story, waiting to be yours.')}</p></div>
        <div className="footer-links">
          <strong>{t('FIND YOUR WAY')}</strong>
          <a href="/destinations" onClick={(event) => handleNavigation(event, '/destinations')}>{t('Destinations')}</a>
          <a href="/experiences" onClick={(event) => handleNavigation(event, '/experiences')}>{t('Experiences')}</a>
          <a href="/about" onClick={(event) => handleNavigation(event, '/about')}>{t('About Lesotho')}</a>
        </div>
        <div className="footer-links">
          <strong>{t('GOOD TO KNOW')}</strong>
          <a href="/plan" onClick={(event) => handleNavigation(event, '/plan')}>{t('Plan your visit')}</a>
          <a href="/plan" onClick={(event) => handleNavigation(event, '/plan')}>{t('Get in touch')}</a>
          <span>{t('Local prices are estimates in Maloti (M).')}</span>
        </div>
        <div className="footer-social">
          <strong>{t('FOLLOW US')}</strong>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Icon name="instagram" size={17} />
            <span>Instagram</span>
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
            <Icon name="facebook" size={17} />
            <span>Facebook</span>
          </a>
        </div>
        <a className="back-top" href="/" aria-label={t('Back to home')} onClick={(event) => handleNavigation(event, '/') }><Icon name="arrow" size={20} /></a>
      </div>
      <div className="footer-bottom"><span>© 2026 TSEBA KA LESOTHO</span><span>{t('MADE WITH A LITTLE MOUNTAIN MAGIC')} <span className="footer-heart">✳</span></span><span>{t('THE KINGDOM IN THE SKY · 29° 36′ S')}</span></div>
    </footer>
  );
}

export default SiteFooter;
