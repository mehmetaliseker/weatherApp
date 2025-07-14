import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import './App.css';

const API_KEY = 'b43369b2d7a83f2a3234cd99ca029487';

const getWeatherIcon = (weatherMain, description) => {
  const weather = weatherMain.toLowerCase();
  const desc = description.toLowerCase();

  if (weather.includes('clear')) return '☀️';
  if (weather.includes('clouds'))
    return desc.includes('scattered') || desc.includes('broken') ? '⛅' : '☁️';
  if (weather.includes('rain'))
    return desc.includes('light') ? '🌦️' : '🌧️';
  if (weather.includes('snow')) return '❄️';
  if (weather.includes('thunderstorm')) return '⛈️';
  if (weather.includes('drizzle')) return '🌦️';
  if (weather.includes('mist') || weather.includes('fog')) return '🌫️';
  if (weather.includes('haze')) return '🌫️';

  return '🌤️';
};

const fetchWeather = async (city) => {
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

const App = () => {
  const [city, setCity] = useState('Istanbul');
  const [queryCity, setQueryCity] = useState('Istanbul');
  const [currentTime, setCurrentTime] = useState('');
  const [cityTimeZones, setCityTimeZones] = useState({});

  const timeZone = cityTimeZones[queryCity] || 'UTC';

  useEffect(() => {
    fetch('/data/cityTimeZones.json')
      .then(res => res.json())
      .then(data => setCityTimeZones(data))
      .catch(err => console.error('Zaman dilimi verisi alınamadı:', err));
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone,
      });
      setCurrentTime(now);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['weather', queryCity],
    queryFn: () => fetchWeather(queryCity),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-center mt-10 mb-10">
      <h1 className="text-4xl font-light text-gray-800 mb-8">Hava Durumu</h1>

      <div className="mb-8">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setQueryCity(city)}
            placeholder="Şehir adı girin..."
            className="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
          />
          <button
            onClick={() => setQueryCity(city)}
            className="px-5 py-3 text-white bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition"
          >
            <i className="fas fa-search mr-1"></i> Ara
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.keys(cityTimeZones).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCity(c);
                setQueryCity(c);
              }}
              className="py-2 border-2 border-gray-300 rounded-md text-sm font-medium bg-gray-100 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="text-teal-600 py-4 animate-pulse">
          <i className="fas fa-spinner fa-spin text-2xl"></i>
          <p>Hava durumu verileri yükleniyor...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500 text-white py-3 px-4 rounded-lg font-medium mt-4">
          Veri alınamadı. Şehri kontrol edin.
        </div>
      )}

      {data && (
        <>
          <div className="relative overflow-hidden mt-6 p-6 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl shadow-xl">
            <div className="relative z-10 mb-4">
              <h2 className="text-3xl font-light">{data.current.name}</h2>
              <p className="text-sm opacity-90">{data.current.sys.country}</p>
              <p className="text-xl opacity-80 font-mono mt-1">{currentTime}</p>
            </div>

            <div className="relative z-10 flex items-center justify-center gap-6 mb-6">
              <div className="text-5xl font-thin">{Math.round(data.current.main.temp)}°C</div>
              <div className="text-5xl">
                {getWeatherIcon(
                  data.current.weather[0].main,
                  data.current.weather[0].description
                )}
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="opacity-80">Hissedilen</p>
                <p className="text-lg font-semibold">{Math.round(data.current.main.feels_like)}°C</p>
              </div>
              <div className="text-center">
                <p className="opacity-80">Nem</p>
                <p className="text-lg font-semibold">{data.current.main.humidity}%</p>
              </div>
              <div className="text-center">
                <p className="opacity-80">Rüzgar Hızı</p>
                <p className="text-lg font-semibold">{data.current.wind.speed} m/s</p>
              </div>
              <div className="text-center">
                <p className="opacity-80">Basınç</p>
                <p className="text-lg font-semibold">{data.current.main.pressure} hPa</p>
              </div>
            </div>

            <p className="relative z-10 mt-4 text-base opacity-90">
              {data.current.weather[0].description.charAt(0).toUpperCase() + data.current.weather[0].description.slice(1)}
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">3 Günlük Tahmin</h3>
            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
              {data.forecast.map((day, index) => {
                const date = new Date(day.dt_txt);
                const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' });
                return (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <p className="text-md font-medium text-gray-600">{dayName}</p>
                    <p className="text-2xl font-bold text-gray-800">{Math.round(day.main.temp)}°C</p>
                    <p className="text-lg">{getWeatherIcon(day.weather[0].main, day.weather[0].description)}</p>
                    <p className="text-sm text-gray-600">{day.weather[0].description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;