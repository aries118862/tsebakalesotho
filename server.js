const http = require('http');
const { PLACE_QUERIES, buildWeatherUrl, fetchWeatherFromWeatherstack } = require('./weather-service');

const CACHE_DURATION_MS = 15 * 60 * 1000;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(payload));
}

function createWeatherServer({
  getApiKey = () => process.env.WEATHERSTACK_API_KEY,
  fetchWeather = fetchWeatherFromWeatherstack,
  now = Date.now,
} = {}) {
  const cache = new Map();
  const pending = new Map();

  return http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, 'http://localhost');
    if (request.method !== 'GET' || requestUrl.pathname !== '/api/weather') {
      sendJson(response, 404, { error: 'Not found.' });
      return;
    }

    const placeId = requestUrl.searchParams.get('place');
    if (!placeId || !Object.prototype.hasOwnProperty.call(PLACE_QUERIES, placeId)) {
      sendJson(response, 400, { error: 'Choose a supported Lesotho destination.' });
      return;
    }
    const locationQuery = PLACE_QUERIES[placeId];

    const apiKey = getApiKey();
    if (!apiKey) {
      sendJson(response, 503, { error: 'Weather is not configured. Set WEATHERSTACK_API_KEY on the server.' });
      return;
    }

    const cached = cache.get(placeId);
    if (cached && cached.expiresAt > now()) {
      sendJson(response, 200, cached.weather);
      return;
    }

    let weatherRequest = pending.get(placeId);
    if (!weatherRequest) {
      weatherRequest = fetchWeather(apiKey, locationQuery)
        .then((weather) => {
          cache.set(placeId, { weather, expiresAt: now() + CACHE_DURATION_MS });
          return weather;
        })
        .finally(() => pending.delete(placeId));
      pending.set(placeId, weatherRequest);
    }

    try {
      sendJson(response, 200, await weatherRequest);
    } catch (error) {
      console.error('Weather request failed:', error.message);
      sendJson(response, 502, { error: error.message || 'Weather is temporarily unavailable.' });
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.WEATHER_SERVER_PORT || 3001);
  const host = process.env.WEATHER_SERVER_HOST || '127.0.0.1';
  createWeatherServer().listen(port, host, () => {
    console.log(`Weather API proxy listening on http://${host}:${port}`);
  });
}

module.exports = { buildWeatherUrl, createWeatherServer };
