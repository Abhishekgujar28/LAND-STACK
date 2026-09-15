import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import analyticsService from '../../../services/analyticsService';
import KPIStat from '../../../components/government/KPIStat';
import AuthorityGisMap from '../../../components/government/AuthorityGisMap';
import { ROLES } from '../../../config/roles';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import {
  Building2,
  Layers,
  BarChart3,
  MapPin,
  Compass,
  FileText,
  AlertTriangle,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';

export const DistrictDashboard = () => {
  const { user } = useAuth();
  const [tehsils, setTehsils] = useState([
    { rank: 1, tehsil: 'Haveli', pendingMutations: 142, avgDisposalDays: 11.2, complianceRate: '96.8%', officersAllocated: 18, status: 'GREEN' },
    { rank: 2, tehsil: 'Pune City', pendingMutations: 89, avgDisposalDays: 12.4, complianceRate: '95.2%', officersAllocated: 12, status: 'GREEN' },
    { rank: 3, tehsil: 'Mulshi', pendingMutations: 210, avgDisposalDays: 14.1, complianceRate: '91.5%', officersAllocated: 10, status: 'GREEN' },
    { rank: 4, tehsil: 'Khed', pendingMutations: 340, avgDisposalDays: 16.8, complianceRate: '88.4%', officersAllocated: 14, status: 'YELLOW' },
    { rank: 5, tehsil: 'Maval', pendingMutations: 420, avgDisposalDays: 19.5, complianceRate: '84.2%', officersAllocated: 11, status: 'YELLOW' },
    { rank: 6, tehsil: 'Baramati', pendingMutations: 512, avgDisposalDays: 23.1, complianceRate: '79.6%', officersAllocated: 15, status: 'RED' },
    { rank: 7, tehsil: 'Velhe (Rajgad)', pendingMutations: 630, avgDisposalDays: 28.4, complianceRate: '71.2%', officersAllocated: 6, status: 'RED' },
  ]);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('RANKINGS'); // 'RANKINGS' | 'GIS_MAP' | 'LAND_ACQUISITION'

  React.useEffect(() => {
    let isMounted = true;
    analyticsService.getTehsilData()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((t, i) => ({
            rank: i + 1,
            tehsil: t.name,
            pendingMutations: 120 + i * 45,
            avgDisposalDays: 12 + i * 2,
            complianceRate: `${Math.max(70, 96 - i * 4)}%`,
            officersAllocated: 8 + (i % 5),
            status: i < 3 ? 'GREEN' : i < 5 ? 'YELLOW' : 'RED',
          }));
          setTehsils(mapped);
        }
      })
      .catch((err) => console.warn('Tehsils fetch:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleReallocate = (tehsilName = 'Velhe (Rajgad)') => {
    setTehsils((prev) =>
      prev.map((t) =>
        t.tehsil === tehsilName ? { ...t, officersAllocated: t.officersAllocated + 2, status: 'YELLOW' } : t
      )
    );
    setNotification(`Administrative Order issued: 2 Additional Revenue Inspectors dispatched to ${tehsilName} to accelerate backlog clearance.`);
    
  };

  const breachingTehsils = tehsils.filter((t) => t.status === 'RED');

  return (
    <div className="page-district-dashboard" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Collector Command Header */}
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
              <Building2 size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              District Collector Command Cockpit
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
              DISTRICT MAGISTRATE
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Collector:</strong> {user?.name || 'Dr. Suhas Diwase, IAS'}</span>
            <span><strong>District:</strong> Pune District (14 Tehsils, 1,885 Villages)</span>
            <span><strong>DQI Grade:</strong> Grade 'A' (89.2/100)</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" onClick={() => handleReallocate('Velhe (Rajgad)')} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
            <UserPlus size={14} style={{ marginRight: '4px' }} />
            Reallocate Officers
          </Button>
          <Button variant="primary" size="sm" style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}>
            Export District MIS
          </Button>
        </div>
      </div>

      {notification && (
        <Alert variant="success">
          {notification}
        </Alert>
      )}

      {/* District Headline Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
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
          onClick={() => setActiveTab('RANKINGS')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'RANKINGS' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'RANKINGS' ? '#064e3b' : undefined,
            borderColor: activeTab === 'RANKINGS' ? '#064e3b' : undefined,
            color: activeTab === 'RANKINGS' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <BarChart3 size={15} />
          <span>14 Tehsils SLA Compliance & Officer Allocation</span>
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
          <span>Pune District 14-Tehsil GIS Choropleth</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('LAND_ACQUISITION')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'LAND_ACQUISITION' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'LAND_ACQUISITION' ? '#064e3b' : undefined,
            borderColor: activeTab === 'LAND_ACQUISITION' ? '#064e3b' : undefined,
            color: activeTab === 'LAND_ACQUISITION' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Compass size={15} />
          <span>NHAI Corridors & Sec 36A Tribal Land</span>
        </button>
      </div>

      {/* TAB 1: TEHSILS RANKINGS */}
      {activeTab === 'RANKINGS' && (
        <Card>
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
              <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
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
      )}

      {/* TAB 2: DISTRICT GIS CHOROPLETH */}
      {activeTab === 'GIS_MAP' && (
        <Card style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
                Pune District 14-Tehsil Administrative GIS Choropleth
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Spatial SLA compliance heat map showing green (compliant), yellow (attention), and red (escalated) Tehsils.
              </p>
            </div>
            <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>
              14 Tehsils Active
            </Badge>
          </div>

          <AuthorityGisMap
            authorityRole={ROLES.COLLECTOR}
            activeJurisdiction="Pune District (14 Tehsils)"
            height="620px"
          />
        </Card>
      )}

      {/* TAB 3: LAND ACQUISITION & SEC 36A */}
      {activeTab === 'LAND_ACQUISITION' && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
              Special Statutory Sanctions & Mega Infrastructure Corridors
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)' }}>
              Collector approval console for Section 36A tribal transfers and RFCTLARR Act (2013) land acquisitions
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: '#064e3b', marginBottom: '0.5rem' }}>
                🛣️ Pune Ring Road Project (MSRDC Corridor)
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div>&bull; Total Parcels Affected: <strong>1,420 Parcels</strong></div>
                <div>&bull; Awards Declared: <strong>1,180 (83.1%)</strong></div>
                <div>&bull; Direct Purchase Consent: <strong>92.4%</strong></div>
                <div>&bull; Compensation Disbursed: <strong>₹2,840 Cr via PFMS</strong></div>
              </div>
            </div>

            <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <div style={{ fontWeight: 800, color: '#b45309', marginBottom: '0.5rem' }}>
                🛡️ Section 36A MLR Code (Tribal Land Transfer Sanctions)
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div>&bull; Pending Sanction Requests: <strong>3 Cases (Khed & Ambegaon)</strong></div>
                <div>&bull; Mandatory Inquiries Completed: <strong>2 by SDO</strong></div>
                <div>&bull; Competent Authority: <strong>District Collector Exclusive</strong></div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DistrictDashboard;
