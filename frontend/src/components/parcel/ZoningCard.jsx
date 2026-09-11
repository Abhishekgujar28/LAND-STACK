import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * ZoningCard - Master plan zoning, town planning, reservation details
 */
export const ZoningCard = ({ zoning, className = '' }) => {
  if (!zoning) return null;

  return (
    <Card className={`parcel-zoning ${className}`.trim()} header={<strong>Master Plan & Development Authority Zoning</strong>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Planning Authority</span>
          <div style={{ fontWeight: 600 }}>{zoning.authority || 'PMRDA (Pune Metro)'}</div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Zone Category</span>
          <div>
            <Badge variant="primary">{zoning.zoneCategory || 'Agricultural / Green Zone'}</Badge>
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Development Permissibility</span>
          <div style={{ fontWeight: 600 }}>{zoning.permissibility || 'Permitted with NA Order'}</div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Reservation Status</span>
          <div style={{ fontWeight: 600 }}>{zoning.reservation || 'No Public Reservation'}</div>
        </div>
      </div>
    </Card>
  );
};

export default ZoningCard;
