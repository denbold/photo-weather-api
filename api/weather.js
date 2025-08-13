
// api/weather.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { lat, lon } = req.query;
  const key = process.env.OPENWEATHER_KEY; // Key stored in Vercel environment variables
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${key}`;
  
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Ошибка запроса к OpenWeather" });
  }
}
