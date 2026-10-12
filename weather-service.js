const https = require('https');

const PLACE_QUERIES = Object.freeze({
  'sani-pass': 'Sani Pass, Lesotho',
  'maletsunyane-falls': 'Semonkong, Lesotho',
  'katse-dam': 'Katse Dam, Lesotho',
  'thaba-bosiu': 'Thaba Bosiu, Lesotho',
  sehlabathebe: 'Sehlabathebe National Park, Lesotho',
  afriski: 'Afriski Mountain Resort, Lesotho',
  'dinosaur-footprints': 'Leribe, Lesotho',
  'morija-museum': 'Morija, Lesotho',
});

const REQUEST_TIMEOUT_MS = 10000;

function buildWeatherUrl(apiKey, query) {
  const url = new URL('https://api.weatherstack.com/current');
  url.searchParams.set('access_key', apiKey);
  url.searchParams.set('query', query);
  return url;
}

function fetchWeatherFromWeatherstack(apiKey, query) {
  return new Promise((resolve, reject) => {
    const request = https.get(buildWeatherUrl(apiKey, query), (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
        if (body.length > 1024 * 1024) request.destroy(new Error('Weather provider response was too large.'));
      });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error('Weather provider request failed.'));
          return;
        }

        let payload;
        try {
          payload = JSON.parse(body);
        } catch {
          reject(new Error('Weather provider returned an invalid response.'));
          return;
        }

        if (payload.error || !payload.current) {
          reject(new Error(payload.error?.info || 'Weather data is not available for this place.'));
          return;
        }

        const current = payload.current;
        const description = current.weather_descriptions?.[0];
        if (!Number.isFinite(current.temperature) || typeof description !== 'string' || !description.trim()) {
          reject(new Error('Weather provider returned incomplete current conditions.'));
          return;
        }

        resolve({
          temperature: current.temperature,
          feelsLike: Number.isFinite(current.feelslike) ? current.feelslike : null,
          humidity: Number.isFinite(current.humidity) ? current.humidity : null,
          windSpeed: Number.isFinite(current.wind_speed) ? current.wind_speed : null,
          description,
          observationTime: typeof current.observation_time === 'string' ? current.observation_time : '',
        });
      });
    });

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error('Weather provider request timed out.'));
    });
    request.on('error', reject);
  });
}

module.exports = { PLACE_QUERIES, buildWeatherUrl, fetchWeatherFromWeatherstack };
