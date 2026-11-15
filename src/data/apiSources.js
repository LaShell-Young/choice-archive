const source = (id, name, url, description, endpoint) => ({
  id,
  name,
  url,
  description,
  endpoint,
});

export const API_SOURCES = [
  source(
    'weather',
    'Open-Meteo',
    'https://open-meteo.com/',
    'Live weather and hourly forecasts with no API key.',
    'api.open-meteo.com/v1/forecast',
  ),
  source(
    'avatars',
    'DiceBear',
    'https://www.dicebear.com/',
    'Seeded, generated avatars used on RandomUser profile cards.',
    'api.dicebear.com/9.x/notionists/svg',
  ),
  source(
    'countdowns',
    'CountdownsHQ',
    'https://countdownshq.com/',
    'Event inspiration and links; the live countdown runs in this page because no public JSON API is documented.',
    'Local clock + selected date',
  ),
  source(
    'news',
    'Sonto',
    'https://sonto.tech/',
    'Curated tech and AI headlines in five languages, staged as a same-origin snapshot during build because the feed does not allow browser CORS.',
    'data/articles-latest.json (build snapshot)',
  ),
  source(
    'health',
    'HealthCare.gov',
    'https://www.healthcare.gov/developers/',
    'Official, machine-readable educational content about the US Health Insurance Marketplace; staged at build time because the content endpoint does not allow browser CORS.',
    'api/index.json (glossary summaries, build snapshot)',
  ),
  source(
    'stardew',
    'Stardew Valley Wiki API',
    'https://www.stardewvalleywiki.net/developers',
    'CORS-enabled game datasets for crops, fish, villagers, and more.',
    'data/crops.json',
  ),
  source(
    'people',
    'RandomUser',
    'https://randomuser.me/',
    'Synthetic profile details for UI examples; avatars are generated separately by DiceBear.',
    'api/?results=6',
  ),
];

export const SOURCE_BY_ID = Object.fromEntries(
  API_SOURCES.map((apiSource) => [apiSource.id, apiSource]),
);

export const CITIES = [
  { id: 'new-york', name: 'New York', latitude: 40.7128, longitude: -74.006 },
  { id: 'london', name: 'London', latitude: 51.5072, longitude: -0.1276 },
  { id: 'tokyo', name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { id: 'sydney', name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
];

const requestJson = async (url, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText})`);
  }
  return response.json();
};

export async function fetchWeather(city, signal) {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability',
    forecast_days: '2',
    timezone: 'auto',
  });
  return requestJson(`https://api.open-meteo.com/v1/forecast?${params}`, signal);
}

export async function fetchNews(language, signal) {
  const result = await requestJson(`${import.meta.env.BASE_URL}data/sonto-${language}.json`, signal);
  return Array.isArray(result.articles) ? result.articles : [];
}

export async function fetchProfiles(signal) {
  const result = await requestJson(
    'https://randomuser.me/api/?results=6&nat=us,gb,ca&inc=name,email,location,picture&noinfo',
    signal,
  );
  return Array.isArray(result.results) ? result.results : [];
}

export async function fetchHealthGlossary(signal) {
  const result = await requestJson(`${import.meta.env.BASE_URL}data/healthcare-glossary.json`, signal);
  return Array.isArray(result.glossary) ? result.glossary : [];
}

export async function fetchCrops(signal) {
  const result = await requestJson('https://www.stardewvalleywiki.net/data/crops.json', signal);
  return Array.isArray(result.crops) ? result.crops : [];
}

export function diceBearAvatar(seed) {
  const params = new URLSearchParams({
    seed,
    backgroundColor: 'c0aede,d1d4f9,b6e3f4',
    radius: '50',
  });
  return `https://api.dicebear.com/9.x/notionists/svg?${params}`;
}

export function getWeatherDescription(code) {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mostly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Conditions unavailable';
}
