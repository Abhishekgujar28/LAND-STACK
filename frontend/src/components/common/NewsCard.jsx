import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Common NewsCard component
 * Conforms to UX4G / GIGW press release guidelines
 */
export const NewsCard = ({ news, className = '' }) => {
  if (!news) return null;

  return (
    <div
      className={`common-news-card ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
        borderTop: '3px solid var(--primary, #064e3b)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderTopColor = 'var(--secondary, #ea580c)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderTopColor = 'var(--primary, #064e3b)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
          <span>📅</span>
          <span>{news.date}</span>
        </span>
        {news.category && (
          <span
            style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              background: 'var(--primary-light, #ecfdf5)',
              color: 'var(--primary, #064e3b)',
              border: '1px solid var(--primary-subtle, #d1fae5)',
              borderRadius: '4px',
              padding: '1px 6px',
            }}
          >
            {news.category}
          </span>
        )}
      </div>

      <div style={{ flex: 1, marginBottom: '0.75rem' }}>
        <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.98rem', fontWeight: 700, color: 'var(--ux4g-text, #0f172a)', lineHeight: 1.35 }}>
          {news.title}
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--ux4g-text-secondary, #475569)', margin: 0, lineHeight: 1.45 }}>
          {news.summary}
        </p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9' }}>
        <Link
          to="/about"
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--primary, #064e3b)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
          }}
        >
          <span>Read Release</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
