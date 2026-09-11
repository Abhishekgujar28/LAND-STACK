import React from 'react';

/**
 * Landing Page - NoticeBar component (Ticker/Scroll of important alerts)
 */
export const NoticeBar = ({ notices = [], className = '' }) => {
  if (!notices || notices.length === 0) return null;

  return (
    <div
      className={`landing-notice-bar ${className}`.trim()}
      style={{
        background: '#fff3cd',
        borderBottom: '1px solid #ffeeba',
        color: '#856404',
        padding: '0.5rem 0',
        fontSize: '0.85rem',
      }}
    >
      <div className="ux4g-container d-flex align-center gap-3">
        <span
          style={{
            background: 'var(--ux4g-warning)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.72rem',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--ux4g-radius-sm)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Notice
        </span>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}>
          {notices[0]?.title || 'Notice: e-Ferfar mutation services scheduled maintenance this Sunday 01:00 AM - 04:00 AM.'}
        </div>
      </div>
    </div>
  );
};

export default NoticeBar;
