import React, { useState, useEffect } from 'react';

const WeatherDisplay = ({ weatherData, loading, show }) => {
  const [iconTransition, setIconTransition] = useState(false);

  const getWeatherIcon = (weatherMain) => {
    const iconMap = {
      'Clouds': '/weather-app-img/images/clouds.png',
      'Clear': '/weather-app-img/images/clear.png',
      'Rain': '/weather-app-img/images/rain.png',
      'Mist': '/weather-app-img/images/mist.png',
      'Drizzle': '/weather-app-img/images/drizzle.png',
      'Snow': '/weather-app-img/images/snow.png',
      'Thunderstorm': '/weather-app-img/images/rain.png',
      'Haze': '/weather-app-img/images/mist.png',
      'Fog': '/weather-app-img/images/mist.png'
    };
    return iconMap[weatherMain] || '/weather-app-img/images/clear.png';
  };

  // Animate icon change
  useEffect(() => {
    if (weatherData) {
      setIconTransition(true);
      const timer = setTimeout(() => {
        setIconTransition(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [weatherData?.weather]);

  if (!show || loading) {
    return null;
  }

  return (
    <main className="weather" style={{ display: 'block' }}>
      <div className="weather-display">
        <img 
          src={getWeatherIcon(weatherData.weather[0].main)}
          className={`weather-icon ${iconTransition ? 'transitioning' : ''}`}
          alt={weatherData.weather[0].description}
        />
        <div className="temperature-info">
          <h1 className="temp">
            {Math.round(weatherData.main.temp)}°c
          </h1>
          <h2 className="city">
            {weatherData.name}
          </h2>
        </div>
      </div>
      
      <section className="details" aria-label="Weather details">
        <div className="col humidity-card">
          <img src="/weather-app-img/images/humidity.png" alt="Humidity icon" />
          <div className="metric-info">
            <p className="humidity">{weatherData.main.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
        
        <div className="col wind-card">
          <img src="/weather-app-img/images/wind.png" alt="Wind speed icon" />
          <div className="metric-info">
            <p className="wind">{weatherData.wind.speed}km/h</p>
            <p>Wind Speed</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WeatherDisplay;
