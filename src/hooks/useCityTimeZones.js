import { useState, useEffect } from 'react';

export function useCityTimeZones() {
  const [cityTimeZones, setCityTimeZones] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/cityTimeZones.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCityTimeZones(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { cityTimeZones, loading, error };
}