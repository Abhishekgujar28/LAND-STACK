import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import KPIStat from '../../../components/government/KPIStat';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';

const TEHSIL_RANKINGS = [
  { rank: 1, tehsil: 'Pune City', totalParcels: '142,500', ulpinCoverage: '98.4%', slaAdherence: '94.2%', status: 'GREEN' },
  { rank: 2, tehsil: 'Haveli', totalParcels: '284,100', ulpinCoverage: '91.8%', slaAdherence: '91.8%', status: 'GREEN' },
  { rank: 3, tehsil: 'Khed', totalParcels: '168,200', ulpinCoverage: '89.1%', slaAdherence: '88.5%', status: 'GREEN' },
  { rank: 4, tehsil: 'Baramati', totalParcels: '175,400', ulpinCoverage: '87.4%', slaAdherence: '87.2%', status: 'GREEN' },
  { rank: 5, tehsil: 'Maval', totalParcels: '134,800', ulpinCoverage: '85.2%', slaAdherence: '85.0%', status: 'GREEN' },
  { rank: 6, tehsil: 'Daund', totalParcels: '148,900', ulpinCoverage: '84.0%', slaAdherence: '82.4%', status: 'YELLOW' },
  { rank: 14, tehsil: 'Velhe (Rajgad)', totalParcels: '62,400', ulpinCoverage: '64.1%', slaAdherence: '68.4%', status: 'RED' },
];

export const DistrictDashboard = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);

  const handleReallocate = () => {
    setNotification('Administrative Order issued: 2 Additional Revenue Inspectors dispatched to Velhe Tehsil to accelerate backlog clearance.');
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="page-district-dashboard">
      {/* Collector Command Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
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
            <span style={{ fontSize: '1.6rem' }}>🏢</span>
            <h1 style={{ color: '#ffffff', fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>
              District Collector Command Cockpit
            </h1>
            <span
              style={{
                background: '#38bdf8',
                color: '#082f49',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              DISTRICT MAGISTRATE
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#e0f2fe', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Collector:</strong> {user?.name || 'Dr. Suhas Diwase, IAS'}</span>
            <span><strong>District:</strong> Pune District (14 Tehsils, 1,885 Villages)</span>
            <span><strong>DQI Grade:</strong> Grade 'A' (89.2/100)</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" onClick={handleReallocate} style={{ color: '#fff', borderColor: '#fff' }}>
            🔄 Reallocate Officers
          </Button>
          <Button variant="primary" size="sm" style={{ background: '#0284c7' }}>
            📊 Export District MIS Deck
          </Button>
        </div>
      </div>

      {notification && (
        <Alert variant="success" style={{ marginBottom: '1.5rem' }}>
          {notification}
        </Alert>
      )}

      {/* District Headline Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <KPIStat
          title="Total District Parcels"
          value="1.84M"
          subtitle="Across 14 Tehsils"
          icon="🗺️"
          status="normal"
        />
        <KPIStat
          title="ULPIN (Bhu-Aadhaar) Assigned"
          value="84.2%"
          subtitle="Target: 95% by Dec 2026"
          icon="📍"
          status="success"
        />
        <KPIStat
          title="Overall SLA Adherence"
          value="89.4%"
          subtitle="Avg mutation turnaround: 16.4d"
          icon="⏱️"
          status="success"
        />
        <KPIStat
          title="Escalated Inter-Tehsil Cases"
          value="7"
          subtitle="Requiring Collector determination"
          icon="⚠️"
          status="warning"
        />
      </div>

      {/* Tehsil Performance Rankings & SLA Choropleth Grid */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--ux4g-border-subtle)',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary)' }}>
              Tehsil SLA Performance & Compliance Rankings
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
              14 Tehsils ranked by citizen charter compliance & mutation velocity
            </div>
          </div>
          <Badge variant="warning">1 Tehsil Breaching SLA (Velhe)</Badge>
        </div>

        <div className="ux4g-table-wrapper">
          <table className="ux4g-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Tehsil Name</th>
                <th>Total Parcels</th>
                <th>ULPIN Coverage</th>
                <th>SLA Adherence</th>
                <th>Status</th>
                <th>Administrative Action</th>
              </tr>
            </thead>
            <tbody>
              {TEHSIL_RANKINGS.map((row) => (
                <tr key={row.tehsil}>
                  <td><strong>#{row.rank}</strong></td>
                  <td><strong>{row.tehsil}</strong></td>
                  <td>{row.totalParcels}</td>
                  <td>{row.ulpinCoverage}</td>
                  <td>
                    <strong
                      style={{
                        color:
                          row.status === 'RED'
                            ? 'var(--ux4g-danger)'
                            : row.status === 'YELLOW'
                            ? 'var(--ux4g-warning)'
                            : 'var(--ux4g-success)',
                      }}
                    >
                      {row.slaAdherence}
                    </strong>
                  </td>
                  <td>
                    <Badge variant={row.status === 'RED' ? 'danger' : row.status === 'YELLOW' ? 'warning' : 'success'}>
                      {row.status === 'RED' ? 'SLA Breached' : row.status === 'YELLOW' ? 'Attention' : 'Compliant'}
                    </Badge>
                  </td>
                  <td>
                    {row.status === 'RED' ? (
                      <Button variant="danger" size="sm" onClick={handleReallocate}>
                        ⚠️ Dispatch Support Unit
                      </Button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>Normal Monitoring</span>
                    )}
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

export default DistrictDashboard;
