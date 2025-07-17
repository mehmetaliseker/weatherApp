import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '../../util/fetchWeather';

export const useWeatherData = (city) => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchWeather(city),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};