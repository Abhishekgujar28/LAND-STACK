import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ServiceCard - Domain presentation card for government land records services
 * Conforms to UX4G & GIGW standards
 */
export const ServiceCard = ({ service, className = '' }) => {
  if (!service) return null;

  return (
    <div
      className={`common-service-card ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
        borderTop: '3px solid var(--primary, #064e3b)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-light, #ecfdf5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            border: '1px solid var(--primary-subtle, #d1fae5)',
          }}
        >
          {service.icon || '📜'}
        </div>
        {service.category && (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              background: '#f1f5f9',
              color: '#475569',
              padding: '2px 7px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {service.category}
          </span>
        )}
      </div>

      <div style={{ flex: 1, marginBottom: '0.75rem' }}>
        <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.02rem', fontWeight: 700, color: 'var(--primary, #064e3b)', lineHeight: 1.3 }}>
          {service.name}
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--ux4g-text-secondary, #475569)', margin: 0, lineHeight: 1.45 }}>
          {service.shortDescription}
        </p>
      </div>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: '0.65rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
          {service.requiresLogin ? '🔒 Aadhaar Required' : '🌐 Direct Access'}
        </span>
        <Link
          to={service.route || '/services'}
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--primary, #064e3b)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
          }}
        >
          <span>Access Service</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
