import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import KPIStat from '../../../components/government/KPIStat';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

const STATE_BENCHMARKS = [
  { state: 'Maharashtra', parcels: '4.2 Cr', ulpinCoverage: '89.4%', avgDays: '16.2d', gortStandard: 'Full', rank: 1 },
  { state: 'Karnataka (Bhoomi)', parcels: '3.8 Cr', ulpinCoverage: '94.2%', avgDays: '18.1d', gortStandard: 'Full', rank: 2 },
  { state: 'Uttar Pradesh (Bhulekh)', parcels: '7.1 Cr', ulpinCoverage: '86.5%', avgDays: '22.4d', gortStandard: 'Partial', rank: 3 },
  { state: 'Rajasthan (Apna Khata)', parcels: '3.4 Cr', ulpinCoverage: '81.2%', avgDays: '21.0d', gortStandard: 'Full', rank: 4 },
  { state: 'Madhya Pradesh', parcels: '3.9 Cr', ulpinCoverage: '88.0%', avgDays: '23.8d', gortStandard: 'Full', rank: 5 },
  { state: 'Bihar (Biharbhumi)', parcels: '3.1 Cr', ulpinCoverage: '64.5%', avgDays: '32.1d', gortStandard: 'In Progress', rank: 14 },
];

export const NationalDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-national-dashboard">
      {/* National DoLR Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--ux4g-radius-lg)',
          marginBottom: '1.5rem',
          boxShadow: 'var(--ux4g-shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🇮🇳</span>
            <h1 style={{ color: '#ffffff', fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>
              National Land Stack Cockpit — DoLR
            </h1>
            <span
              style={{
                background: '#fdba74',
                color: '#7c2d12',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              MINISTRY OF RURAL DEVELOPMENT
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#ffedd5', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>National Monitor:</strong> {user?.name || 'Meera Sengupta'}</span>
            <span><strong>Scope:</strong> All 36 States & Union Territories</span>
            <span><strong>Standard:</strong> DILRMP 3.0 National Registry Architecture</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" style={{ color: '#fff', borderColor: '#fff' }}>
            🏛️ Parliamentary MIS Sync
          </Button>
          <Button variant="primary" size="sm" style={{ background: '#ea580c' }}>
            📥 Export National Benchmark
          </Button>
        </div>
      </div>

      {/* National Aggregated KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
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

      {/* Inter-State Comparative Benchmark Matrix */}
      <Card>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary)' }}>
              🌐 Inter-State Implementation Matrix & GoRT Compliance
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
              Comparing state land modernization velocity, ULPIN coverage, and mutation timelines
            </div>
          </div>
          <Badge variant="primary">36 States Active</Badge>
        </div>

        <div className="ux4g-table-wrapper">
          <table className="ux4g-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>State / Revenue Portal</th>
                <th>Total Parcels</th>
                <th>ULPIN Coverage</th>
                <th>Avg Mutation SLA</th>
                <th>GoRT Terminology</th>
              </tr>
            </thead>
            <tbody>
              {STATE_BENCHMARKS.map((s) => (
                <tr key={s.state}>
                  <td><strong>#{s.rank}</strong></td>
                  <td><strong>{s.state}</strong></td>
                  <td>{s.parcels}</td>
                  <td><strong style={{ color: 'var(--ux4g-success)' }}>{s.ulpinCoverage}</strong></td>
                  <td>{s.avgDays}</td>
                  <td>
                    <Badge variant={s.gortStandard === 'Full' ? 'success' : s.gortStandard === 'Partial' ? 'warning' : 'neutral'}>
                      {s.gortStandard}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default NationalDashboard;
