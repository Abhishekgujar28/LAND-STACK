import React, { useState } from 'react';
import MapControls from './MapControls';
import LocationSearch from './LocationSearch';

/**
 * MapContainer - Cadastral GIS interactive map container
 */
export const MapContainer = ({
  height = '500px',
  center = { lat: 18.5204, lng: 73.8567 },
  children,
  className = '',
}) => {
  const [zoom, setZoom] = useState(14);
  const [isSatellite, setIsSatellite] = useState(false);

  return (
    <div
      className={`cadastral-map-container ${className}`.trim()}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 'var(--ux4g-radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--ux4g-border)',
        background: isSatellite
          ? '#1e293b'
          : 'linear-gradient(135deg, #eef2f6 0%, #dbeafe 100%)',
      }}
    >
      <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 10 }}>
        <LocationSearch onSearch={(q) => console.log('Searching map for:', q)} />
      </div>

      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
        <MapControls
          onZoomIn={() => setZoom((z) => Math.min(20, z + 1))}
          onZoomOut={() => setZoom((z) => Math.max(1, z - 1))}
          onToggleSatellite={() => setIsSatellite((s) => !s)}
          onToggleBoundaries={() => console.log('Toggled boundaries')}
        />
      </div>

      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: isSatellite ? '#f8fafc' : 'var(--ux4g-text-secondary)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗺️</div>
        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
          Mahabhunaksha Cadastral Map Engine
        </div>
        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
          Center: {center.lat}, {center.lng} &bull; Zoom Level: {zoom} &bull; Mode: {isSatellite ? 'Satellite Imagery' : 'Vector Cadastral'}
        </div>
        {children}
      </div>
    </div>
  );
};

export default MapContainer;
