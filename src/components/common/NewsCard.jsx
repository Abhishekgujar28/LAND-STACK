import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * Common NewsCard component
 */
export const NewsCard = ({ news, className = '' }) => {
  if (!news) return null;

  return (
    <Card className={`common-news-card ${className}`.trim()}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{news.date}</span>
          {news.category && <Badge variant="primary">{news.category}</Badge>}
        </div>
        <h4 style={{ margin: '0.25rem 0', fontSize: '1rem', color: 'var(--ux4g-primary)' }}>
          {news.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', margin: 0 }}>
          {news.summary}
        </p>
      </div>
    </Card>
  );
};

export default NewsCard;
