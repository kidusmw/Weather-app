import React from 'react';

const ErrorMessage = ({ error, show }) => {
  if (!show || !error) {
    return null;
  }

  const getErrorMessage = (error) => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.status === 404) {
      return 'City not found. Please check the spelling and try again.';
    }
    
    if (error.status === 401) {
      return 'API key error. Please check your configuration.';
    }
    
    return 'Unable to fetch weather data. Please try again later.';
  };

  return (
    <div className="error" role="alert" style={{ display: 'block' }}>
      <p>{getErrorMessage(error)}</p>
    </div>
  );
};

export default ErrorMessage;
