import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  FileCheck,
  Map,
  RefreshCw,
} from 'lucide-react';

/**
 * Landing Page - Hero Section
 * Strict WCAG AA contrast, concise placeholder, and 3 high-priority search chips
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

  // 3 high-priority citizen actions (Green = Static records, Orange = Active mutations)
  const topShowcaseServices = [
    { label: '7/12 & 8A RoR Extract', icon: FileCheck, path: '/citizen/search', type: 'green' },
    { label: 'Bhu-Naksha GIS Map', icon: Map, path: '/citizen/search', type: 'green' },
    { label: 'Track e-Ferfar Mutation', icon: RefreshCw, path: '/citizen/mutations', type: 'orange' },
  ];

  return (
    <section className={`landing-hero ${className}`.trim()}>
      <div className="ux4g-container hero-container">
        <div className="hero-content-left">
          {/* Eyebrow Badge */}
          <div className="hero-eyebrow-badge">
            <span className="eyebrow-dot"></span>
            <span className="eyebrow-text">ONE NATION • ONE LAND RECORD • DIGITAL INDIA</span>
          </div>

          {/* Hero Title with Unified Typography & Clear Emphasis */}
          <h1 className="hero-title">
            <span className="title-base">India’s Unified Land Record &amp;</span>
            <br />
            <span className="title-emphasis">Cadastral Intelligence Platform</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="hero-subtitle">
            Connecting spatial land records, parcel maps and verified citizen services across 36 States &amp; UTs for transparent land governance.
          </p>

          {/* Showcase Unified National Search Bar */}
          <div className="hero-showcase-wrapper">
            <form onSubmit={handleSubmit} className="hero-search-box">
              <span className="hero-search-icon">
                <Search size={19} strokeWidth={2.2} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ULPIN, Survey No., Village or District..."
                className="hero-search-input"
                aria-label="Search land records"
              />
              <button type="submit" className="hero-search-btn">
                <span>Search Records</span>
                <ArrowRight size={16} strokeWidth={2.4} />
              </button>
            </form>

            {/* Quick Access Pills (Max 3) */}
            <div className="hero-showcase-actions">
              <span className="hero-pills-label">Quick Search:</span>
              {topShowcaseServices.map((service, index) => {
                const IconComp = service.icon;
                return (
                  <Link
                    key={index}
                    to={service.path}
                    className={`showcase-chip chip-theme-${service.type}`}
                  >
                    <span className="chip-icon">
                      <IconComp size={14} strokeWidth={2.2} />
                    </span>
                    <span className="chip-label">{service.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
