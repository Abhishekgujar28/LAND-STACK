import React, { useState } from 'react';
import { Map, Compass, Layers, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * ParcelMap - Interactive Cadastral Polygon GIS Canvas representation with Lucide icons
 */
export const ParcelMap = ({ parcel, className = '' }) => {
  const [activeLayer, setActiveLayer] = useState('CADASTRE'); // 'CADASTRE' | 'SATELLITE' | 'BUFFER'
  const [zoomLevel, setZoomLevel] = useState(16);

  const lat = parcel?.latitude || 18.5793;
  const lng = parcel?.longitude || 73.9812;
  const sqm = parcel?.area ? (parcel.area * 10000).toLocaleString('en-IN') : '14,500';

  return (
    <Card
      className={`parcel-map ${className}`.trim()}
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={18} style={{ color: 'var(--ux4g-primary)' }} />
            <strong>BhuNaksha Cadastral GIS Plot Vector</strong>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <Badge variant="info">EPSG:4326 (WGS 84)</Badge>
            <Badge variant="primary">Martin MVT Layer</Badge>
          </div>
        </div>
      }
    >
      <div style={{ position: 'relative' }}>
        {/* Layer Controls Bar */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--ux4g-radius-md)',
            padding: '4px',
            display: 'flex',
            gap: '4px',
            boxShadow: 'var(--ux4g-shadow-sm)',
            border: '1px solid var(--ux4g-border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveLayer('CADASTRE')}
            style={{
              padding: '4px 8px',
              fontSize: '0.725rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              background: activeLayer === 'CADASTRE' ? 'var(--ux4g-primary)' : 'transparent',
              color: activeLayer === 'CADASTRE' ? '#fff' : 'var(--ux4g-text)',
            }}
          >
            Cadastre
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('SATELLITE')}
            style={{
              padding: '4px 8px',
              fontSize: '0.725rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              background: activeLayer === 'SATELLITE' ? 'var(--ux4g-primary)' : 'transparent',
              color: activeLayer === 'SATELLITE' ? '#fff' : 'var(--ux4g-text)',
            }}
          >
            SVAMITVA Ortho
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('BUFFER')}
            style={{
              padding: '4px 8px',
              fontSize: '0.725rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              background: activeLayer === 'BUFFER' ? 'var(--ux4g-primary)' : 'transparent',
              color: activeLayer === 'BUFFER' ? '#fff' : 'var(--ux4g-text)',
            }}
          >
            Buffer Overlay
          </button>
        </div>

        {/* Zoom Controls */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 'var(--ux4g-radius-md)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--ux4g-shadow-sm)',
            border: '1px solid var(--ux4g-border-subtle)',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 20))}
            style={{ border: 'none', background: 'none', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          <div style={{ height: '1px', background: '#e2e8f0' }} />
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 12))}
            style={{ border: 'none', background: 'none', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
        </div>

        {/* Interactive SVG Cadastral Map */}
        <div
          style={{
            width: '100%',
            height: '280px',
            background:
              activeLayer === 'SATELLITE'
                ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                : activeLayer === 'BUFFER'
                ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
                : 'linear-gradient(135deg, #f0fdf4 0%, #e2e8f0 100%)',
            borderRadius: 'var(--ux4g-radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--ux4g-border-subtle)',
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 500 280" preserveAspectRatio="none">
            {/* Grid Pattern */}
            <defs>
              <pattern id="cadastreGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="500" height="280" fill="url(#cadastreGrid)" />

            {/* Adjoining Plot 1 */}
            <polygon points="40,30 180,20 160,110 30,90" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="90" y="65" fontSize="11" fill="#64748b" fontWeight="600">Gat {Number(parcel?.gatNumber || 42) - 1}</text>

            {/* Adjoining Plot 2 */}
            <polygon points="340,50 470,30 460,170 330,150" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="390" y="100" fontSize="11" fill="#64748b" fontWeight="600">Gat {Number(parcel?.gatNumber || 42) + 1}</text>

            {/* Main Selected Cadastral Plot Polygon */}
            <polygon
              points="165,60 335,40 355,210 185,230"
              fill={activeLayer === 'BUFFER' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15, 40, 78, 0.18)'}
              stroke={activeLayer === 'BUFFER' ? '#dc2626' : 'var(--ux4g-primary)'}
              strokeWidth="3"
            />

            {/* Road Alignment Strip */}
            <line x1="0" y1="260" x2="500" y2="245" stroke="#c25e00" strokeWidth="6" strokeDasharray="8 4" opacity="0.8" />
            <text x="20" y="275" fontSize="10" fill="#c25e00" fontWeight="700">12m PMRDA DP Road Alignment</text>

            {/* Centroid Marker & Coordinates */}
            <circle cx="260" cy="135" r="7" fill="var(--ux4g-primary)" stroke="#ffffff" strokeWidth="2" />
            <circle cx="260" cy="135" r="14" fill="none" stroke="var(--ux4g-primary)" strokeWidth="1" opacity="0.5" />
            <text x="260" y="165" textAnchor="middle" fontSize="12" fill="var(--ux4g-primary)" fontWeight="800">
              Gat No. {parcel?.gatNumber || parcel?.gat_number || parcel?.gat || 'N/A'} ({sqm} sq.m)
            </text>
            <text x="260" y="180" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="600">
              {parcel?.ulpin || ''}
            </text>
          </svg>

          {/* Scale and North Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '10px',
              background: 'rgba(255,255,255,0.88)',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--ux4g-text-secondary)',
            }}
          >
            Scale: 1:2,500 &bull; Zoom: {zoomLevel}x
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '10px',
              background: 'rgba(255,255,255,0.88)',
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--ux4g-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <Compass size={13} />
            NORTH
          </div>
        </div>

        {/* Spatial Geo-Attributes Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.5rem',
            marginTop: '0.75rem',
            fontSize: '0.8rem',
            background: 'var(--ux4g-surface-muted)',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--ux4g-radius-md)',
          }}
        >
          <div>
            <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.725rem' }}>Centroid Latitude:</span>
            <div style={{ fontWeight: 600, fontFamily: 'var(--ux4g-font-mono)' }}>{lat}&deg; N</div>
          </div>
          <div>
            <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.725rem' }}>Centroid Longitude:</span>
            <div style={{ fontWeight: 600, fontFamily: 'var(--ux4g-font-mono)' }}>{lng}&deg; E</div>
          </div>
          <div>
            <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.725rem' }}>Calculated GIS Area:</span>
            <div style={{ fontWeight: 600 }}>{sqm} sq.m ({parcel?.area} Ha)</div>
          </div>
          <div>
            <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.725rem' }}>Cadastral Source:</span>
            <div style={{ fontWeight: 600 }}>BhuNaksha 4.0 / ETS</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ParcelMap;
