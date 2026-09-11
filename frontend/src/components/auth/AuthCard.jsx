import React from 'react';
import Card from '../ui/Card';

/**
 * AuthCard wrapper for login, OTP, and role-selection screens
 */
export const AuthCard = ({ title, subtitle, children, footer, className = '' }) => {
  return (
    <Card
      className={`auth-card ${className}`.trim()}
      style={{
        maxWidth: '460px',
        margin: '2rem auto',
        boxShadow: 'var(--ux4g-shadow-md)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {title && <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h2>}
        {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-secondary)', margin: 0 }}>{subtitle}</p>}
      </div>
      <div>{children}</div>
      {footer && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--ux4g-border-subtle)', textAlign: 'center', fontSize: '0.85rem' }}>
          {footer}
        </div>
      )}
    </Card>
  );
};

export default AuthCard;
