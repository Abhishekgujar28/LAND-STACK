import React from 'react';
import NewsCard from '../common/NewsCard';

/**
 * Landing Page - NewsSection component (National)
 * Conforms to UX4G / GIGW standards
 */
export const NewsSection = ({ news = [], className = '' }) => {
  return (
    <section
      className={`landing-news-section ${className}`.trim()}
      style={{
        padding: '3.5rem 0',
        background: 'var(--ux4g-bg, #f8fafc)',
        borderTop: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
      }}
    >
      <div className="ux4g-container">
        {/* Government Section Header (GIGW / PM GatiShakti style) */}
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
            <span>📢</span>
            <span>नवीनतम समाचार एवं प्रेस विज्ञप्तियां | Press Releases & Notifications</span>
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary, #064e3b)', margin: '0.2rem 0 0.4rem' }}>
            Latest News & Announcements
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary, #475569)', maxWidth: '720px', margin: '0 auto' }}>
            Updates on cadastral reforms, Bhu-Aadhaar integration, and national land governance initiatives from the Department of Land Resources.
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

        {/* News Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
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
