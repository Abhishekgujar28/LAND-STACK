import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Clock,
} from 'lucide-react';

/**
 * StateSpotlight - Compact Split-View Cadastral Coverage & Benchmarks
 * Optimized height so the entire section is visible at once without scrolling
 */
export const StateSpotlight = ({ stateAnalytics = [], className = '' }) => {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStateCode, setSelectedStateCode] = useState(
    stateAnalytics[0]?.stateCode || 'MH'
  );

  const regions = [
    { id: 'ALL', label: 'All States' },
    { id: 'West', label: 'Western' },
    { id: 'North', label: 'Northern' },
    { id: 'South', label: 'Southern' },
    { id: 'Central', label: 'Central & East' },
  ];

  const filteredStates =
    selectedRegion === 'ALL'
      ? stateAnalytics
      : stateAnalytics.filter((s) => {
          if (selectedRegion === 'Central') return s.region === 'Central' || s.region === 'East';
          return s.region === selectedRegion;
        });

  const selectedState =
    stateAnalytics.find((s) => s.stateCode === selectedStateCode) ||
    stateAnalytics[0] ||
    {};

  const formatParcels = (num) => {
    if (!num) return '0';
    if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
    return num.toLocaleString('en-IN');
  };

  // State Map Node Coordinates
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
    <section className={`state-spotlight-section ${className}`.trim()}>
      <div className="ux4g-container">
        {/* Compact Section Header */}
        <div className="spotlight-compact-header">
          <div>
            <div className="section-eyebrow-pill" style={{ marginBottom: '0.25rem' }}>
              <span className="pill-dot"></span>
              <span>राज्यवार प्रगती | State Cadastral Benchmark</span>
            </div>
            <h2 className="section-main-heading" style={{ margin: '0 0 0.25rem', fontSize: '1.85rem' }}>
              State Cadastral <span className="heading-saffron">Coverage &amp; Benchmarks</span>
            </h2>
            <p className="section-sub-heading" style={{ margin: 0, fontSize: '0.88rem' }}>
              Real-time geospatial digitization progress, ULPIN coverage, and SRO metrics.
            </p>
          </div>

          {/* Inline Region Filter Tabs */}
          <div className="state-region-tabs-compact">
            {regions.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegion(reg.id)}
                className={`region-tab-btn-compact ${selectedRegion === reg.id ? 'tab-active' : ''}`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Split View: Left Map + Live State Card & Right Table */}
        <div className="state-split-layout-compact">
          {/* Left Panel: Interactive Schematic Map & Compact Dossier */}
          <div className="state-map-panel-compact">
            {/* Top Map + Selected State Strip */}
            <div className="map-visual-container-compact">
              <div className="map-header-overlay-compact">
                <span className="map-tag">Geospatial Distribution</span>
                <span className="map-hint">Click a state node</span>
              </div>

              {/* Schematic Map SVG */}
              <div className="schematic-map-box-compact">
                <svg
                  viewBox="0 0 100 100"
                  className="india-schematic-svg"
                  aria-label="Interactive India Cadastral Map"
                >
                  <path
                    d="M 38 12 Q 44 8 50 14 Q 56 16 60 22 Q 68 28 66 36 Q 76 38 78 46 Q 74 54 66 58 Q 60 70 54 82 Q 46 94 44 94 Q 40 86 36 74 Q 30 62 30 52 Q 22 46 26 38 Q 30 28 34 18 Z"
                    className="map-silhouette"
                  />
                  <line x1="38" y1="56" x2="45" y2="48" className="map-connector" />
                  <line x1="26" y1="46" x2="45" y2="48" className="map-connector" />
                  <line x1="52" y1="35" x2="45" y2="48" className="map-connector" />
                  <line x1="32" y1="36" x2="52" y2="35" className="map-connector" />
                  <line x1="38" y1="56" x2="40" y2="72" className="map-connector" />
                  <line x1="40" y1="72" x2="45" y2="84" className="map-connector" />
                  <line x1="45" y1="48" x2="64" y2="54" className="map-connector" />

                  {stateNodes.map((node) => {
                    const isSelected = selectedStateCode === node.code;
                    return (
                      <g
                        key={node.code}
                        className={`map-node-group ${isSelected ? 'node-selected' : ''}`}
                        onClick={() => setSelectedStateCode(node.code)}
                        style={{ cursor: 'pointer' }}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isSelected ? 5.5 : 4}
                          className="node-circle"
                        />
                        {isSelected && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={8.5}
                            className="node-pulse"
                          />
                        )}
                        <text
                          x={node.x}
                          y={node.y + 1.2}
                          className="node-text"
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
            </div>

            {/* Selected State Mini Dossier */}
            <div className="state-dossier-card-compact">
              <div className="dossier-header-compact">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span className="dossier-badge-compact">{selectedState.stateCode}</span>
                  <div>
                    <h3 className="dossier-name-compact">{selectedState.stateName}</h3>
                    <span className="dossier-region-compact">{selectedState.region} Region</span>
                  </div>
                </div>
                <Link
                  to="/government/state"
                  className="dossier-portal-link-compact"
                  title={`Open ${selectedState.stateName} state dashboard`}
                >
                  <span>Portal</span>
                  <ArrowUpRight size={12} strokeWidth={2.4} />
                </Link>
              </div>

              {/* Compact 4-Stat Row */}
              <div className="dossier-metrics-grid-compact">
                <div className="dossier-metric-item">
                  <span className="metric-label">Parcels</span>
                  <span className="metric-val text-forest">{formatParcels(selectedState.totalParcels)}</span>
                </div>
                <div className="dossier-metric-item">
                  <span className="metric-label">ULPIN</span>
                  <span className="metric-val text-saffron">{selectedState.ulpinCoverage}%</span>
                </div>
                <div className="dossier-metric-item">
                  <span className="metric-label">RoR %</span>
                  <span className="metric-val text-emerald">{selectedState.digitizedRoRPercent}%</span>
                </div>
                <div className="dossier-metric-item">
                  <span className="metric-label">TAT</span>
                  <span className="metric-val">{selectedState.avgMutationDays}d</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Compact Benchmark Data Table */}
          <div className="state-table-panel-compact">
            <div className="table-responsive-box-compact">
              <table className="state-benchmark-table-compact">
                <thead>
                  <tr>
                    <th>State / UT</th>
                    <th className="text-right">Total Parcels</th>
                    <th>ULPIN Coverage</th>
                    <th className="text-center">RoR Status</th>
                    <th className="text-center">TAT</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStates.slice(0, 6).map((st) => {
                    const isRowSelected = selectedStateCode === st.stateCode;
                    return (
                      <tr
                        key={st.stateCode}
                        className={`table-row-state ${isRowSelected ? 'row-selected' : ''}`}
                        onClick={() => setSelectedStateCode(st.stateCode)}
                      >
                        <td>
                          <div className="td-state-cell-compact">
                            <span className="state-code-pill-compact">{st.stateCode}</span>
                            <div>
                              <strong className="state-name-text-compact">{st.stateName}</strong>
                              <span className="state-region-text-compact">{st.region}</span>
                            </div>
                          </div>
                        </td>

                        <td className="text-right font-mono font-bold text-forest">
                          {formatParcels(st.totalParcels)}
                        </td>

                        <td>
                          <div className="td-coverage-cell-compact">
                            <span className="coverage-text font-bold">{st.ulpinCoverage}%</span>
                            <div className="table-progress-bar-compact">
                              <div
                                className="table-progress-fill"
                                style={{ width: `${st.ulpinCoverage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="text-center">
                          <span className="badge-ror-done-compact">
                            <CheckCircle2 size={11} strokeWidth={2.4} />
                            <span>{st.digitizedRoRPercent}%</span>
                          </span>
                        </td>

                        <td className="text-center">
                          <span className="mutation-tat-pill-compact">
                            {st.avgMutationDays}d
                          </span>
                        </td>

                        <td className="text-right">
                          <Link
                            to="/government/state"
                            className="table-action-link-compact"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Inspect</span>
                            <ExternalLink size={11} strokeWidth={2.2} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Compact Table Footer */}
            <div className="table-footer-bar-compact">
              <span>National Avg ULPIN: <strong>95.2%</strong> across 36 States &amp; UTs</span>
              <Link to="/government/map" className="footer-full-report-link-compact">
                <span>View All 36 States &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateSpotlight;
