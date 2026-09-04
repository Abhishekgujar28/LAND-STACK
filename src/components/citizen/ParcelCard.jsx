import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../common/StatusBadge';

/**
 * ParcelCard - Citizen domain parcel overview card
 */
export const ParcelCard = ({ parcel, className = '' }) => {
  if (!parcel) return null;

  return (
    <Card className={`citizen-parcel-card ${className}`.trim()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)', letterSpacing: '0.04em' }}>
            ULPIN
          </span>
          <h4 style={{ margin: '0.1rem 0 0', fontSize: '1.05rem', color: 'var(--ux4g-primary)', fontFamily: 'var(--ux4g-font-mono)' }}>
            {parcel.ulpin}
          </h4>
        </div>
        <StatusBadge status={parcel.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Gat / Survey No:</span>
          <div style={{ fontWeight: 600 }}>{parcel.gatNumber || parcel.surveyNumber || 'N/A'}</div>
        </div>
        <div>
          <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Area:</span>
          <div style={{ fontWeight: 600 }}>{parcel.area} {parcel.areaUnit}</div>
        </div>
        <div>
          <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Village / Tehsil:</span>
          <div style={{ fontWeight: 600 }}>{parcel.villageName}, {parcel.tehsilCode}</div>
        </div>
        <div>
          <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Land Use:</span>
          <div style={{ fontWeight: 600 }}>{parcel.landUse}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--ux4g-border-subtle)', paddingTop: '0.75rem' }}>
        <Link to={`/citizen/parcels/${parcel.ulpin}`}>
          <Button variant="outline" size="sm">
            Parcel 360 View
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ParcelCard;
