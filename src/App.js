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

  // Search function with demo fallback
  const handleSearch = useCallback(async (cityName) => {
    if (!cityName.trim()) return;

    setDemoMode(false);
    setQuery(cityName);
    setSearchTrigger(prev => prev + 1);
  }, []);

  // Trigger weather fetch when searchTrigger changes
  useEffect(() => {
    if (searchTrigger > 0 && query) {
      fetchWeather(query);
    }
  }, [searchTrigger, query, fetchWeather]);

  // Initialize with demo data
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialDemoData = {
        name: 'New York',
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
      setDemoData(initialDemoData);
      setQuery('New York');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Determine what data to show
  const displayData = demoMode ? demoData : weatherData;
  const showError = !!error && !loading && !demoMode;
  const showWeather = (!!displayData && (!error || demoMode)) && !loading;

  return (
    <div className="app">
      <div className="card">
        <SearchBox
          onSearch={handleSearch}
          loading={loading}
        />

        {demoMode && demoData && (
          <div className="demo-notice" style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            margin: '16px 0',
            fontSize: '14px',
            color: '#93c5fd',
            textAlign: 'center'
          }}>
            ℹ Demo mode - Search for a city to get live weather data
          </div>
        )}

        <ErrorMessage
          error={error}
          show={showError}
        />

        <WeatherDisplay
          weatherData={displayData}
          loading={loading}
          show={showWeather}
        />
      </div>
    </div>
  );
}

export default App;
