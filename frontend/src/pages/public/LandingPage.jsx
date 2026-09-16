import analyticsService from '../../services/analyticsService';
import publicService from '../../services/publicService';
import React from 'react';
import './LandingPage.css';

// Landing components
import Hero from '../../components/landing/Hero';
import NationalStatsBar from '../../components/landing/NationalStatsBar';
import QuickActions from '../../components/landing/QuickActions';
import FeaturedServices from '../../components/landing/FeaturedServices';
import StateSpotlight from '../../components/landing/StateSpotlight';
import NewsSection from '../../components/landing/NewsSection';
import DepartmentPortals from '../../components/landing/DepartmentPortals';
import ExternalLinksCarousel from '../../components/landing/ExternalLinksCarousel';

// Mock data

/**
 * LandingPage - National Land Stack Portal Landing Page
 * India's Unified Land Record & Cadastral Intelligence Platform
 */

const nationalStats = {};
const stateAnalytics = [];
const departments = [];
const services = [];
const news = [];

export const LandingPage = () => {
  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Will navigate to search results page
  };

  return (
    <div className="page-landing">
      {/* Hero Section */}
      <Hero onSearch={handleSearch} />

      {/* National Metrics Bar (Single Straight Row) */}
      <NationalStatsBar stats={nationalStats} />

      {/* Quick Access Services Section */}
      <section id="quick-access" className="landing-quick-access-section">
        <div className="ux4g-container">
          <div className="quick-access-header">
            <div className="quick-access-eyebrow-wrapper">
              <span className="eyebrow-accent-line left"></span>
              <span className="quick-access-badge">त्वरित नागरिक सेवाएं | Citizen Quick Access</span>
              <span className="eyebrow-accent-line right"></span>
            </div>
            <h2 className="quick-access-title">Quick Access Services</h2>
            <p className="quick-access-subtitle">Most used services at your fingertips</p>
          </div>
          <QuickActions />
        </div>
      </section>

      {/* Featured Services Grid */}
      <FeaturedServices services={services} />

      {/* State Spotlight */}
      <StateSpotlight stateAnalytics={stateAnalytics} />

      {/* Department Portals */}
      <DepartmentPortals departments={departments} />

      {/* Latest News */}
      <NewsSection news={news} />

      {/* External Links Carousel (बाह्य संकेतस्थळांचे दुवे) */}
      <ExternalLinksCarousel />
    </div>
  );
};

export default LandingPage;
