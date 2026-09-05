import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import districtRankingsData from '../../../data/analytics/districtRankings.json';
import KPIStat from '../../../components/government/KPIStat';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';

export const DistrictDashboard = () => {
  const { user } = useAuth();
  const [tehsils, setTehsils] = useState(districtRankingsData);
  const [notification, setNotification] = useState(null);

  const handleReallocate = (tehsilName = 'Velhe (Rajgad)') => {
    setTehsils((prev) =>
      prev.map((t) =>
        t.tehsil === tehsilName ? { ...t, officersAllocated: t.officersAllocated + 2, status: 'YELLOW' } : t
      )
    );
    setNotification(`Administrative Order issued: 2 Additional Revenue Inspectors dispatched to ${tehsilName} to accelerate backlog clearance.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const breachingTehsils = tehsils.filter((t) => t.status === 'RED');

  return (
    <div className="page-district-dashboard" style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
          <Button variant="outline" size="sm" onClick={() => handleReallocate('Velhe (Rajgad)')} style={{ color: '#fff', borderColor: '#fff' }}>
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
              Tehsil SLA Performance & Compliance Rankings (14 Tehsils)
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
              All 14 Tehsils ranked by citizen charter compliance & mutation velocity
            </div>
          </div>
          <Badge variant={breachingTehsils.length > 0 ? 'danger' : 'success'}>
            {breachingTehsils.length > 0 ? `${breachingTehsils.length} Tehsil Breaching SLA` : 'All Tehsils Compliant'}
          </Badge>
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
                <th>Pending Cases</th>
                <th>Officers</th>
                <th>Status</th>
                <th>Administrative Action</th>
              </tr>
            </thead>
            <tbody>
              {tehsils.map((row) => (
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
                  <td>{row.pendingCases}</td>
                  <td>{row.officersAllocated} officers</td>
                  <td>
                    <Badge variant={row.status === 'RED' ? 'danger' : row.status === 'YELLOW' ? 'warning' : 'success'}>
                      {row.status === 'RED' ? 'SLA Breached' : row.status === 'YELLOW' ? 'Attention' : 'Compliant'}
                    </Badge>
                  </td>
                  <td>
                    {row.status === 'RED' ? (
                      <Button variant="danger" size="sm" onClick={() => handleReallocate(row.tehsil)}>
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
