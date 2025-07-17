import axios from 'axios';
import { API_KEY } from './EnvironmentUtil';

export const fetchWeather = async (city) => {
  const [currentRes, forecastRes] = await Promise.all([
    axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=tr`
    ),
    axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=tr`
    ),
  ]);

  const forecast = forecastRes.data.list
    .filter((item) => item.dt_txt.includes('12:00:00'))
    .slice(0, 3);

  return { current: currentRes.data, forecast };
};