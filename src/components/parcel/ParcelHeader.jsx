import React from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../ui/Button';

/**
 * ParcelHeader - Header banner for Parcel 360 view
 */
export const ParcelHeader = ({ parcel, onShare, onDownloadReport, className = '' }) => {
  if (!parcel) return null;

  return (
    <div
      className={`parcel-header ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--ux4g-border-subtle)',
        padding: '1.5rem 0',
        marginBottom: '1.5rem',
      }}
    >
      <div className="ux4g-container d-flex justify-between align-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
              PARCEL RECORD (360&deg; VIEW)
            </span>
            <StatusBadge status={parcel.status} />
          </div>
          <h2 style={{ margin: 0, fontFamily: 'var(--ux4g-font-mono)', color: 'var(--ux4g-primary)' }}>
            {parcel.ulpin}
          </h2>
          <div style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.25rem' }}>
            Village: {parcel.villageName} &bull; Survey/Gat: {parcel.gatNumber || parcel.surveyNumber} &bull; Area: {parcel.area} {parcel.areaUnit}
          </div>
        </div>

        <div className="d-flex align-center gap-2">
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              Share ULPIN
            </Button>
          )}
          {onDownloadReport && (
            <Button variant="primary" size="sm" onClick={onDownloadReport}>
              Download 360 Title Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParcelHeader;
