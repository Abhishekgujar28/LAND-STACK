import React from 'react';
import Card from '../ui/Card';

/**
 * KPIStat - Government officer KPI metric card
 */
export const KPIStat = ({
  title,
  value,
  subtitle,
  change,
  color,
  status = 'normal', // normal | danger | warning | success
  icon: IconProp,
  className = '',
}) => {
  const colorMap = {
    normal: 'var(--ux4g-primary)',
    danger: 'var(--ux4g-danger)',
    warning: 'var(--ux4g-warning)',
    success: 'var(--ux4g-success)',
  };

  const renderIcon = () => {
    if (!IconProp) return null;
    if (React.isValidElement(IconProp)) {
      return IconProp;
    }
    if (typeof IconProp === 'function' || (typeof IconProp === 'object' && IconProp?.$$typeof)) {
      const IconComponent = IconProp;
      return <IconComponent size={24} color={color || 'var(--ux4g-primary)'} />;
    }
    return IconProp;
  };

  return (
    <Card className={`gov-kpi-stat ${className}`.trim()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: color || colorMap[status] || colorMap.normal, margin: '0.2rem 0' }}>
            {value}
          </div>
          {change && <div style={{ fontSize: '0.75rem', fontWeight: 600, color: color || 'var(--ux4g-text-secondary)', marginBottom: '0.15rem' }}>{change}</div>}
          {subtitle && <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-muted)' }}>{subtitle}</div>}
        </div>
        {IconProp && (
          <div style={{ padding: '0.65rem', background: 'var(--ux4g-surface-muted)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {renderIcon()}
          </div>
        )}
      </div>
    </Card>
  );
};

export default KPIStat;
