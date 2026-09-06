import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Landing Page - Hero Section (National Portal Showcase)
 * Matches the official reference design with left-aligned headline,
 * search box, 5 quick-action chips, key metrics, and value proposition pillars.
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
    { label: 'e-Ferfar (Online Mutation)', icon: '⇄', path: '/citizen/mutation' },
    { label: 'ULPIN Bhu-Aadhaar Search', icon: '📍', path: '/citizen/search' },
    { label: 'DigiLocker Verified', icon: '🛡️', path: '/citizen/due-diligence' },
  ];


  const valuePillars = [
    { title: 'Secure Land', desc: 'Stronger Communities', icon: '🍃' },
    { title: 'Transparent Governance', desc: 'Inclusive Growth', icon: '👥' },
    { title: 'Empowered Citizens', desc: 'Prosperous India', icon: '⚙️' },
  ];

  return (
    <section className={`landing-hero ${className}`.trim()}>
      <div className="ux4g-container hero-container">
        <div className="hero-content-left">
          {/* Eyebrow Tag */}
          <div className="hero-eyebrow">
            <span>ONE NATION</span>
            <span className="dot">•</span>
            <span>ONE LAND RECORD</span>
            <span className="dot">•</span>
            <span>BRIGHTER TOMORROW</span>
          </div>

          {/* Hero Title */}
          <h1 className="hero-title">
            India's Unified Land Record & Cadastral Intelligence Platform
          </h1>

          {/* Hero Subtitle */}
          <p className="hero-subtitle">
            Connecting land records, maps and services across 36 States & UTs for a transparent, efficient and inclusive land governance.
          </p>

          {/* Showcase Unified National Search Bar */}
          <div className="hero-showcase-wrapper">
            <form onSubmit={handleSubmit} className="hero-search-box">
              <span className="hero-search-icon">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any land parcel by ULPIN (Bhu-Aadhaar), Survey/Khasra No., Village, District"
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
                  <span className="chip-icon">{service.icon}</span>
                  <span className="chip-label">{service.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Value Pillars Strip centered at bottom */}
        <div className="hero-pillars-row">
          {valuePillars.map((pillar, index) => (
            <div key={index} className="hero-pillar-item">
              <span className="pillar-icon">{pillar.icon}</span>
              <div className="pillar-text">
                <div className="pillar-title">{pillar.title}</div>
                <div className="pillar-desc">{pillar.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
