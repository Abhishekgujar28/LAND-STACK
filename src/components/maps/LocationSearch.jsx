import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

/**
 * LocationSearch - Map search by Lat/Lng, ULPIN, or Village Name
 */
export const LocationSearch = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`map-location-search ${className}`.trim()}
      style={{
        display: 'flex',
        gap: '0.5rem',
        background: 'var(--ux4g-surface)',
        padding: '0.5rem',
        borderRadius: 'var(--ux4g-radius-md)',
        boxShadow: 'var(--ux4g-shadow-md)',
        border: '1px solid var(--ux4g-border-subtle)',
      }}
    >
      <input
        type="text"
        placeholder="Search Map by ULPIN / Coordinates / Village..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="ux4g-input"
        style={{ width: '280px', fontSize: '0.85rem' }}
      />
      <Button type="submit" variant="primary" size="sm">
        Go
      </Button>
    </form>
  );
};

export default LocationSearch;
