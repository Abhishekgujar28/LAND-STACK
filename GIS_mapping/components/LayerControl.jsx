/**
 * GIS_mapping/components/LayerControl.jsx
 *
 * Simple layer switcher dropdown panel for the citizen GIS map.
 * Three sections: Reference Layers / Land Layers / Urban Pilot.
 */
import React, { useState, useRef, useEffect } from 'react';
import { Layers, ChevronDown, X } from 'lucide-react';

const DEFAULT_LAYERS = {
  // Reference
  roads: true,
  admin: false,
  settle: false,
  water: false,
  terrain: false,
  // Land
  cadastral: true,
  my_land: true,
  gat_labels: false,
  ulpin_lbls: false,
  land_use: false,
  // Urban
  pune_wards: false,
};

const REFERENCE_LAYERS = [
  { id: 'roads',   label: 'Roads' },
  { id: 'admin',   label: 'Administrative Boundaries' },
  { id: 'settle',  label: 'Settlements' },
  { id: 'water',   label: 'Water Bodies' },
  { id: 'terrain', label: 'Terrain' },
];

const LAND_LAYERS = [
  { id: 'cadastral',  label: 'Cadastral Parcels' },
  { id: 'my_land',    label: 'Selected / My Property' },
  { id: 'gat_labels', label: 'Survey / Gat Labels' },
  { id: 'ulpin_lbls', label: 'ULPIN Labels' },
  { id: 'land_use',   label: 'Land Use' },
];

const URBAN_LAYERS = [
  { id: 'pune_wards', label: 'Pune Ward Boundaries' },
];

const LayerControl = ({ onLayersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const toggle = (layerId) => {
    const updated = { ...layers, [layerId]: !layers[layerId] };
    setLayers(updated);
    onLayersChange?.(updated);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderGroup = (title, layerDefs) => (
    <div className="layer-group">
      <div className="layer-group-title">{title}</div>
      {layerDefs.map((l) => (
        <label key={l.id} className="layer-item">
          <input
            type="checkbox"
            checked={layers[l.id]}
            onChange={() => toggle(l.id)}
            aria-label={`Toggle ${l.label} layer`}
          />
          <span>{l.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="layer-control-wrapper" style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        type="button"
        id="gis-layers-btn"
        className={`gis-map-action-btn${isOpen ? ' active' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls="layer-control-panel"
        aria-label="Toggle map layers"
      >
        <Layers size={15} />
        <span>Layers</span>
        <ChevronDown size={13} style={{ marginLeft: 2, transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id="layer-control-panel"
          className="layer-control-panel"
          role="dialog"
          aria-label="Map layer controls"
        >
          <div className="layer-panel-header">
            <span>Map Layers</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="layer-close-btn"
              aria-label="Close layer panel"
            >
              <X size={14} />
            </button>
          </div>
          {renderGroup('Reference Layers', REFERENCE_LAYERS)}
          {renderGroup('Land Layers', LAND_LAYERS)}
          {renderGroup('Urban Pilot', URBAN_LAYERS)}
        </div>
      )}
    </div>
  );
};

export default LayerControl;
