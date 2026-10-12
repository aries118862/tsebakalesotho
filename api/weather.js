const { PLACE_QUERIES, fetchWeatherFromWeatherstack } = require('../weather-service');

function createWeatherHandler({
  getApiKey = () => process.env.WEATHERSTACK_API_KEY,
  fetchWeather = fetchWeatherFromWeatherstack,
} = {}) {
  return async function weatherHandler(request, response) {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('X-Content-Type-Options', 'nosniff');

    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET');
      response.status(405).json({ error: 'Method not allowed.' });
      return;
    }

    const placeId = typeof request.query?.place === 'string' ? request.query.place : '';
    if (!placeId || !Object.prototype.hasOwnProperty.call(PLACE_QUERIES, placeId)) {
      response.status(400).json({ error: 'Choose a supported Lesotho destination.' });
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      response.status(503).json({ error: 'Weather is not configured. Set WEATHERSTACK_API_KEY on the server.' });
      return;
    }

    try {
      const weather = await fetchWeather(apiKey, PLACE_QUERIES[placeId]);
      response.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=300');
      response.status(200).json(weather);
    } catch (error) {
      console.error('Weather request failed:', error.message);
      response.status(502).json({ error: error.message || 'Weather is temporarily unavailable.' });
    }
  };
}

module.exports = createWeatherHandler();
module.exports.createWeatherHandler = createWeatherHandler;
