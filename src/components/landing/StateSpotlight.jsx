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
 * StateSpotlight - Split View Geospatial Cadastral Coverage
 * Replaces identical state cards with an official GIGW 3.0 split-view:
 * - Left: Interactive SVG Map Layout & Selected State Live Dossier
 * - Right: Official National Cadastral Benchmark Data Table
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
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
    return num.toLocaleString('en-IN');
  };

  // State Map Node Coordinates for the India schematic SVG
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
        {/* Section Header */}
        <div className="section-header-compact">
          <div className="section-eyebrow-pill">
            <span className="pill-dot"></span>
            <span>राज्यवार भूमि रिकॉर्ड प्रगति | State-Wise Cadastral Benchmark</span>
          </div>
          <h2 className="section-main-heading">
            State Cadastral <span className="heading-saffron">Coverage &amp; Benchmarks</span>
          </h2>
          <p className="section-sub-heading">
            Real-time geospatial digitization progress, ULPIN coverage, and SRO integration metrics across states.
          </p>
        </div>

        {/* Region Filter Bar */}
        <div className="state-region-tabs">
          {regions.map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => setSelectedRegion(reg.id)}
              className={`region-tab-btn ${selectedRegion === reg.id ? 'tab-active' : ''}`}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Split View: Left Map / Dossier & Right Data Table */}
        <div className="state-split-layout">
          {/* Left Column: Interactive Map & Live State Dossier */}
          <div className="state-map-panel">
            <div className="map-visual-container">
              <div className="map-header-overlay">
                <span className="map-tag">Geospatial Distribution</span>
                <span className="map-hint">Click a state node to view metrics</span>
              </div>

              {/* Schematic National Map SVG */}
              <div className="schematic-map-box">
                <svg
                  viewBox="0 0 100 100"
                  className="india-schematic-svg"
                  aria-label="Interactive India Cadastral Map"
                >
                  {/* Subtle Boundary Silhouette */}
                  <path
                    d="M 38 12 Q 44 8 50 14 Q 56 16 60 22 Q 68 28 66 36 Q 76 38 78 46 Q 74 54 66 58 Q 60 70 54 82 Q 46 94 44 94 Q 40 86 36 74 Q 30 62 30 52 Q 22 46 26 38 Q 30 28 34 18 Z"
                    className="map-silhouette"
                  />

                  {/* Connective Regional Grid Lines */}
                  <line x1="38" y1="56" x2="45" y2="48" className="map-connector" />
                  <line x1="26" y1="46" x2="45" y2="48" className="map-connector" />
                  <line x1="52" y1="35" x2="45" y2="48" className="map-connector" />
                  <line x1="32" y1="36" x2="52" y2="35" className="map-connector" />
                  <line x1="38" y1="56" x2="40" y2="72" className="map-connector" />
                  <line x1="40" y1="72" x2="45" y2="84" className="map-connector" />
                  <line x1="45" y1="48" x2="64" y2="54" className="map-connector" />

                  {/* Interactive State Nodes */}
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

            {/* Selected State Dossier Card */}
            <div className="state-dossier-card">
              <div className="dossier-header">
                <div className="dossier-title-area">
                  <span className="dossier-badge">{selectedState.stateCode}</span>
                  <div>
                    <h3 className="dossier-name">{selectedState.stateName}</h3>
                    <span className="dossier-region">{selectedState.region} Region • {selectedState.status || 'Active'}</span>
                  </div>
                </div>
                <Link
                  to="/government/state"
                  className="dossier-portal-link"
                  title={`Open ${selectedState.stateName} state dashboard`}
                >
                  <span>Portal</span>
                  <ArrowUpRight size={14} strokeWidth={2.4} />
                </Link>
              </div>

              {/* Key Indicators Grid */}
              <div className="dossier-metrics-grid">
                <div className="dossier-metric-item">
                  <span className="metric-label">Total Parcels</span>
                  <span className="metric-val text-forest">{formatParcels(selectedState.totalParcels)}</span>
                </div>
                <div className="dossier-metric-item">
                  <span className="metric-label">ULPIN Coverage</span>
                  <span className="metric-val text-saffron">{selectedState.ulpinCoverage}%</span>
                </div>
                <div className="dossier-metric-item">
                  <span className="metric-label">RoR Digitized</span>
                  <span className="metric-val text-emerald">{selectedState.digitizedRoRPercent}%</span>
                </div>
                <div className="dossier-metric-item">
                  <span className="metric-label">Avg Mutation TAT</span>
                  <span className="metric-val">{selectedState.avgMutationDays} Days</span>
                </div>
              </div>

              {/* Live Progress Bar */}
              <div className="dossier-progress-block">
                <div className="progress-label-row">
                  <span>National Benchmark Progress</span>
                  <span className="progress-percent">{selectedState.ulpinCoverage}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${selectedState.ulpinCoverage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Official Benchmark Data Table */}
          <div className="state-table-panel">
            <div className="table-responsive-box">
              <table className="state-benchmark-table">
                <thead>
                  <tr>
                    <th>State / UT</th>
                    <th className="text-right">Total Parcels</th>
                    <th>ULPIN Coverage</th>
                    <th className="text-center">RoR Status</th>
                    <th className="text-center">Mutation TAT</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStates.map((st) => {
                    const isRowSelected = selectedStateCode === st.stateCode;
                    return (
                      <tr
                        key={st.stateCode}
                        className={`table-row-state ${isRowSelected ? 'row-selected' : ''}`}
                        onClick={() => setSelectedStateCode(st.stateCode)}
                      >
                        {/* State & Region */}
                        <td>
                          <div className="td-state-cell">
                            <span className="state-code-pill">{st.stateCode}</span>
                            <div>
                              <strong className="state-name-text">{st.stateName}</strong>
                              <span className="state-region-text">{st.region}</span>
                            </div>
                          </div>
                        </td>

                        {/* Total Parcels */}
                        <td className="text-right font-mono font-bold text-forest">
                          {formatParcels(st.totalParcels)}
                        </td>

                        {/* ULPIN Coverage */}
                        <td>
                          <div className="td-coverage-cell">
                            <span className="coverage-text font-bold">{st.ulpinCoverage}%</span>
                            <div className="table-progress-bar">
                              <div
                                className="table-progress-fill"
                                style={{ width: `${st.ulpinCoverage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Digitized RoR */}
                        <td className="text-center">
                          <span className="badge-ror-done">
                            <CheckCircle2 size={12} strokeWidth={2.4} />
                            <span>{st.digitizedRoRPercent}%</span>
                          </span>
                        </td>

                        {/* Avg Mutation */}
                        <td className="text-center">
                          <span className="mutation-tat-pill">
                            {st.avgMutationDays}d
                          </span>
                        </td>

                        {/* Action Link */}
                        <td className="text-right">
                          <Link
                            to="/government/state"
                            className="table-action-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Inspect</span>
                            <ExternalLink size={12} strokeWidth={2.2} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Summary Footer */}
            <div className="table-footer-bar">
              <span>National Average ULPIN Seeding: <strong>95.2%</strong> across 36 States &amp; UTs</span>
              <Link to="/government/map" className="footer-full-report-link">
                <span>View Full National Analytics &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateSpotlight;
