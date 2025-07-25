import React from 'react';

const ErrorMessage = ({ error, show }) => {
  if (!show || !error) {
    return null;
  }

  const getErrorMessage = (error) => {
    if (typeof error === 'string') {
      return error;
    }

    if (error.message) {
      return error.message;
    }

    if (error.status === 404) {
      return 'City not found. Please check the spelling and try again.';
    }

    if (error.status === 401) {
      return 'API key error. Please check your configuration.';
    }

    return 'Unable to fetch weather data. Please try again later.';
  };

  const isDemo = error?.isDemo;
  const errorClass = isDemo ? 'error demo-notice' : 'error';

  return (
    <div className={errorClass} role="alert" style={{ display: 'block' }}>
      <p>{getErrorMessage(error)}</p>
    </div>
  );
};

export default ErrorMessage;
