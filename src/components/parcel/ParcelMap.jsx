import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * ParcelMap - Cadastral polygon GIS representation container
 */
export const ParcelMap = ({ parcel, className = '' }) => {
  return (
    <Card
      className={`parcel-map ${className}`.trim()}
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <strong>Mahabhunaksha Cadastral Map Polygon</strong>
          <Badge variant="info">GIS Survey Coordinates</Badge>
        </div>
      }
    >
      <div
        style={{
          width: '100%',
          height: '280px',
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
          borderRadius: 'var(--ux4g-radius-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ux4g-text-secondary)',
          position: 'relative',
          border: '1px dashed var(--ux4g-border)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗺️</div>
        <div style={{ fontWeight: 600 }}>Cadastral Plot Boundary (Polygon)</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>
          Lat: {parcel?.latitude || '18.5204'} &bull; Long: {parcel?.longitude || '73.8567'}
        </div>
      </div>
    </Card>
  );
};

export default ParcelMap;
