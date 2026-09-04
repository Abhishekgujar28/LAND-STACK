import React from 'react';
import SearchBar from '../common/SearchBar';

/**
 * Landing Page - Hero Section (National-level branding)
 */
export const Hero = ({ onSearch, className = '' }) => {
  return (
    <section className={`landing-hero ${className}`.trim()}>
      <div className="ux4g-container" style={{ textAlign: 'center', maxWidth: '900px' }}>
        <h1 className="hero-title">
          India's <span className="highlight">Unified Land Record</span> &
          Cadastral Intelligence Platform
        </h1>
        <p className="hero-subtitle">
          Access verified Record of Rights, land holding statements, cadastral maps,
          and online mutation workflows across all states — powered by ULPIN (Bhu-Aadhaar).
        </p>
        <div className="hero-search-wrapper">
          <SearchBar onSearch={onSearch} placeholder="Search by ULPIN, Survey/Khasra No, or Owner Name..." />
        </div>
        <div className="hero-badges">
          <span className="hero-badge">🔒 DigiLocker Verified</span>
          <span className="hero-badge">📍 ULPIN Enabled</span>
          <span className="hero-badge">🏛️ DILRMP Compliant</span>
          <span className="hero-badge">🌐 12 Languages</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
