import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Landing Page - QuickActions component (National)
 */
export const QuickActions = ({ className = '' }) => {
  const actions = [
    { label: 'View Record of Rights', icon: '📄', to: '/citizen/search' },
    { label: 'Check Mutation Status', icon: '🔍', to: '/citizen/mutations' },
    { label: 'Cadastral Map (Bhu-Naksha)', icon: '🗺️', to: '/services' },
    { label: 'Lodge Land Grievance', icon: '⚖️', to: '/contact' },
  ];

  return (
    <div
      className={`landing-quick-actions ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {actions.map((act, index) => (
        <Link
          key={index}
          to={act.to}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            background: 'var(--ux4g-surface)',
            borderRadius: 'var(--ux4g-radius-lg)',
            border: '1px solid var(--ux4g-border-subtle)',
            color: 'var(--ux4g-primary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: 'var(--ux4g-shadow-sm)',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{act.icon}</span>
          <span>{act.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
