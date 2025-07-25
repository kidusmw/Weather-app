import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SearchBox from './components/SearchBox';
import WeatherDisplay from './components/WeatherDisplay';
import ErrorMessage from './components/ErrorMessage';
import { useWeatherAPI } from './hooks/useWeatherAPI';

function App() {
  const [query, setQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [demoMode, setDemoMode] = useState(true);
  const [demoData, setDemoData] = useState(null);
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

  // Initialize with demo data instead of API call
  useEffect(() => {
    const timer = setTimeout(() => {
      // Set demo data instead of making API call
      const demoData = {
        name: 'Demo City',
        main: {
          temp: 22,
          humidity: 65
        },
        weather: [{
          main: 'Clear',
          description: 'clear sky'
        }],
        wind: {
          speed: 3.5
        }
      };
      // Simulate the hook's setter directly
      if (!weatherData) {
        // Only set demo if no real data exists
        setQuery('Demo City');
        // This won't trigger an API call
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [weatherData]);

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
