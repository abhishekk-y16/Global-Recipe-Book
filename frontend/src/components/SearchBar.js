import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          id="search-bar-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes"
          autoComplete="off"
          aria-label="Search recipes"
        />
        <button id="recipe-search-btn" type="submit" className="search-btn">
          Explore →
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
