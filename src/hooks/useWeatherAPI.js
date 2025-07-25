import { useState, useCallback, useRef } from 'react';

const API_KEY = "ae0a4d1b1c6e89076b37a592e7937940";

// Use proxy in development, direct API in production
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return '/api/weather?units=metric&q=';
  }
  return 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
};

export const useWeatherAPI = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchWeather = useCallback(async (city) => {
    if (!city.trim()) return;

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      setLoading(true);
      setError(null);

      // Add minimum delay for better UX (loading state visibility)
      const apiUrl = getApiUrl();
      const [response] = await Promise.all([
        fetch(`${apiUrl}${encodeURIComponent(city)}&appid=${API_KEY}`, {
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }),
        new Promise(resolve => setTimeout(resolve, 500))
      ]);

      if (!response.ok) {
        throw {
          status: response.status,
          message: response.statusText
        };
      }

      const data = await response.json();
      
      // Validate response data
      if (!data.main || !data.weather || !data.name) {
        throw new Error('Invalid weather data received');
      }

      setWeatherData(data);
      setError(null);
      
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was aborted, don't update state
        return;
      }

      console.error('Weather API Error:', err);

      // Handle different types of errors
      let errorMessage = 'Unable to fetch weather data. Please try again later.';
      let shouldUseFallback = false;

      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'API temporarily unavailable. Showing demo data.';
        shouldUseFallback = true;
      } else if (err.status === 404) {
        errorMessage = 'City not found. Please check the spelling and try again.';
      } else if (err.status === 401) {
        errorMessage = 'API key error. Please check your configuration.';
      } else if (err.status >= 500) {
        errorMessage = 'Weather service is temporarily unavailable. Showing demo data.';
        shouldUseFallback = true;
      }

      if (shouldUseFallback) {
        // Use demo data as fallback with weather variation
        const weatherTypes = ['Clear', 'Clouds', 'Rain', 'Mist'];
        const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        const demoData = {
          name: city || 'Demo City',
          main: {
            temp: Math.floor(Math.random() * 25) + 5, // 5-30°C
            humidity: Math.floor(Math.random() * 40) + 40 // 40-80%
          },
          weather: [{
            main: randomWeather,
            description: randomWeather.toLowerCase() + ' sky'
          }],
          wind: {
            speed: (Math.random() * 10 + 1).toFixed(1) // 1-11 km/h
          }
        };
        setWeatherData(demoData);
        setError({ message: errorMessage, isDemo: true });
      } else {
        setError({ ...err, message: errorMessage });
        setWeatherData(null);
      }

    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup function to abort ongoing requests
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear all state
  const resetState = useCallback(() => {
    cancelRequest();
    setWeatherData(null);
    setError(null);
  }, [cancelRequest]);

  return {
    weatherData,
    loading,
    error,
    fetchWeather,
    cancelRequest,
    clearError,
    resetState
  };
};

// Additional hook for weather data formatting
export const useWeatherFormatter = () => {
  const formatTemperature = useCallback((temp, unit = 'C') => {
    const rounded = Math.round(temp);
    return `${rounded}°${unit}`;
  }, []);

  const formatWindSpeed = useCallback((speed, unit = 'km/h') => {
    return `${speed}${unit}`;
  }, []);

  const formatHumidity = useCallback((humidity) => {
    return `${humidity}%`;
  }, []);

  const getWeatherDescription = useCallback((weather) => {
    if (!weather || !weather[0]) return '';
    
    return weather[0].description
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  return {
    formatTemperature,
    formatWindSpeed,
    formatHumidity,
    getWeatherDescription
  };
};
