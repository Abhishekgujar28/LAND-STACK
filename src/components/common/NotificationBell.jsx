import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Common NotificationBell component with badge counter
 */
export const NotificationBell = ({ count = 0, to = '/citizen/notifications', className = '' }) => {
  return (
    <Link
      to={to}
      className={`common-notification-bell ${className}`.trim()}
      aria-label={`Notifications (${count} unread)`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'var(--ux4g-surface-muted)',
        color: 'var(--ux4g-text)',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: '1.2rem' }} role="img" aria-hidden="true">🔔</span>
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: 'var(--ux4g-danger)',
            color: '#fff',
            borderRadius: '999px',
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '0.1rem 0.35rem',
            lineHeight: 1,
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
