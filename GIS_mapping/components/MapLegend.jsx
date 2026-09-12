/**
 * GIS_mapping/components/MapLegend.jsx
 *
 * Compact map legend popup for the citizen GIS dashboard.
 */
import React, { useState } from 'react';
import { Flag, X } from 'lucide-react';

const LEGEND_ITEMS = [
  { color: '#16a34a', border: '#15803d', fill: true,  label: 'Selected / My Parcel (CLEAR)' },
  { color: '#ffffff', border: '#475569', fill: false, label: 'Other Parcels' },
  { color: '#f59e0b', border: '#d97706', fill: true,  label: 'Pending Mutation' },
  { color: '#ef4444', border: '#dc2626', fill: true,  label: 'Disputed / Court Case' },
  { color: '#8b5cf6', border: '#7c3aed', fill: true,  label: 'Restricted Area' },
  { color: '#f97316', border: '#ea580c', fill: true,  label: 'Record / Boundary Issue' },
];

const LINE_ITEMS = [
  { color: '#1e40af', label: 'Village Boundary', dash: false },
  { color: '#6b7280', label: 'Ward Boundary', dash: true },
  { color: '#92400e', label: 'Tehsil Boundary', dash: true },
  { color: '#ea580c', label: 'Road / Farm Path', dash: true },
  { color: '#0284c7', label: 'Water Body', dash: false },
];

const MapLegend = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        id="gis-legend-btn"
        className={`gis-map-action-btn${isOpen ? ' active' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls="gis-legend-panel"
        aria-label="Toggle map legend"
      >
        <Flag size={15} />
        <span>Legend</span>
      </button>

      {isOpen && (
        <div
          id="gis-legend-panel"
          className="gis-legend-panel"
          role="dialog"
          aria-label="Map legend"
        >
          <div className="layer-panel-header">
            <span>Map Legend</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="layer-close-btn"
              aria-label="Close legend"
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ padding: '0.75rem' }}>
            <div className="legend-section-title">Parcel Status</div>
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="legend-item">
                <div
                  className="legend-swatch"
                  style={{
                    background: item.fill ? item.color + '55' : 'transparent',
                    border: `2px solid ${item.border}`,
                  }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </div>
            ))}

            <div className="legend-section-title" style={{ marginTop: '0.75rem' }}>
              Lines & Boundaries
            </div>
            {LINE_ITEMS.map((item) => (
              <div key={item.label} className="legend-item">
                <div
                  className="legend-line"
                  style={{
                    background: item.color,
                    borderTop: item.dash ? `2px dashed ${item.color}` : `2px solid ${item.color}`,
                  }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </div>
            ))}

            <p className="legend-disclaimer">
              ⚠ Prototype / Synthetic cadastral geometry. Not an official record.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
