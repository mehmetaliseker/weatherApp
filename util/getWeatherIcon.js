export const getWeatherIcon = (weatherMain, description) => {
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