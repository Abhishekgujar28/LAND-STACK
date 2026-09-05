import React from 'react';
import './LandingPage.css';

// Landing components
import GovernmentStrip from '../../components/landing/GovernmentStrip';
import NoticeBar from '../../components/landing/NoticeBar';
import Hero from '../../components/landing/Hero';
import NationalStatsBar from '../../components/landing/NationalStatsBar';
import QuickActions from '../../components/landing/QuickActions';
import FeaturedServices from '../../components/landing/FeaturedServices';
import StateSpotlight from '../../components/landing/StateSpotlight';
import NewsSection from '../../components/landing/NewsSection';
import DepartmentPortals from '../../components/landing/DepartmentPortals';

// Mock data
import nationalStats from '../../data/analytics/national.json';
import stateAnalytics from '../../data/analytics/states.json';
import services from '../../data/services/governmentServices.json';
import news from '../../data/news/news.json';
import notices from '../../data/notices/notices.json';
import departments from '../../data/departments/departments.json';

/**
 * LandingPage - National Land Stack Portal Landing Page
 * India's Unified Land Record & Cadastral Intelligence Platform
 */
export const LandingPage = () => {
  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Will navigate to search results page
  };

  return (
    <div className="page-landing">
      {/* Government Identity Strip */}
      <GovernmentStrip />

      {/* Notice Ticker */}
      {/* <NoticeBar notices={notices} /> */}

      {/* Hero Section */}
      <Hero onSearch={handleSearch} />

      {/* National Metrics Bar */}
      <NationalStatsBar stats={nationalStats} />

      {/* Quick Actions */}
      <section id="quick-access" style={{ padding: '3.75rem 0 3rem', background: '#ffffff' }}>
        <div className="ux4g-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--primary-light, #ecfdf5)',
                color: 'var(--primary, #064e3b)',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                border: '1px solid var(--primary-subtle, #d1fae5)',
              }}
            >
              <span>⚡</span>
              <span>त्वरित नागरिक सेवाएं | Citizen Quick Access</span>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary, #064e3b)', margin: '0.2rem 0 0.4rem' }}>
              Quick Access Services
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary, #475569)', maxWidth: '720px', margin: '0 auto' }}>
              Frequently accessed citizen land records, cadastral map lookups, and online mutation tracking.
            </p>
            <div
              style={{
                width: '50px',
                height: '3px',
                background: 'var(--secondary, #ea580c)',
                margin: '0.75rem auto 0',
                borderRadius: '2px',
              }}
            />
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
    </div>
  );
};

export default LandingPage;
