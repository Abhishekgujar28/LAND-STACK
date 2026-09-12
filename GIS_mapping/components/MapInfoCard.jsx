/**
 * GIS_mapping/components/MapInfoCard.jsx
 *
 * Bottom info strip showing map metadata: coordinates, CRS, data source, scale.
 * Includes the mandatory prototype disclaimer when synthetic cadastral data is displayed.
 */
import React from 'react';
import { Info, MapPin, Database, Layers } from 'lucide-react';

const MapInfoCard = ({ centerLat = 18.5793, centerLng = 73.9812, scale = '1 : 2,500' }) => {
  return (
    <div className="map-info-card" role="complementary" aria-label="Map information">
      <div className="map-info-inner">
        {/* Title */}
        <div className="map-info-title">
          <Info size={14} aria-hidden="true" />
          Map Information
        </div>

        <div className="map-info-grid">
          {/* Center Coordinates */}
          <div className="map-info-item">
            <MapPin size={13} className="map-info-item-icon" aria-hidden="true" />
            <div>
              <div className="map-info-label">Center Coordinates</div>
              <div className="map-info-value">
                {centerLat.toFixed(4)}° N, {centerLng.toFixed(4)}° E
              </div>
            </div>
          </div>

          {/* CRS */}
          <div className="map-info-item">
            <Layers size={13} className="map-info-item-icon" aria-hidden="true" />
            <div>
              <div className="map-info-label">CRS</div>
              <div className="map-info-value">EPSG:4326 / WGS 84</div>
            </div>
          </div>

          {/* Data Source */}
          <div className="map-info-item">
            <Database size={13} className="map-info-item-icon" aria-hidden="true" />
            <div>
              <div className="map-info-label">Data Source</div>
              <div className="map-info-value">Bharat Maps (NIC) + Cadastral Prototype</div>
            </div>
          </div>

          {/* Scale */}
          <div className="map-info-item">
            <Info size={13} className="map-info-item-icon" aria-hidden="true" />
            <div>
              <div className="map-info-label">Scale</div>
              <div className="map-info-value">{scale}</div>
            </div>
          </div>
        </div>

        {/* Prototype disclaimer */}
        <div className="map-info-disclaimer" role="note" aria-label="Data disclaimer">
          ⚠ Cadastral layer: Prototype / Synthetic — Not an official government cadastral record.
        </div>
      </div>
    </div>
  );
};

export default MapInfoCard;
