import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Landing Page - Hero Section (National Portal Showcase)
 * Spacious, authoritative hero designed to showcase national capabilities
 */
export const Hero = ({ onSearch, className = '' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) onSearch(searchQuery.trim());
      navigate(`/citizen/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/citizen/search');
    }
  };

  const showcaseServices = [
    { label: 'Record of Rights (7/12 & 8A)', icon: '📜', path: '/services' },
    { label: 'GIS Cadastral Bhu-Naksha', icon: '🗺️', path: '/citizen/search' },
    { label: 'e-Ferfar Online Mutation', icon: '⚡', path: '/citizen/mutation' },
    { label: 'Due Diligence & Charges', icon: '🛡️', path: '/citizen/due-diligence' },
    { label: 'ULPIN Bhu-Aadhaar Search', icon: '📍', path: '/citizen/search' },
  ];

  return (
    <section className={`landing-hero ${className}`.trim()}>
      <div className="ux4g-container" style={{ textAlign: 'center', maxWidth: '940px', position: 'relative', zIndex: 2 }}>
        {/* Hero Title */}
        <h1 className="hero-title">
          India's <span className="highlight">Unified Land Record</span> & Cadastral Intelligence Platform
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-subtitle">
          National Digital Public Infrastructure connecting 36 States & UTs — Access verified Record of Rights, cadastral survey boundaries, and automated deed-to-mutation workflows.
        </p>

        {/* Showcase Unified National Search Bar */}
        <div className="hero-showcase-wrapper">
          <form onSubmit={handleSubmit} className="hero-search-box">
            <span className="hero-search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any land parcel by ULPIN (Bhu-Aadhaar), Survey/Khasra No, Village, or Owner Name..."
              className="hero-search-input"
              aria-label="Search land records"
            />
            <button type="submit" className="hero-search-btn">
              <span>Search Records</span>
              <span>&rarr;</span>
            </button>
          </form>

          {/* Key Government Capabilities Showcase Chips */}
          <div className="hero-showcase-actions">
            {showcaseServices.map((service, index) => (
              <Link key={index} to={service.path} className="showcase-chip">
                <span>{service.icon}</span>
                <span>{service.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust & Standard Badges */}
        <div className="hero-badges">
          <span className="hero-badge">🔒 DigiLocker Verified</span>
          <span className="hero-badge">📍 14-Digit Bhu-Aadhaar</span>
          <span className="hero-badge">🏛️ Govt of India Certified</span>
          <span className="hero-badge">🌐 12 Indian Languages</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
