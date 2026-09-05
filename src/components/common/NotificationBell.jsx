import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

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
        transition: 'all var(--ux4g-transition-fast)',
      }}
    >
      <Bell size={18} strokeWidth={2} />
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
            border: '2px solid #fff',
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
