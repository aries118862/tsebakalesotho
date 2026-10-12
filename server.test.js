const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const test = require('node:test');
const { buildWeatherUrl, createWeatherServer } = require('./server');
const { createWeatherHandler } = require('./api/weather');

function requestJson(port, path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port, path }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        resolve({ status: response.statusCode, body: JSON.parse(body) });
      });
    }).on('error', reject);
  });
}

async function withServer(options, callback) {
  const server = createWeatherServer(options);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    await callback(server.address().port);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

test('Weatherstack requests use HTTPS and the configured location', () => {
  const url = buildWeatherUrl('test-only-key', 'Semonkong, Lesotho');
  assert.equal(url.protocol, 'https:');
  assert.equal(url.searchParams.get('access_key'), 'test-only-key');
  assert.equal(url.searchParams.get('query'), 'Semonkong, Lesotho');
});

test('weather endpoint validates places and reports missing server configuration', async () => {
  await withServer({ getApiKey: () => '' }, async (port) => {
    const invalidPlace = await requestJson(port, '/api/weather?place=unknown-place');
    assert.equal(invalidPlace.status, 400);
    const prototypeProperty = await requestJson(port, '/api/weather?place=__proto__');
    assert.equal(prototypeProperty.status, 400);

    const missingKey = await requestJson(port, '/api/weather?place=sani-pass');
    assert.equal(missingKey.status, 503);
    assert.match(missingKey.body.error, /WEATHERSTACK_API_KEY/);
  });
});

test('weather endpoint returns current conditions and caches successful lookups', async () => {
  let calls = 0;
  const weather = {
    temperature: 18,
    feelsLike: 17,
    humidity: 42,
    windSpeed: 9,
    description: 'Partly cloudy',
    observationTime: '03:15 PM',
  };

  await withServer({
    getApiKey: () => 'test-only-key',
    fetchWeather: async (apiKey, location) => {
      calls += 1;
      assert.equal(apiKey, 'test-only-key');
      assert.equal(location, 'Semonkong, Lesotho');
      return weather;
    },
  }, async (port) => {
    const first = await requestJson(port, '/api/weather?place=maletsunyane-falls');
    const second = await requestJson(port, '/api/weather?place=maletsunyane-falls');
    assert.equal(first.status, 200);
    assert.deepEqual(first.body, weather);
    assert.deepEqual(second.body, weather);
    assert.equal(calls, 1);
  });
});

test('Vercel weather function validates requests and returns cacheable weather data', async () => {
  const weather = {
    temperature: 18,
    feelsLike: 17,
    humidity: 42,
    windSpeed: 9,
    description: 'Partly cloudy',
    observationTime: '03:15 PM',
  };
  const handler = createWeatherHandler({
    getApiKey: () => 'test-only-key',
    fetchWeather: async (apiKey, location) => {
      assert.equal(apiKey, 'test-only-key');
      assert.equal(location, 'Katse Dam, Lesotho');
      return weather;
    },
  });
  const headers = {};
  let statusCode;
  let body;
  const response = {
    setHeader(name, value) { headers[name] = value; },
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) { body = value; },
  };

  await handler({ method: 'GET', query: { place: 'katse-dam' } }, response);
  assert.equal(statusCode, 200);
  assert.deepEqual(body, weather);
  assert.equal(headers['Cache-Control'], 'public, s-maxage=900, stale-while-revalidate=300');
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');

  await handler({ method: 'POST', query: { place: 'katse-dam' } }, response);
  assert.equal(statusCode, 405);
  assert.equal(headers.Allow, 'GET');
});
