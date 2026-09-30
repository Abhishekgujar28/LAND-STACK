import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  Layers,
  TrendingUp,
  Building2,
  Clock,
  Sparkles,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import { defaultStateAnalytics } from '../../data/landingData';

/**
 * StateSpotlight - Informational State Cadastral Benchmark & Transparency Dashboard
 * Features an interactive bright vector map, clear state progress indicators,
 * and high-contrast accessible typography without unauthenticated bypass links.
 */
export const StateSpotlight = ({ stateAnalytics = [], className = '' }) => {
  const activeStates = stateAnalytics && stateAnalytics.length > 0 ? stateAnalytics : defaultStateAnalytics;
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStateCode, setSelectedStateCode] = useState(
    activeStates[0]?.stateCode || 'MH'
  );

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

  // State Map Node Coordinates for the Vector Schematic Map
  const stateNodes = [
    { code: 'MH', x: 38, y: 56, name: 'Maharashtra', region: 'West' },
    { code: 'GJ', x: 26, y: 46, name: 'Gujarat', region: 'West' },
    { code: 'UP', x: 52, y: 35, name: 'Uttar Pradesh', region: 'North' },
    { code: 'RJ', x: 32, y: 36, name: 'Rajasthan', region: 'North' },
    { code: 'KA', x: 40, y: 72, name: 'Karnataka', region: 'South' },
    { code: 'TN', x: 45, y: 84, name: 'Tamil Nadu', region: 'South' },
    { code: 'MP', x: 45, y: 48, name: 'Madhya Pradesh', region: 'Central' },
    { code: 'OD', x: 64, y: 54, name: 'Odisha', region: 'Central' },
  ];

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
                onClick={() => setSelectedRegion(reg.id)}
                className={`region-tab-pill ${selectedRegion === reg.id ? 'pill-active' : ''}`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Bright Vector Card + Live State Dossier Layout */}
        <div className="state-benchmark-grid">
          {/* Left Column: Interactive Vector Map & State Dossier Card */}
          <div className="bright-vector-map-card">
            <div className="vector-card-header">
              <div className="card-badge-pill">
                <MapPin size={13} strokeWidth={2.4} className="text-emerald-700" />
                <span>Geospatial Distribution Map</span>
              </div>
              <span className="vector-click-hint">Click state node to inspect metrics</span>
            </div>

            {/* Bright Vector Schematic Map SVG */}
            <div className="bright-map-container">
              <svg
                viewBox="0 0 100 100"
                className="india-bright-vector-svg"
                aria-label="Interactive Indian Cadastral Map"
              >
                {/* Clean Light Background Silhouette */}
                <path
                  d="M 38 12 Q 44 8 50 14 Q 56 16 60 22 Q 68 28 66 36 Q 76 38 78 46 Q 74 54 66 58 Q 60 70 54 82 Q 46 94 44 94 Q 40 86 36 74 Q 30 62 30 52 Q 22 46 26 38 Q 30 28 34 18 Z"
                  className="bright-map-silhouette"
                />

                {/* Connecting Grid Lines */}
                <line x1="38" y1="56" x2="45" y2="48" className="bright-connector-line" />
                <line x1="26" y1="46" x2="45" y2="48" className="bright-connector-line" />
                <line x1="52" y1="35" x2="45" y2="48" className="bright-connector-line" />
                <line x1="32" y1="36" x2="52" y2="35" className="bright-connector-line" />
                <line x1="38" y1="56" x2="40" y2="72" className="bright-connector-line" />
                <line x1="40" y1="72" x2="45" y2="84" className="bright-connector-line" />
                <line x1="45" y1="48" x2="64" y2="54" className="bright-connector-line" />

                {/* State Interactive Nodes */}
                {stateNodes.map((node) => {
                  const isSelected = selectedStateCode === node.code;
                  return (
                    <g
                      key={node.code}
                      className={`bright-node-group ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setSelectedStateCode(node.code)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${node.name}`}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 6 : 4.5}
                        className="bright-node-circle"
                      />
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={9.5}
                          className="bright-node-ripple"
                        />
                      )}
                      <text
                        x={node.x}
                        y={node.y + 1.2}
                        className="bright-node-text"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {node.code}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected State Dossier Box */}
            <div className="selected-state-dossier">
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
                <span className="table-sub-caption">Showing {filteredStates.length} benchmark states</span>
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
                    <th>ULPIN Coverage Progress</th>
                    <th className="text-center">Digital RoR</th>
                    <th className="text-center">Mutation TAT</th>
                    <th className="text-center">Performance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStates.map((st) => {
                    const isSelected = selectedStateCode === st.stateCode;
                    return (
                      <tr
                        key={st.stateCode}
                        className={`bright-table-row ${isSelected ? 'row-active' : ''}`}
                        onClick={() => setSelectedStateCode(st.stateCode)}
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
                            <div className="coverage-numbers">
                              <span className="coverage-val">{st.ulpinCoverage}%</span>
                              <span className="coverage-status text-xs text-slate-700 font-medium">
                                {st.status || 'Active'}
                              </span>
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
