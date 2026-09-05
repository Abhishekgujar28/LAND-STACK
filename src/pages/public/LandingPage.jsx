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
      <section style={{ padding: '2.5rem 0', background: '#ffffff' }}>
        <div className="ux4g-container">
          <div className="section-header">
            <h2>Quick Access</h2>
            <p>Most frequently used land record services</p>
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
