import React, { useState } from 'react';
import Button from '../ui/Button';

/**
 * Common SearchBar component for cadastral / ULPIN / parcel lookups
 */
export const SearchBar = ({
  placeholder = 'Search by ULPIN (e.g. ULPIN-MH-PUN-000001), Survey No, or Owner Name...',
  onSearch,
  className = '',
  initialValue = '',
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`common-search-bar ${className}`.trim()}
      style={{
        display: 'flex',
        gap: '0.5rem',
        width: '100%',
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search land records"
        className="ux4g-input"
        style={{ flex: 1 }}
      />
      <Button type="submit" variant="primary">
        Search Records
      </Button>
    </form>
  );
};

export default SearchBar;
