import React, { useState, useRef, useEffect } from 'react';

const SearchBox = ({ onSearch, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      await onSearch(inputValue.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Focus animations
  const handleFocus = () => {
    const card = document.querySelector('.card');
    if (card) {
      card.style.transform = 'translateY(-5px)';
    }
  };

  const handleBlur = () => {
    const card = document.querySelector('.card');
    if (card) {
      card.style.transform = 'translateY(0)';
    }
  };

  return (
    <header className="search-header">
      <form className="search" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search location..."
          spellCheck="false"
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={loading}
        />
        <button 
          type="submit"
          aria-label="Search weather"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <img src="/weather-app-img/images/search.png" alt="Search" />
          )}
        </button>
      </form>
    </header>
  );
};

export default SearchBox;
