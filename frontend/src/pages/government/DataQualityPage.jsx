import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  RotateCcw,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DataQualityPage = () => {
  const [remediationNotice, setRemediationNotice] = useState(null);

  const anomalies = [
    {
      id: 'DQ-ANOM-2026-081',
      type: 'AREA_VARIANCE',
      title: 'RoR vs Digitized Cadastre Area Variance (>5%)',
      parcel: 'Gat 45, Wagholi (Haveli)',
      ulpin: 'ULPIN-MH-PUN-000002',
      details: 'RoR record states 0.85 Ha, but digitized polygon measures 0.94 Ha (10.5% variance).',
      severity: 'HIGH',
      status: 'UNDER_SURVEY',
    },
    {
      id: 'DQ-ANOM-2026-084',
      type: 'TOPOLOGY_OVERLAP',
      title: 'Self-Intersecting Cadastral Boundary Polygon',
      parcel: 'Gat 118, Wadgaon Sheri',
      ulpin: 'ULPIN-MH-PUN-000004',
      details: 'Vertex #7 overlaps with adjoining Gat 119 southern stone marker. Geometry fix required.',
      severity: 'MEDIUM',
      status: 'AUTO_FIX_READY',
    },
    {
      id: 'DQ-ANOM-2026-089',
      type: 'MISSING_AADHAAR_SEEDING',
      title: 'Unlinked DigiLocker / Aadhaar on Active Khatedar',
      parcel: 'Gat 204, Manjri',
      ulpin: 'ULPIN-MH-PUN-000012',
      details: 'Deceased owner record without legal heir declaration (Fauti Ferfar required).',
      severity: 'LOW',
      status: 'NOTICE_SERVED',
    },
  ];

  const handleTriggerFix = (anomId) => {
    setRemediationNotice(`Remediation job queued for ${anomId}. e-Mojani differential survey request dispatched to Taluka Inspector of Land Records (TILR).`);
    
  };

  return (
    <div className="page-data-quality" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            <ShieldAlert size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Spatial Data Quality & Topology Hygiene Engine
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Automated topological validation rules identifying area discrepancies, polygon slivers, and attribute variances.
            </p>
          </div>
        </div>

        <Badge variant="secondary" style={{ backgroundColor: '#ea580c', color: '#ffffff', border: 'none' }}>
          OVERALL DQI: 94.2%
        </Badge>
      </div>

      {remediationNotice && (
        <Alert variant="success">
          {remediationNotice}
        </Alert>
      )}

      {/* DQI Hygiene Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Card style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', fontWeight: 700 }}>PARCELS AUDITED</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064e3b', margin: '0.2rem 0' }}>1,842,000</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>100% vector parcels scanned</div>
        </Card>

        <Card style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', fontWeight: 700 }}>AREA VARIANCES (&gt;5%)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ea580c', margin: '0.2rem 0' }}>142</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Scheduled for e-Mojani remeasurement</div>
        </Card>

        <Card style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', fontWeight: 700 }}>TOPOLOGY OVERLAPS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626', margin: '0.2rem 0' }}>18</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Boundary slivers requiring GIS correction</div>
        </Card>

        <Card style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', fontWeight: 700 }}>ORPHAN RECORDS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', margin: '0.2rem 0' }}>0</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>All RoR entries mapped to valid ULPINs</div>
        </Card>
      </div>

      {/* Anomalies List */}
      <Card style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem', color: '#064e3b', fontWeight: 800 }}>
          ⚠️ Active Spatial Quality Flags Requiring Remediation
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {anomalies.map((anom) => (
            <div
              key={anom.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1.15rem',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <code style={{ fontWeight: 800, color: '#064e3b' }}>{anom.id}</code>
                  <Badge variant={anom.severity === 'HIGH' ? 'danger' : anom.severity === 'MEDIUM' ? 'warning' : 'info'}>
                    {anom.severity} PRIORITY
                  </Badge>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-text-secondary)' }}>
                    {anom.parcel}
                  </span>
                </div>
                <h3 style={{ margin: '0.2rem 0', fontSize: '0.95rem', color: 'var(--ux4g-text)' }}>
                  {anom.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ux4g-text-muted)' }}>
                  {anom.details}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleTriggerFix(anom.id)}
                  style={{ backgroundColor: '#064e3b' }}
                >
                  Dispatch e-Mojani TILR Survey
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DataQualityPage;
