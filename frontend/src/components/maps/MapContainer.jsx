import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import MapControls from './MapControls';
import LocationSearch from './LocationSearch';

/**
 * MapContainer - Cadastral GIS interactive map container
 * Backed by Leaflet with Esri Satellite and Carto Vector layers.
 */
export const MapContainer = ({
  height = '500px',
  center = { lat: 18.5793, lng: 73.9812 },
  zoom: initialZoom = 15,
  children,
  className = '',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [zoom, setZoom] = useState(initialZoom);
  const [isSatellite, setIsSatellite] = useState(true);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
      });

      map.on('zoomend', () => {
        setZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    if (isSatellite) {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Esri World Imagery' }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, attribution: 'CartoDB Light' }
      ).addTo(map);
    }
  }, [isSatellite]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div
      className={`cadastral-map-container ${className}`.trim()}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--ux4g-border)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        background: '#0f172a',
      }}
    >
      <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 500 }}>
        <LocationSearch
          onSearch={(q) => {
            if (mapInstanceRef.current) {
              console.log('Searching map for location:', q);
            }
          }}
        />
      </div>

      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 500 }}>
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onToggleSatellite={() => setIsSatellite((s) => !s)}
          onToggleBoundaries={() => console.log('Toggled boundaries')}
        />
      </div>

      {/* Real Leaflet Map Instance */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* Optional Children Overlay */}
      {children && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default MapContainer;
