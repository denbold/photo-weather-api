// api/weather.js
// Вариант без node-fetch (используем глобальный fetch на Vercel)

export default async function handler(req, res) {
  // Простые CORS-заголовки, чтобы можно было дергать из приложения
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { lat, lon, lang = 'ru', units = 'metric' } = req.query || {};
    const key = process.env.OPENWEATHER_KEY;

    if (!key) {
      res.status(500).json({ error: 'Missing OPENWEATHER_KEY on server' });
      return;
    }
    if (!lat || !lon) {
      res.status(400).json({ error: 'lat and lon are required' });
      return;
    }

    const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&units=${encodeURIComponent(units)}` +
      `&lang=${encodeURIComponent(lang)}` +
      `&appid=${key}`;

    const r = await fetch(url);
    const data = await r.json();

    if (!r.ok) {
      res.status(r.status).json({
        error: data?.message || 'OpenWeather error',
        from: 'openweather'
      });
      return;
    }

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Server error', detail: String(e) });
  }
}
