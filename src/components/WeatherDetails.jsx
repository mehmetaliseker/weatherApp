import React from 'react';
import { getWeatherIcon } from '../../util/getWeatherIcon';

const WeatherDetails = ({ data, currentTime }) => (
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
      {data.current.weather[0].description.charAt(0).toUpperCase() +
        data.current.weather[0].description.slice(1)}
    </p>
  </div>
);

export default WeatherDetails;