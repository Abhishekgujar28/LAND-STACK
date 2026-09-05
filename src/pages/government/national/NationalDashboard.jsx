import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import nationalBenchmarksData from '../../../data/analytics/nationalBenchmarks.json';
import KPIStat from '../../../components/government/KPIStat';
import AuthorityGisMap from '../../../components/government/AuthorityGisMap';
import { ROLES } from '../../../config/roles';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import {
  Flag,
  Layers,
  Globe2,
  FileCheck,
  TrendingUp,
  Award,
  Download,
  Share2,
} from 'lucide-react';

export const NationalDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('BENCHMARKS'); // 'BENCHMARKS' | 'GIS_MAP' | 'PARLIAMENT_MIS'

  return (
    <div className="page-national-dashboard" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* National DoLR Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #033628 50%, #022319 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(6, 78, 59, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef08a',
              }}
            >
              <Flag size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              National Land Stack Cockpit — DoLR
            </h1>
            <span
              style={{
                background: '#ea580c',
                color: '#ffffff',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              MINISTRY OF RURAL DEVELOPMENT
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>National Monitor:</strong> {user?.name || 'Meera Sengupta'}</span>
            <span><strong>Scope:</strong> All 36 States & Union Territories</span>
            <span><strong>Standard:</strong> National Land Registry Architecture</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
            <FileCheck size={14} style={{ marginRight: '4px' }} />
            Parliamentary MIS Sync
          </Button>
          <Button variant="primary" size="sm" style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}>
            Export National Deck
          </Button>
        </div>
      </div>

      {/* National Aggregated KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <KPIStat
          title="Assigned Bhu-Aadhaar (ULPIN)"
          value="36.4 Cr"
          subtitle="Target: 40+ Crore Parcels"
          icon="📍"
          status="success"
        />
        <KPIStat
          title="National Avg Mutation Turnaround"
          value="24.2d"
          subtitle="Target: 21 Days (NLRMP SLA)"
          icon="⏱️"
          status="warning"
        />
        <KPIStat
          title="States with GoRT Ontology"
          value="24 / 36"
          subtitle="Standardized land record terminology"
          icon="🌐"
          status="normal"
        />
        <KPIStat
          title="National RoR-Map Integration"
          value="87.6%"
          subtitle="Cadastral boundaries verified"
          icon="🗺️"
          status="success"
        />
      </div>

      {/* Mode Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('BENCHMARKS')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'BENCHMARKS' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'BENCHMARKS' ? '#064e3b' : undefined,
            borderColor: activeTab === 'BENCHMARKS' ? '#064e3b' : undefined,
            color: activeTab === 'BENCHMARKS' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Globe2 size={15} />
          <span>Inter-State Implementation Matrix & GoRT Compliance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('GIS_MAP')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'GIS_MAP' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'GIS_MAP' ? '#064e3b' : undefined,
            borderColor: activeTab === 'GIS_MAP' ? '#064e3b' : undefined,
            color: activeTab === 'GIS_MAP' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Layers size={15} />
          <span>Pan-India Bhu-Aadhaar National GIS Cadastre</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PARLIAMENT_MIS')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'PARLIAMENT_MIS' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'PARLIAMENT_MIS' ? '#064e3b' : undefined,
            borderColor: activeTab === 'PARLIAMENT_MIS' ? '#064e3b' : undefined,
            color: activeTab === 'PARLIAMENT_MIS' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Award size={15} />
          <span>World Bank Ease of Doing Business & DILRMP Index</span>
        </button>
      </div>

      {/* TAB 1: INTER-STATE BENCHMARKS */}
      {activeTab === 'BENCHMARKS' && (
        <Card>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
                🌐 Inter-State Implementation Matrix & GoRT Compliance
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Comparing state land modernization velocity, ULPIN coverage, and mutation timelines across 36 States/UTs
              </div>
            </div>
            <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>{nationalBenchmarksData.length} States Benchmarked</Badge>
          </div>

          <div className="ux4g-table-wrapper">
            <table className="ux4g-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>State / Revenue Portal</th>
                  <th>Total Parcels</th>
                  <th>ULPIN Assigned</th>
                  <th>ULPIN Coverage</th>
                  <th>Avg Mutation SLA</th>
                  <th>GoRT Terminology</th>
                  <th>National Status</th>
                </tr>
              </thead>
              <tbody>
                {nationalBenchmarksData.map((s) => (
                  <tr key={s.state}>
                    <td><strong>#{s.rank}</strong></td>
                    <td>
                      <div><strong>{s.state}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{s.portalName}</div>
                    </td>
                    <td>{s.parcels}</td>
                    <td>{s.ulpinAssigned}</td>
                    <td><strong style={{ color: 'var(--ux4g-success)' }}>{s.ulpinCoverage}</strong></td>
                    <td>{s.avgDays}</td>
                    <td>
                      <Badge variant={s.gortStandard === 'Full' ? 'success' : s.gortStandard === 'Partial' ? 'warning' : 'neutral'}>
                        {s.gortStandard}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={s.status === 'Leader' ? 'success' : s.status === 'On Track' ? 'info' : 'warning'}>
                        {s.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 2: NATIONAL GIS CADASTRE */}
      {activeTab === 'GIS_MAP' && (
        <Card style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
                National Bhu-Aadhaar ULPIN Cadastre (DoLR / MoRD)
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Pan-India central GIS registry linking 36 States/UTs cadastral boundaries and ULPIN benchmarks.
              </p>
            </div>
            <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>
              Pan-India 36 States/UTs
            </Badge>
          </div>

          <AuthorityGisMap
            authorityRole={ROLES.NATIONAL_MONITOR}
            activeJurisdiction="Pan-India Cadastre"
            height="620px"
          />
        </Card>
      )}

      {/* TAB 3: PARLIAMENT & WORLD BANK MIS */}
      {activeTab === 'PARLIAMENT_MIS' && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
              World Bank Ease of Doing Business: Property Registration Index
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)' }}>
              Standing Committee on Rural Development & Land Resources Benchmarks
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase' }}>
                Days to Register Property (India Average)
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#064e3b', margin: '0.35rem 0' }}>
                9.4 Days
              </div>
              <div style={{ fontSize: '0.8rem', color: '#16a34a' }}>
                Improved from 48.0 days (2018 benchmark)
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase' }}>
                Quality of Land Administration Index
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#064e3b', margin: '0.35rem 0' }}>
                27.8 / 30
              </div>
              <div style={{ fontSize: '0.8rem', color: '#16a34a' }}>
                Ranked in global top quartile for spatial transparency
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase' }}>
                ULPIN Saturation Benchmark
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ea580c', margin: '0.35rem 0' }}>
                36.4 Cr Parcels
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>
                Target: 40 Crore by FY 2026-27
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NationalDashboard;
