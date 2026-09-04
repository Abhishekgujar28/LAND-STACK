import React from 'react';
import Card from '../ui/Card';

/**
 * KPIStat - Government officer KPI metric card
 */
export const KPIStat = ({
  title,
  value,
  subtitle,
  status = 'normal', // normal | danger | warning | success
  icon,
  className = '',
}) => {
  const colorMap = {
    normal: 'var(--ux4g-primary)',
    danger: 'var(--ux4g-danger)',
    warning: 'var(--ux4g-warning)',
    success: 'var(--ux4g-success)',
  };

  return (
    <Card className={`gov-kpi-stat ${className}`.trim()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: colorMap[status] || colorMap.normal, margin: '0.2rem 0' }}>
            {value}
          </div>
          {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{subtitle}</div>}
        </div>
        {icon && (
          <div style={{ fontSize: '1.6rem', padding: '0.5rem', background: 'var(--ux4g-surface-muted)', borderRadius: '10px' }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default KPIStat;
