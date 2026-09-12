/**
 * GIS_mapping/components/SearchBar.jsx
 *
 * Citizen GIS Search Bar — ULPIN / Survey No. / Gat No. / Village / Location
 * Features: prominent search input, quick-search chips, Use My Location button.
 */
import React, { useState, useRef, useCallback } from 'react';
import { Search, MapPin, X, Clock } from 'lucide-react';
import { quickSearchChips } from '../data/citizenData.js';

const SearchBar = ({ onSearch, onMyLocation, isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = useCallback(
    (q) => {
      const trimmed = (q || query).trim();
      if (trimmed) onSearch(trimmed);
    },
    [query, onSearch]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(query);
  };

  const handleChipClick = (chipQuery) => {
    setQuery(chipQuery);
    handleSubmit(chipQuery);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="gis-search-container">
      {/* Main Search Row */}
      <div
        className={`gis-search-row${focused ? ' focused' : ''}`}
        role="search"
        aria-label="Parcel search"
      >
        {/* Search Input */}
        <div className="gis-search-input-wrap">
          <Search
            size={18}
            className="gis-search-icon"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            id="gis-search-input"
            className="gis-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search by ULPIN, Survey No., Gat No., Village or Location (e.g. Wagholi, Pune)"
            aria-label="Search parcels by ULPIN, Survey Number, Gat Number, Village or Location"
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="gis-search-clear"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          type="button"
          id="gis-search-btn"
          className="gis-search-btn"
          onClick={() => handleSubmit(query)}
          disabled={isLoading}
          aria-label="Search"
        >
          {isLoading ? (
            <span className="gis-search-spinner" aria-hidden="true" />
          ) : (
            <Search size={16} />
          )}
          <span>Search</span>
        </button>

        {/* Use My Location */}
        <button
          type="button"
          id="gis-location-btn"
          className="gis-location-btn"
          onClick={onMyLocation}
          aria-label="Use my current location"
        >
          <MapPin size={15} />
          <span>Use My Location</span>
        </button>
      </div>

      {/* Quick Search Chips */}
      <div className="gis-search-chips" role="group" aria-label="Recent searches">
        <span className="gis-chips-label">
          <Clock size={12} aria-hidden="true" />
          Recent Searches:
        </span>
        {quickSearchChips.map((chip) => (
          <button
            key={chip.query}
            type="button"
            className="gis-chip"
            onClick={() => handleChipClick(chip.query)}
            aria-label={`Search for ${chip.label}`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
