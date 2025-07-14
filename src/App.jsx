import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const API_KEY = 'b43369b2d7a83f2a3234cd99ca029487';

const cityTimeZones = {
  London: 'Europe/London',
  Paris: 'Europe/Paris',
  Istanbul: 'Europe/Istanbul',
  'New York': 'America/New_York',
  Tokyo: 'Asia/Tokyo',
  Izmir: 'Europe/Istanbul',
  Ankara: 'Europe/Istanbul',
};

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

function App() {
  const [city, setCity] = useState('Istanbul');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const updateTime = (city) => {
    const timeZone = cityTimeZones[city] || 'UTC';
    const now = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone,
    });
    setCurrentTime(now);
  };

  useEffect(() => {
    updateTime(city);

    const interval = setInterval(() => {
      updateTime(city);
    }, 1000);

    return () => clearInterval(interval);
  }, [city]);

  const getWeather = async (selectedCity = city) => {
    if (!selectedCity.trim()) {
      setError('Lütfen bir şehir adı girin');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        selectedCity
      )}&appid=${API_KEY}&units=metric&lang=tr`;

      const response = await axios.get(url);

      setData(response.data); // axios'ta direkt json halinde dönüyor
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) setError('Şehir bulunamadı.');
        else if (error.response.status === 401) setError('API anahtarı geçersiz.');
        else setError('Veri alınamadı, tekrar deneyin.');
      } else {
        setError('Ağ hatası. Lütfen bağlantınızı kontrol edin.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather('Istanbul');
  }, []);

  return (
    <>
        <div className="max-w-2xl mx-auto p-6 bg-white/95 backdrop-blur-lg rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] text-center mt-10">
          <h1 className="text-4xl font-light text-gray-800 mb-8">
            Hava Durumu
          </h1>

          <div className="mb-8">
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && getWeather()}
                placeholder="Şehir adı girin..."
                className="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
              />
              <button
                onClick={() => getWeather()}
                className="px-5 py-3 text-white bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition"
              >
                <i className="fas fa-search mr-1"></i> Ara
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["London", "Paris", "Istanbul", "New York", "Tokyo", "Izmir", "Ankara"].map((c) => (
                <button
                  key={c}
                  onClick={() => getWeather(c)}
                  className="py-2 border-2 border-gray-300 rounded-md text-sm font-medium bg-gray-100 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-teal-600 py-4 animate-pulse">
              <i className="fas fa-spinner fa-spin text-2xl"></i>
              <p>Hava durumu verileri yükleniyor...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500 text-white py-3 px-4 rounded-lg font-medium mt-4">
              ⚠️ {error}
            </div>
          )}

          {data && (
            <div className="relative overflow-hidden mt-6 p-6 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl shadow-xl">
              <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-white/10 rounded-full rotate-45"></div>

              <div className="relative z-10 mb-4">
                <h2 className="text-3xl font-light">{data.name}</h2>
                <p className="text-sm opacity-90">{data.sys.country}</p>
                <p className="text-sm opacity-80 font-mono mt-1">🕐 {currentTime}</p>
              </div>

              <div className="relative z-10 flex items-center justify-center gap-6 mb-6">
                <div className="text-5xl font-thin">{Math.round(data.main.temp)}°C</div>
                <div className="text-5xl">
                  {getWeatherIcon(data.weather[0].main, data.weather[0].description)}
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="opacity-80">Hissedilen</p>
                  <p className="text-lg font-semibold">{Math.round(data.main.feels_like)}°C</p>
                </div>
                <div className="text-center">
                  <p className="opacity-80">Nem</p>
                  <p className="text-lg font-semibold">{data.main.humidity}%</p>
                </div>
                <div className="text-center">
                  <p className="opacity-80">Rüzgar Hızı</p>
                  <p className="text-lg font-semibold">{data.wind.speed} m/s</p>
                </div>
                <div className="text-center">
                  <p className="opacity-80">Basınç</p>
                  <p className="text-lg font-semibold">{data.main.pressure} hPa</p>
                </div>
              </div>

              <p className="relative z-10 mt-4 text-base opacity-90">
                {data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}
              </p>
            </div>
          )}
        </div>
    </>

  );
}

export default App;