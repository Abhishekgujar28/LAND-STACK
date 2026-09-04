import React from 'react';
import { Link } from 'react-router-dom';

/**
 * StateSpotlight - State comparison cards with key metrics
 */
export const StateSpotlight = ({ stateAnalytics = [], className = '' }) => {
  const stateColors = {
    MH: { gradient: 'linear-gradient(135deg, #0b3c5d 0%, #1a6b9e 100%)', badge: '#ff9933' },
    RJ: { gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', badge: '#f59e0b' },
  };

  return (
    <section className={`state-spotlight ${className}`.trim()}>
      <div className="ux4g-container">
        <div className="section-header">
          <h2>State Spotlight</h2>
          <p>Real-time land governance metrics across participating states</p>
        </div>
        <div className="state-cards-grid">
          {stateAnalytics.map((state) => {
            const colors = stateColors[state.stateCode] || stateColors.MH;
            return (
              <div key={state.stateCode} className="state-card" style={{ background: colors.gradient }}>
                <div className="state-card-header">
                  <h3>{state.stateName}</h3>
                  <span className="state-badge" style={{ background: colors.badge }}>
                    {state.stateCode}
                  </span>
                </div>
                <div className="state-metrics-grid">
                  <div className="state-metric">
                    <span className="metric-value">{(state.totalParcels / 1000000).toFixed(1)}M</span>
                    <span className="metric-label">Total Parcels</span>
                  </div>
                  <div className="state-metric">
                    <span className="metric-value">{state.ulpinCoverage}%</span>
                    <span className="metric-label">ULPIN Coverage</span>
                  </div>
                  <div className="state-metric">
                    <span className="metric-value">{state.digitizedRoRPercent}%</span>
                    <span className="metric-label">RoR Digitized</span>
                  </div>
                  <div className="state-metric">
                    <span className="metric-value">{state.avgMutationDays}d</span>
                    <span className="metric-label">Avg Mutation TAT</span>
                  </div>
                </div>
                <div className="state-card-footer">
                  <div className="state-progress-bar">
                    <div
                      className="state-progress-fill"
                      style={{ width: `${state.ulpinCoverage}%` }}
                    />
                  </div>
                  <span className="state-sro">{state.sroOfficesConnected} SROs Connected</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StateSpotlight;
