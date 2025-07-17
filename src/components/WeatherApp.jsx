import React, { useState } from 'react';
import { useWeatherData } from "../hooks/useWeatherData";
import { useCityTimeZones } from "../hooks/useCityTimeZones";
import { useCurrentTime } from "../hooks/useCurrentTime";
import SearchBar from './SearchBar';
import WeatherDetails from './WeatherDetails';
import ForecastList from './ForecastList';

const WeatherApp = () => {
  const [city, setCity] = useState('Istanbul');
  const [queryCity, setQueryCity] = useState('Istanbul');
  const { cityTimeZones, loading: zoneLoading, error: zoneError } = useCityTimeZones();
  const timeZone = cityTimeZones[queryCity] || 'UTC';
  const currentTime = useCurrentTime(timeZone);
  const { data, isLoading, error } = useWeatherData(queryCity);

  if (zoneLoading) return <div className="text-center pt-40">Zaman dilimi verileri yükleniyor...</div>;
  if (zoneError) return <div className="text-center text-red-500 pt-40">Zaman dilimi hatası: {zoneError}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-center mt-10 mb-10">
      <h1 className="text-4xl font-light text-gray-800 mb-8">Hava Durumu</h1>
      <SearchBar city={city} setCity={setCity} setQueryCity={setQueryCity} cityTimeZones={cityTimeZones} />

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
          <WeatherDetails data={data} currentTime={currentTime} />
          <ForecastList forecast={data.forecast} />
        </>
      )}
    </div>
  );
};

export default WeatherApp;