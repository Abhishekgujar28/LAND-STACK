import React from 'react';
import Button from '../ui/Button';

/**
 * MapControls - Zoom, layers, cadastral boundary toggle controls
 */
export const MapControls = ({
  onZoomIn,
  onZoomOut,
  onToggleSatellite,
  onToggleBoundaries,
  className = '',
}) => {
  return (
    <div
      className={`map-controls ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        background: 'var(--ux4g-surface)',
        padding: '0.4rem',
        borderRadius: 'var(--ux4g-radius-md)',
        boxShadow: 'var(--ux4g-shadow-md)',
        border: '1px solid var(--ux4g-border-subtle)',
      }}
    >
      <Button variant="outline" size="sm" onClick={onZoomIn} title="Zoom In">+</Button>
      <Button variant="outline" size="sm" onClick={onZoomOut} title="Zoom Out">-</Button>
      <Button variant="ghost" size="sm" onClick={onToggleSatellite} title="Satellite View">🛰️</Button>
      <Button variant="ghost" size="sm" onClick={onToggleBoundaries} title="Toggle Cadastral Gat Polygons">📐</Button>
    </div>
  );
};

export default MapControls;
