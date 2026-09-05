import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import StatusBadge from '../common/StatusBadge';

/**
 * ParcelCard - Citizen domain cadastral parcel overview card
 */
export const ParcelCard = ({ parcel, className = '' }) => {
  if (!parcel) return null;

  const gunthaApprox = parcel.area ? (parcel.area * 100).toFixed(0) : '0';

  const getBorderColor = () => {
    switch (parcel.status) {
      case 'CLEAR':
        return 'var(--ux4g-success)';
      case 'ENCUMBERED':
        return 'var(--ux4g-warning)';
      case 'RESTRICTED':
      case 'DISPUTED':
        return 'var(--ux4g-danger)';
      default:
        return 'var(--ux4g-primary)';
    }
  };

  return (
    <Card className={`citizen-parcel-card ${className}`.trim()} style={{ borderTop: `4px solid ${getBorderColor()}` }}>
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ux4g-text-muted)', letterSpacing: '0.04em' }}>
                BHU-AADHAAR / ULPIN
              </span>
              <Badge variant="primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                {parcel.stateCode || 'MH'}
              </Badge>
            </div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--ux4g-primary)', fontFamily: 'var(--ux4g-font-mono)' }}>
              {parcel.ulpin}
            </h4>
          </div>
          <StatusBadge status={parcel.status} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            fontSize: '0.85rem',
            background: 'var(--ux4g-surface-muted)',
            padding: '0.75rem',
            borderRadius: 'var(--ux4g-radius-md)',
            marginBottom: '0.75rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.725rem' }}>Gat / Survey:</span>
            <div style={{ fontWeight: 600 }}>{parcel.gatNumber || parcel.surveyNumber || 'N/A'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.725rem' }}>Area (Ha / Guntha):</span>
            <div style={{ fontWeight: 600 }}>{parcel.area} {parcel.areaUnit} <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>({gunthaApprox} R)</span></div>
          </div>
          <div>
            <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.725rem' }}>Village / Tehsil:</span>
            <div style={{ fontWeight: 600 }}>{parcel.villageName}, {parcel.tehsilCode || 'Haveli'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.725rem' }}>Land Use / Class:</span>
            <div style={{ fontWeight: 600 }}>{parcel.landUse}</div>
          </div>
        </div>

        {parcel.classification && (
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', marginBottom: '0.5rem' }}>
            Classification: <strong>{parcel.classification}</strong> &bull; Source: {parcel.source || 'e-Mahabhumi'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--ux4g-border-subtle)', padding: '0.65rem 1.25rem', background: '#fafbfc' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
          Lat: {parcel.latitude || '18.52'}° N
        </span>
        <Link to={`/citizen/parcels/${parcel.ulpin}`}>
          <Button variant="outline" size="sm">
            Parcel 360&deg; Title Dossier →
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ParcelCard;
