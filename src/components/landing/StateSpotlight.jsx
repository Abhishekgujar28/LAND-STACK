import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * StateSpotlight - State comparison cards with key metrics
 * Conforms to UX4G & GIGW standards, modeled after PM GatiShakti state dashboards
 */
export const StateSpotlight = ({ stateAnalytics = [], className = '' }) => {
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const regions = [
    { id: 'ALL', label: 'All Participating States' },
    { id: 'West', label: 'Western Region' },
    { id: 'North', label: 'Northern Region' },
    { id: 'South', label: 'Southern Region' },
    { id: 'Central', label: 'Central & East' },
  ];

  const filteredStates =
    selectedRegion === 'ALL'
      ? stateAnalytics
      : stateAnalytics.filter((s) => {
          if (selectedRegion === 'Central') return s.region === 'Central' || s.region === 'East';
          return s.region === selectedRegion;
        });

  const formatParcels = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
    return num.toLocaleString('en-IN');
  };

  return (
    <section
      className={`state-spotlight ${className}`.trim()}
      style={{
        padding: '3.5rem 0',
        background: 'var(--ux4g-bg, #f8fafc)',
        borderTop: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
        borderBottom: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
      }}
    >
      <div className="ux4g-container">
        {/* Government Section Header (GIGW / PM GatiShakti style) */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--primary-light, #ecfdf5)',
              color: 'var(--primary, #064e3b)',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.76rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              border: '1px solid var(--primary-subtle, #d1fae5)',
            }}
          >
            <span>📊</span>
            <span>राज्यवार भूमि रिकॉर्ड प्रगति | State-Wise Cadastral Benchmark</span>
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary, #064e3b)', margin: '0.2rem 0 0.4rem' }}>
            State Spotlight & Cadastral Coverage
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary, #475569)', maxWidth: '720px', margin: '0 auto' }}>
            Real-time cadastral digitization, ULPIN coverage, and SRO integration metrics under Digital India Land Records initiative.
          </p>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--secondary, #ea580c)',
              margin: '0.75rem auto 0',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Regional Filter Tabs (UX4G conforming) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
          }}
        >
          {regions.map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => setSelectedRegion(reg.id)}
              style={{
                background: selectedRegion === reg.id ? 'var(--primary, #064e3b)' : '#ffffff',
                color: selectedRegion === reg.id ? '#ffffff' : 'var(--ux4g-text, #0f172a)',
                border: selectedRegion === reg.id ? '1px solid var(--primary, #064e3b)' : '1px solid var(--ux4g-border, #cbd5e1)',
                padding: '0.35rem 0.95rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: selectedRegion === reg.id ? '0 2px 4px rgba(6, 78, 59, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Resized State Cards Grid (Compact, Government Dashboard Tiles) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredStates.map((state) => (
            <div
              key={state.stateCode}
              style={{
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
                borderTop: '3px solid var(--secondary, #ea580c)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary, #064e3b)', margin: 0, lineHeight: 1.2 }}>
                      {state.stateName}
                    </h3>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{state.region} Region</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span
                    style={{
                      background: 'var(--primary-light, #ecfdf5)',
                      color: 'var(--primary, #064e3b)',
                      border: '1px solid var(--primary-subtle, #d1fae5)',
                      borderRadius: '4px',
                      padding: '1px 6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    {state.stateCode}
                  </span>
                </div>
              </div>

              {/* 2x2 Metric Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.6rem',
                  padding: '0.65rem',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  marginBottom: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Total Parcels
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary, #064e3b)' }}>
                    {formatParcels(state.totalParcels)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    ULPIN Seeded
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary, #ea580c)' }}>
                    {state.ulpinCoverage}%
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    RoR Digitized
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803d' }}>
                    {state.digitizedRoRPercent}%
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Avg Mutation
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {state.avgMutationDays} Days
                  </div>
                </div>
              </div>

              {/* Progress Bar for ULPIN Coverage */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  <span>ULPIN Implementation Progress</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary, #064e3b)' }}>{state.ulpinCoverage}%</span>
                </div>
                <div
                  style={{
                    height: '5px',
                    background: '#e2e8f0',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginBottom: '0.65rem',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${state.ulpinCoverage}%`,
                      background: 'linear-gradient(90deg, var(--primary, #064e3b) 0%, var(--secondary, #ea580c) 100%)',
                      borderRadius: '999px',
                    }}
                  />
                </div>

                {/* Footer Link & SRO count */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.4rem',
                    borderTop: '1px solid #f1f5f9',
                    fontSize: '0.74rem',
                  }}
                >
                  <span style={{ color: '#64748b', fontWeight: 500 }}>
                    📍 {state.sroOfficesConnected} SROs Online
                  </span>
                  <Link
                    to="/government/state"
                    style={{
                      color: 'var(--primary, #064e3b)',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}
                  >
                    <span>View Data</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StateSpotlight;
