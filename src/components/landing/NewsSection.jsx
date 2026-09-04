import React from 'react';
import NewsCard from '../common/NewsCard';

/**
 * Landing Page - NewsSection component (National)
 */
export const NewsSection = ({ news = [], className = '' }) => {
  return (
    <section className={`landing-news-section ${className}`.trim()} style={{ padding: '3.5rem 0' }}>
      <div className="ux4g-container">
        <div className="section-header">
          <h2>Latest News & Announcements</h2>
          <p>Updates on DILRMP progress, cadastral reforms, and national land governance initiatives</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {news.slice(0, 4).map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
