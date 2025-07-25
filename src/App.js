import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SearchBox from './components/SearchBox';
import WeatherDisplay from './components/WeatherDisplay';
import ErrorMessage from './components/ErrorMessage';
import { useWeatherAPI } from './hooks/useWeatherAPI';

function App() {
  const [query, setQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const { weatherData, loading, error, fetchWeather } = useWeatherAPI();

  // Debounced search function
  const handleSearch = useCallback(async (cityName) => {
    if (!cityName.trim()) return;
    
    setQuery(cityName);
    setSearchTrigger(prev => prev + 1);
  }, []);

  // Trigger weather fetch when searchTrigger changes
  useEffect(() => {
    if (searchTrigger > 0 && query) {
      fetchWeather(query);
    }
  }, [searchTrigger, query, fetchWeather]);

  // Load default city on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch('New York');
    }, 1000);

    return () => clearTimeout(timer);
  }, [handleSearch]);

  return (
    <div className="app">
      <div className="card">
        <SearchBox 
          onSearch={handleSearch}
          loading={loading}
        />
        
        <ErrorMessage 
          error={error}
          show={!!error && !loading}
        />
        
        <WeatherDisplay 
          weatherData={weatherData}
          loading={loading}
          show={!!weatherData && !error}
        />
      </div>
    </div>
  );
}

export default App;
