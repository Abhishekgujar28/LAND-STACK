import React from 'react';
import Card from '../ui/Card';

/**
 * Common StatCard component for KPI and land record stats
 */
export const StatCard = ({
  label,
  value,
  subtext,
  icon,
  trend,
  className = '',
}) => {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || (typeof icon === 'object' && icon?.$$typeof)) {
      const IconComponent = icon;
      return <IconComponent size={24} />;
    }
    return icon;
  };

  return (
    <Card className={`common-stat-card ${className}`.trim()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ux4g-primary)', margin: '0.25rem 0' }}>
            {value}
          </div>
          {subtext && (
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
              {trend && <span style={{ color: trend > 0 ? 'var(--ux4g-success)' : 'var(--ux4g-danger)', fontWeight: 600, marginRight: '0.25rem' }}>{trend > 0 ? `+${trend}%` : `${trend}%`}</span>}
              {subtext}
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--ux4g-surface-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            {renderIcon()}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
