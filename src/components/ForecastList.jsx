import React from 'react';
import { getWeatherIcon } from '../../util/getWeatherIcon';

const ForecastList = ({ forecast }) => (
  <div className="mt-10">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">3 Günlük Tahmin</h3>
    <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
      {forecast.map((day, index) => {
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
);

export default ForecastList;