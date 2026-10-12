import { useEffect, useState } from 'react';
import Icon from './Icon';
import { useLanguage } from '../context/LanguageContext';

function WeatherCard({ placeId, placeName }) {
  const { t } = useLanguage();
  const [attempt, setAttempt] = useState(0);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/weather?place=${encodeURIComponent(placeId)}`, {
          signal: controller.signal,
        });
        const responseBody = await response.text();
        let result;
        try {
          result = JSON.parse(responseBody);
        } catch {
          throw new Error(t('Weather service is unavailable. Restart the app with npm start and check the server output.'));
        }
        if (!response.ok) throw new Error(result.error || t('Weather is temporarily unavailable.'));
        setWeather(result);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || t('Weather is temporarily unavailable.'));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadWeather();
    return () => controller.abort();
  }, [attempt, placeId, t]);

  return (
    <section className="place-weather" aria-label={`${t('Current weather for')} ${placeName}`}>
      <div className="place-weather__heading">
        <Icon name="sun" size={18} />
        <h4>{t('Current weather')}</h4>
      </div>
      {loading ? (
        <p className="place-weather__status" role="status">{t('Loading weather...')}</p>
      ) : error ? (
        <div className="place-weather__error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setAttempt((current) => current + 1)}>{t('Try again')}</button>
        </div>
      ) : (
        <>
          <div className="place-weather__current">
            <strong>{weather.temperature}°C</strong>
            <span>{weather.description}</span>
          </div>
          <dl className="place-weather__details">
            {weather.feelsLike !== null && <div><dt>{t('Feels like')}</dt><dd>{weather.feelsLike}°C</dd></div>}
            {weather.humidity !== null && <div><dt>{t('Humidity')}</dt><dd>{weather.humidity}%</dd></div>}
            {weather.windSpeed !== null && <div><dt>{t('Wind')}</dt><dd>{weather.windSpeed} km/h</dd></div>}
          </dl>
          {weather.observationTime && <p className="place-weather__time">{t('Local observation')}: {weather.observationTime}</p>}
        </>
      )}
    </section>
  );
}

export default WeatherCard;
