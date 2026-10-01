import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  CheckCircle2,
  Layers,
  Globe,
  RotateCcw,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Sparkles,
} from 'lucide-react';
import { defaultStateAnalytics } from '../../data/landingData';

/**
 * StateSpotlight - Interactive National Cadastral GIS & Performance Benchmarking Dashboard
 * Powered by Leaflet GIS with Vector/Satellite basemap switching, state cluster pins,
 * interactive tooltips, and real-time state dossier synchronization.
 */
export const StateSpotlight = ({ stateAnalytics = [], className = '' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [isSatellite, setIsSatellite] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  // Authoritative State Analytics Dataset (Merged with API response)
  const activeStates = defaultStateAnalytics.map((defaultSt) => {
    const fromApi = (stateAnalytics || []).find(
      (a) => (a.stateCode || a.code) === defaultSt.stateCode
    );
    if (!fromApi) return defaultSt;
    return {
      ...defaultSt,
      ...fromApi,
      totalParcels: (fromApi.totalParcels && fromApi.totalParcels > 1000) ? fromApi.totalParcels : defaultSt.totalParcels,
      ulpinCoverage: fromApi.ulpinCoverage || defaultSt.ulpinCoverage,
      digitizedRoRPercent: fromApi.digitizedRoRPercent || defaultSt.digitizedRoRPercent,
      avgMutationDays: fromApi.avgMutationDays || defaultSt.avgMutationDays,
      status: defaultSt.status,
    };
  });

  const [selectedStateCode, setSelectedStateCode] = useState('MH');

  const regions = [
    { id: 'ALL', label: 'All Regions (36 States & UTs)' },
    { id: 'West', label: 'Western' },
    { id: 'North', label: 'Northern' },
    { id: 'South', label: 'Southern' },
    { id: 'Central', label: 'Central & East' },
  ];

  const filteredStates =
    selectedRegion === 'ALL'
      ? activeStates
      : activeStates.filter((s) => {
          if (selectedRegion === 'Central') return s.region === 'Central' || s.region === 'East';
          return s.region === selectedRegion;
        });

  // Limit table view to top 5-6 states
  const displayedStates = filteredStates.slice(0, 6);

  const selectedState =
    activeStates.find((s) => s.stateCode === selectedStateCode) ||
    activeStates[0] ||
    {};

  const formatParcels = (num) => {
    if (!num) return '0';
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
    return num.toLocaleString('en-IN');
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.0, 78.5],
        zoom: 4.6,
        minZoom: 3.5,
        maxZoom: 9,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
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

  // Update Basemap Tiles
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
        { maxZoom: 18 }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 18, subdomains: 'abcd' }
      ).addTo(map);
    }
  }, [isSatellite]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (markersGroupRef.current) {
      map.removeLayer(markersGroupRef.current);
    }

    const group = L.layerGroup().addTo(map);
    markersGroupRef.current = group;

    filteredStates.forEach((st) => {
      if (!st.lat || !st.lng) return;
      const isSelected = st.stateCode === selectedStateCode;
      const isTop = (st.ulpinCoverage || 0) >= 98;

      const iconHtml = `
        <div class="state-pin-badge ${isTop ? 'top-performer' : 'good-progress'} ${isSelected ? 'selected' : ''}" style="
          width: ${isSelected ? '36px' : '30px'};
          height: ${isSelected ? '36px' : '30px'};
          border-radius: 50%;
          background: ${isSelected ? '#ea580c' : isTop ? '#064e3b' : '#047857'};
          color: #ffffff;
          font-weight: 800;
          font-size: ${isSelected ? '12px' : '10px'};
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2.5px solid #ffffff;
          box-shadow: ${isSelected ? '0 0 0 6px rgba(234, 88, 12, 0.4), 0 4px 10px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.25)'};
          font-family: 'Inter', system-ui, sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          ${st.stateCode}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'leaflet-state-marker-wrapper',
        iconSize: isSelected ? [36, 36] : [30, 30],
        iconAnchor: isSelected ? [18, 18] : [15, 15],
      });

      const marker = L.marker([st.lat, st.lng], { icon: customIcon });

      marker.bindTooltip(
        `<div style="font-family: 'Inter', sans-serif; font-size: 12px; padding: 3px 6px; line-height: 1.35;">
          <strong style="color: #064e3b; font-size: 13px; display: block; margin-bottom: 2px;">${st.stateName}</strong>
          <span style="color: #475569;">Total Parcels: <strong style="color: #0f172a;">${formatParcels(st.totalParcels)}</strong></span><br/>
          <span style="color: #ea580c; font-weight: 700;">ULPIN Coverage: ${st.ulpinCoverage}%</span>
        </div>`,
        { direction: 'top', offset: [0, -12] }
      );

      marker.on('click', () => {
        setSelectedStateCode(st.stateCode);
        map.setView([st.lat, st.lng], Math.max(map.getZoom(), 5.5), { animate: true });
      });

      group.addLayer(marker);
    });
  }, [filteredStates, selectedStateCode, isSatellite]);

  const handleSelectState = (st) => {
    setSelectedStateCode(st.stateCode);
    if (mapInstanceRef.current && st.lat && st.lng) {
      mapInstanceRef.current.setView([st.lat, st.lng], 5.8, { animate: true });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([22.8, 79.5], 4.4, { animate: true });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <section className={`landing-state-spotlight ${className}`.trim()}>
      <div className="ux4g-container">
        {/* Section Header */}
        <div className="spotlight-bright-header">
          <div className="header-text-group">
            <div className="section-eyebrow-pill">
              <span className="pill-dot"></span>
              <span>State-wise Progress Report &bull; National Cadastral Benchmarks</span>
            </div>
            <h2 className="section-main-heading">
              Cadastral Digitization <span className="heading-saffron">&amp; ULPIN Progress</span>
            </h2>
            <p className="section-sub-heading">
              Public transparency index showing real-time cadastral GIS digitization, ULPIN coverage, and SRO-Revenue automation benchmarks across Indian states.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="region-filter-tabs" role="tablist" aria-label="Filter states by region">
            {regions.map((reg) => (
              <button
                key={reg.id}
                type="button"
                role="tab"
                aria-selected={selectedRegion === reg.id}
                onClick={() => {
                  setSelectedRegion(reg.id);
                  handleResetView();
                }}
                className={`region-tab-pill ${selectedRegion === reg.id ? 'pill-active' : ''}`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column GIS Map + Performance Index Layout */}
        <div className="state-benchmark-grid">
          {/* Left Column: Interactive Leaflet GIS Map & State Dossier Card */}
          <div className="bright-vector-map-card">
            <div className="vector-card-header">
              <div className="card-badge-pill">
                <MapPin size={13} strokeWidth={2.4} className="text-emerald-700" />
                <span>National Cadastral GIS Map</span>
              </div>
              <span className="vector-click-hint">Click state pin to focus metrics</span>
            </div>

            {/* Interactive Leaflet Map Container */}
            <div
              style={{
                position: 'relative',
                height: '240px',
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div
                ref={mapContainerRef}
                style={{
                  height: '100%',
                  width: '100%',
                  background: '#e2e8f0',
                }}
              />

              {/* Floating Leaflet GIS Controls Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                {/* Satellite / Vector Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsSatellite(!isSatellite)}
                  title={isSatellite ? 'Switch to Vector Map' : 'Switch to Satellite Imagery'}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#064e3b',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Layers size={13} />
                  <span>{isSatellite ? 'Vector' : 'Satellite'}</span>
                </button>

                {/* Reset View Button */}
                <button
                  type="button"
                  onClick={handleResetView}
                  title="Reset to All India View"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                  }}
                >
                  <RotateCcw size={13} />
                </button>

                {/* Zoom In & Out */}
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px 6px 0 0',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderTop: 'none',
                    borderRadius: '0 0 6px 6px',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ZoomOut size={13} />
                </button>
              </div>
            </div>

            {/* Selected State Dossier Box */}
            <div className="selected-state-dossier" style={{ marginTop: '0.85rem' }}>
              <div className="dossier-top">
                <div className="dossier-id-box">
                  <span className="state-code-pill">{selectedState.stateCode}</span>
                  <div>
                    <h3 className="state-name-title">{selectedState.stateName}</h3>
                    <span className="state-portal-sub">{selectedState.portalName || 'State Land Portal'}</span>
                  </div>
                </div>
                <div className="state-performance-chip">
                  <span className="perf-dot"></span>
                  <span>{selectedState.status || 'Active DILRMP State'}</span>
                </div>
              </div>

              {/* 4 Clean Progress Indicator Cards */}
              <div className="dossier-stats-grid">
                <div className="stat-card">
                  <span className="stat-card-label">Total Parcels Mapped</span>
                  <span className="stat-card-val text-forest">{formatParcels(selectedState.totalParcels)}</span>
                  <div className="stat-card-sub">Digitized Land Records</div>
                </div>

                <div className="stat-card">
                  <span className="stat-card-label">ULPIN Coverage</span>
                  <span className="stat-card-val text-saffron">{selectedState.ulpinCoverage}%</span>
                  <div className="stat-progress-track">
                    <div
                      className="stat-progress-fill saffron"
                      style={{ width: `${selectedState.ulpinCoverage}%` }}
                    />
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-card-label">Digital RoR %</span>
                  <span className="stat-card-val text-emerald">{selectedState.digitizedRoRPercent}%</span>
                  <div className="stat-progress-track">
                    <div
                      className="stat-progress-fill emerald"
                      style={{ width: `${selectedState.digitizedRoRPercent}%` }}
                    />
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-card-label">Mutation Avg TAT</span>
                  <span className="stat-card-val text-blue">{selectedState.avgMutationDays} Days</span>
                  <div className="stat-card-sub">Statutory SLA: 15 Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bright, Clean State Progress Indicators Table */}
          <div className="bright-benchmark-table-card">
            <div className="table-header-strip">
              <div className="table-title-group">
                <span className="table-main-title">Inter-State Cadastral Performance Index</span>
                <span className="table-sub-caption">Showing {displayedStates.length} benchmark states</span>
              </div>
              <span className="compliance-badge">
                <ShieldCheck size={14} strokeWidth={2.4} />
                <span>DILRMP Standards Compliant</span>
              </span>
            </div>

            <div className="table-scroll-container">
              <table className="bright-clean-table">
                <thead>
                  <tr>
                    <th>State / UT</th>
                    <th className="text-right">Total Parcels</th>
                    <th style={{ minWidth: '160px' }}>ULPIN Coverage Progress</th>
                    <th className="text-center">Digital RoR</th>
                    <th className="text-center">Mutation TAT</th>
                    <th className="text-center">Performance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStates.map((st) => {
                    const isSelected = selectedStateCode === st.stateCode;
                    return (
                      <tr
                        key={st.stateCode}
                        className={`bright-table-row ${isSelected ? 'row-active' : ''}`}
                        onClick={() => handleSelectState(st)}
                        style={{ cursor: 'pointer' }}
                        title="Click to view GIS spatial position on map"
                      >
                        <td>
                          <div className="state-cell-flex">
                            <span className="state-code-chip">{st.stateCode}</span>
                            <div>
                              <strong className="state-name-bold">{st.stateName}</strong>
                              <span className="state-region-tag">{st.region} Region</span>
                            </div>
                          </div>
                        </td>

                        <td className="text-right font-mono font-bold text-slate-800">
                          {formatParcels(st.totalParcels)}
                        </td>

                        <td>
                          <div className="coverage-progress-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{st.ulpinCoverage}%</span>
                              <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{st.status || 'Active'}</span>
                            </div>
                            <div className="clean-progress-bar">
                              <div
                                className="clean-progress-fill"
                                style={{
                                  width: `${st.ulpinCoverage}%`,
                                  backgroundColor: st.ulpinCoverage >= 98 ? '#16a34a' : '#ea580c',
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="text-center">
                          <span className="badge-ror-tag">
                            <CheckCircle2 size={12} strokeWidth={2.4} className="text-emerald-700" />
                            <span>{st.digitizedRoRPercent}%</span>
                          </span>
                        </td>

                        <td className="text-center">
                          <span className={`tat-badge ${st.avgMutationDays <= 12 ? 'tat-fast' : 'tat-normal'}`}>
                            {st.avgMutationDays}d
                          </span>
                        </td>

                        <td className="text-center">
                          <span className="state-status-pill">
                            {st.status || 'Operational'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary Stats */}
            <div className="bright-table-footer">
              <div className="footer-national-metric">
                National Avg ULPIN Coverage: <strong>96.4%</strong> across 36 States &amp; UTs
              </div>
              <div className="footer-transparency-note">
                Data refreshed daily from State PMU Directorate Feeds
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateSpotlight;
