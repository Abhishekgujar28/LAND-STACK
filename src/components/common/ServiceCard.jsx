import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * ServiceCard - Domain presentation card for government land records services
 */
export const ServiceCard = ({
  service,
  className = '',
}) => {
  if (!service) return null;

  return (
    <Card className={`common-service-card ${className}`.trim()}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: 'var(--ux4g-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
            }}
          >
            {service.icon || '📜'}
          </div>
          {service.category && (
            <Badge variant="neutral">{service.category}</Badge>
          )}
        </div>
        <div>
          <h4 style={{ margin: '0.25rem 0', fontSize: '1.05rem', color: 'var(--ux4g-primary)' }}>
            {service.name}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', margin: 0 }}>
            {service.shortDescription}
          </p>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
            {service.requiresLogin ? '🔒 Login Required' : '🌐 Open Access'}
          </span>
          <Link
            to={service.route || '/services'}
            style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ux4g-primary)' }}
          >
            Access Service &rarr;
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
