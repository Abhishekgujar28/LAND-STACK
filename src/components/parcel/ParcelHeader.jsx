import React from 'react';
import { Share2, Download, MapPin, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import Button from '../ui/Button';

/**
 * ParcelHeader - Header banner for Parcel 360 view with Lucide icons
 */
export const ParcelHeader = ({ parcel, onShare, onDownloadReport, className = '' }) => {
  if (!parcel) return null;

  return (
    <div
      className={`parcel-header ${className}`.trim()}
      style={{
        background: '#ffffff',
        border: '1px solid var(--ux4g-border-subtle)',
        borderRadius: 'var(--ux4g-radius-lg)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--ux4g-shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)', letterSpacing: '0.04em' }}>
              PARCEL RECORD (360° VIEW)
            </span>
            <StatusBadge status={parcel.status} />
          </div>
          <h2 style={{ margin: 0, fontFamily: 'var(--ux4g-font-mono)', color: 'var(--ux4g-primary)', fontWeight: 700, fontSize: '1.4rem' }}>
            {parcel.ulpin}
          </h2>
          <div style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} style={{ color: 'var(--ux4g-primary)' }} />
              Village: <strong>{parcel.villageName}</strong>
            </span>
            &bull;
            <span>Survey / Gat: <strong>{parcel.gatNumber || parcel.surveyNumber}</strong></span>
            &bull;
            <span>Area: <strong>{parcel.area} {parcel.areaUnit}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Share2 size={14} />
                Share Link
              </span>
            </Button>
          )}
          {onDownloadReport && (
            <Button variant="primary" size="sm" onClick={onDownloadReport}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Download size={14} />
                Download 360 Title Report
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParcelHeader;
