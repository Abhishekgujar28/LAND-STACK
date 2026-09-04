import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * DataQualityCard - Cadastral registry anomaly detection & data quality card
 */
export const DataQualityCard = ({ item, onInvestigate, className = '' }) => {
  if (!item) return null;

  return (
    <Card className={`gov-data-quality-card ${className}`.trim()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
            ANOMALY ID: {item.id}
          </span>
          <h4 style={{ margin: '0.2rem 0', color: 'var(--ux4g-primary)' }}>{item.anomalyType}</h4>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
            {item.description}
          </p>
        </div>
        <Badge variant={item.severity === 'HIGH' ? 'danger' : item.severity === 'MEDIUM' ? 'warning' : 'info'}>
          {item.severity}
        </Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', borderTop: '1px solid var(--ux4g-border-subtle)', paddingTop: '0.5rem', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--ux4g-text-muted)' }}>Target: {item.targetEntity}</span>
        {onInvestigate && (
          <button
            type="button"
            onClick={() => onInvestigate(item)}
            style={{ background: 'none', border: 'none', color: 'var(--ux4g-primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Investigate &rarr;
          </button>
        )}
      </div>
    </Card>
  );
};

export default DataQualityCard;
