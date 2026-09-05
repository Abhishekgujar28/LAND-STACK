import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import sroAuditsData from '../../../data/mutations/sroAudits.json';
import KPIStat from '../../../components/government/KPIStat';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';

export const RegistrationDashboard = () => {
  const { user } = useAuth();
  const [searchUlpin, setSearchUlpin] = useState(sroAuditsData[0]?.ulpin || 'IN-MH-PUN-0001-12345');
  const [auditResult, setAuditResult] = useState(sroAuditsData[0]);
  const [auditNotice, setAuditNotice] = useState(null);

  const handleAuditCheck = () => {
    const matched = sroAuditsData.find(
      (a) => a.ulpin.toLowerCase().includes(searchUlpin.toLowerCase()) || a.gatNumber.toLowerCase().includes(searchUlpin.toLowerCase())
    ) || sroAuditsData[0];

    setAuditResult({
      ...matched,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    });
    setAuditNotice(`Pre-registration audit verified for ${matched.gatNumber} (${matched.ulpin}). RoR title & encumbrance synced.`);
    setTimeout(() => setAuditNotice(null), 4000);
  };

  return (
    <div className="page-registration-dashboard" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Officer Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4a1d96 0%, #2e1065 100%)',
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
            <span style={{ fontSize: '1.6rem' }}>🏛️</span>
            <h1 style={{ color: '#ffffff', fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>
              Sub-Registrar Office (SRO) Registration Console
            </h1>
            <span
              style={{
                background: '#c084fc',
                color: '#2e1065',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              REGISTRATION ACT 1908
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Officer:</strong> {user?.name || 'Rekha Joshi'}</span>
            <span><strong>Office:</strong> Sub-Registrar Office Haveli No 5, Pune</span>
            <span><strong>NGDRS Gateway:</strong> Connected & Synchronized</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--ux4g-radius-md)',
            textAlign: 'right',
          }}
        >
          <div style={{ color: '#ffffff', fontWeight: 700 }}>NGDRS Emitter: 🟢 Active</div>
          <div style={{ color: '#e9d5ff', fontSize: '0.75rem' }}>Webhook Handover: 100% Realtime</div>
        </div>
      </div>

      {auditNotice && (
        <Alert variant="success" style={{ marginBottom: '1.5rem' }}>
          {auditNotice}
        </Alert>
      )}

      {/* SRO Headline KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <KPIStat
          title="Daily Deeds Processed"
          value="48"
          subtitle="Conveyance & Sale deeds registered today"
          icon="📜"
          status="normal"
        />
        <KPIStat
          title="Pre-Registration Audits"
          value={sroAuditsData.length}
          subtitle="Instant title & encumbrance checks"
          icon="🔍"
          status="success"
        />
        <KPIStat
          title="Restricted Parcels Flagged"
          value={sroAuditsData.filter((a) => a.status === 'HALTED_RESTRICTED').length}
          subtitle="Active civil court injunction halted"
          icon="🛑"
          status="danger"
        />
        <KPIStat
          title="NGDRS to Land Stack Handover"
          value="100%"
          subtitle="0 retries in dead-letter queue"
          icon="⚡"
          status="success"
        />
      </div>

      {/* Instant Pre-Registration Parcel Audit Tool */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', color: 'var(--ux4g-primary)' }}>
            🔍 Instant Pre-Registration Parcel Title & Encumbrance Audit
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
            Run pre-execution compliance check before accepting deed registration under Section 17 of the Registration Act.
          </p>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="ux4g-input"
              style={{ flex: 1, minWidth: '260px' }}
              value={searchUlpin}
              onChange={(e) => setSearchUlpin(e.target.value)}
              placeholder="Enter ULPIN (Bhu-Aadhaar) or Gat/Survey Number..."
            />
            <Button variant="primary" onClick={handleAuditCheck}>
              Run Pre-Registration Audit
            </Button>
          </div>

          {/* Pre-Registration Audits Quick Picker */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)', alignSelf: 'center' }}>Sample Records:</span>
            {sroAuditsData.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`ux4g-btn ux4g-btn-sm ${item.id === auditResult?.id ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
                onClick={() => {
                  setSearchUlpin(item.ulpin);
                  setAuditResult(item);
                }}
              >
                {item.gatNumber.split(' ')[0]} {item.gatNumber.split(' ')[1]} ({item.status === 'HALTED_RESTRICTED' ? '⚠️ Stayed' : 'Clear'})
              </button>
            ))}
          </div>

          {/* Audit Findings Dossier */}
          {auditResult && (
            <div
              style={{
                border: auditResult.status === 'HALTED_RESTRICTED' ? '1px solid #fecaca' : '1px solid #bbf7d0',
                borderRadius: 'var(--ux4g-radius-md)',
                background: auditResult.status === 'HALTED_RESTRICTED' ? '#fef2f2' : '#f0fdf4',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: auditResult.status === 'HALTED_RESTRICTED' ? 'var(--ux4g-danger)' : 'var(--ux4g-success)', fontSize: '1.05rem' }}>
                    {auditResult.status === 'HALTED_RESTRICTED' ? '🛑 REGISTRATION HALTED: Active Restriction Detected' : '✅ AUDIT RESULT: Cleared for Deed Registration'}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                    Target: <strong>{auditResult.gatNumber}</strong> | ULPIN: <code>{auditResult.ulpin}</code> | Deed: {auditResult.deedType}
                  </div>
                </div>
                <Badge variant={auditResult.status === 'HALTED_RESTRICTED' ? 'danger' : 'success'}>
                  {auditResult.status === 'HALTED_RESTRICTED' ? 'Restricted' : 'Clear Title'}
                </Badge>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: 'var(--ux4g-radius-sm)', border: '1px solid #e2e8f0' }}>
                  <strong>Canonical RoR Owner:</strong>
                  <div style={{ color: 'var(--ux4g-primary)', fontWeight: 600 }}>{auditResult.ownerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{auditResult.aadhaarMatch}</div>
                </div>

                <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: 'var(--ux4g-radius-sm)', border: '1px solid #e2e8f0' }}>
                  <strong>Mortgages & Charges:</strong>
                  <div style={{ color: auditResult.status === 'HALTED_RESTRICTED' ? 'var(--ux4g-danger)' : 'var(--ux4g-success)', fontWeight: 600 }}>{auditResult.mortgageStatus}</div>
                </div>

                <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: 'var(--ux4g-radius-sm)', border: '1px solid #e2e8f0' }}>
                  <strong>Court Injunctions & Stays:</strong>
                  <div style={{ color: auditResult.status === 'HALTED_RESTRICTED' ? 'var(--ux4g-danger)' : 'var(--ux4g-success)', fontWeight: 600 }}>{auditResult.courtInjunctions}</div>
                </div>

                <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: 'var(--ux4g-radius-sm)', border: '1px solid #e2e8f0' }}>
                  <strong>Government & Tribal Restrictions:</strong>
                  <div style={{ color: 'var(--ux4g-text)', fontWeight: 600 }}>{auditResult.governmentRestriction}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* NGDRS Integration Webhook Monitor Strip */}
      <Card>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--ux4g-primary)' }}>
            ⚡ National Generic Document Registration System (NGDRS) Pipeline
          </h2>
        </div>
        <div style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            Upon deed execution, the registration event triggers the Land Stack webhook emitter, automatically inserting the Form 6 pencil entry and notifying the Talathi for ground inspection.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>• Webhook Emitter: <strong style={{ color: 'var(--ux4g-success)' }}>Active (HTTP 200 OK)</strong></div>
            <div>• Registered Deeds Handed Over Today: <strong>48</strong></div>
            <div>• Queue Latency: <strong>42ms</strong></div>
            <div>• Retries in DLQ: <strong>0</strong></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationDashboard;
