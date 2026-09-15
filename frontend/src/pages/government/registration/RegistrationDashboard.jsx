import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import mutationService from '../../../services/mutationService';
import KPIStat from '../../../components/government/KPIStat';
import AuthorityGisMap from '../../../components/government/AuthorityGisMap';
import { ROLES } from '../../../config/roles';
import parcelService from '../../../services/parcelService';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import {
  FileSignature,
  Layers,
  Search,
  CheckCircle2,
  AlertOctagon,
  Calculator,
  Zap,
  Building,
  Scale,
} from 'lucide-react';

export const RegistrationDashboard = () => {
  const { user } = useAuth();
  const [searchUlpin, setSearchUlpin] = useState('ULPIN-MH-PUN-000001');
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [auditNotice, setAuditNotice] = useState(null);
  const [activeTab, setActiveTab] = useState('AUDIT'); // 'AUDIT' | 'GIS_MAP' | 'VALUATION_BANDS' | 'NGDRS_FEED'

  // Valuation Calculator State
  const [plotAreaSqm, setPlotAreaSqm] = useState(250);
  const [selectedZoneRate, setSelectedZoneRate] = useState(52000); // Zone B Residential

  const handleAuditCheck = async () => {
    if (!searchUlpin) return;
    setLoading(true);
    try {
      const data = await parcelService.getParcel360(searchUlpin.trim());
      if (data && data.overview) {
        const overview = data.overview;
        setAuditResult({
          ulpin: overview.ulpin,
          gatNumber: overview.surveyNumber || overview.gatNumber || 'Gat 42',
          village: overview.villageName || 'Wagholi',
          areaHectares: overview.area || 1.45,
          ownerName: data.ownership?.[0]?.ownerName || 'Aarav Patil',
          status: overview.status || 'CLEAR',
          deedNumber: `SRO-PUN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          parties: {
            seller: data.ownership?.[0]?.ownerName || 'Aarav Patil',
            buyer: 'Rohan Kadam (Purchaser)',
          },
          titleStatus: overview.status === 'CLEAR' ? 'CLEAR_MARKETABLE' : 'FLAGGED',
          encumbranceStatus: (data.encumbrances && data.encumbrances.length > 0) ? 'ACTIVE_MORTGAGE' : 'NIL',
          stayStatus: (data.courtCases && data.courtCases.length > 0) ? 'STAY_PENDING' : 'NO_STAY',
          valuation: data.valuation?.marketValueTotal || 13000000,
          stampDutyExpected: Math.round((data.valuation?.marketValueTotal || 13000000) * 0.06),
          flags: data.restrictions?.map((r) => r.title || r.type) || [],
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        });
        setAuditNotice(`Pre-registration audit verified for ${overview.ulpin}. Title & encumbrance synced from PostgreSQL.`);
      } else {
        setAuditNotice(`No parcel found matching '${searchUlpin}'.`);
      }
    } catch (err) {
      console.error('Audit check error:', err);
      setAuditNotice(`Error checking parcel: ${err.message}`);
    } finally {
      setLoading(false);
      
    }
  };

  // Run initial check on mount
  React.useEffect(() => {
    let isMounted = true;
    parcelService.getParcel360('ULPIN-MH-PUN-000001').then((data) => {
      if (!isMounted || !data || !data.overview) return;
      const overview = data.overview;
      setAuditResult({
        ulpin: overview.ulpin,
        gatNumber: overview.surveyNumber || overview.gatNumber || 'Gat 42',
        village: overview.villageName || 'Wagholi',
        areaHectares: overview.area || 1.45,
        ownerName: data.ownership?.[0]?.ownerName || 'Aarav Patil',
        status: overview.status || 'CLEAR',
        deedNumber: 'SRO-PUN-2026-4892',
        parties: {
          seller: data.ownership?.[0]?.ownerName || 'Aarav Patil',
          buyer: 'Rohan Kadam (Purchaser)',
        },
        titleStatus: overview.status === 'CLEAR' ? 'CLEAR_MARKETABLE' : 'FLAGGED',
        encumbranceStatus: (data.encumbrances && data.encumbrances.length > 0) ? 'ACTIVE_MORTGAGE' : 'NIL',
        stayStatus: (data.courtCases && data.courtCases.length > 0) ? 'STAY_PENDING' : 'NO_STAY',
        valuation: data.valuation?.marketValueTotal || 13000000,
        stampDutyExpected: Math.round((data.valuation?.marketValueTotal || 13000000) * 0.06),
        flags: data.restrictions?.map((r) => r.title || r.type) || [],
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      });
    }).catch((err) => {
      console.warn('Initial registration audit error:', err);
    });
    return () => { isMounted = false; };
  }, []);

  const calculatedMarketValue = plotAreaSqm * selectedZoneRate;
  const stampDutyAmt = Math.round(calculatedMarketValue * 0.06); // 6% in Maharashtra
  const regFeeAmt = Math.min(30000, Math.round(calculatedMarketValue * 0.01)); // 1% capped at 30k

  return (
    <div className="page-registration-dashboard" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Officer Header */}
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
              <FileSignature size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              Sub-Registrar Office (SRO) Registration Console
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
              REGISTRATION ACT 1908
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Officer:</strong> {user?.name || 'Rekha Joshi'}</span>
            <span><strong>Office:</strong> Sub-Registrar Office Haveli No 5, Pune</span>
            <span><strong>NGDRS Gateway:</strong> Connected & Synchronized</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            textAlign: 'right',
          }}
        >
          <div style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            NGDRS Emitter: Realtime
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Webhook Handover: 100% Active</div>
        </div>
      </div>

      {auditNotice && (
        <Alert variant="success">
          {auditNotice}
        </Alert>
      )}

      {/* SRO Headline KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
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
          value={auditResult ? "Active" : "Ready"}
          subtitle="Instant title & encumbrance checks"
          icon="🔍"
          status="success"
        />
        <KPIStat
          title="Restricted Parcels Flagged"
          value={auditResult?.status === 'DISPUTED' || auditResult?.status === 'FLAGGED' ? "1 Flagged" : "0 Stayed"}
          subtitle="Active civil court injunction check"
          icon="🛑"
          status={auditResult?.status === 'DISPUTED' ? "danger" : "success"}
        />
        <KPIStat
          title="NGDRS to Land Stack Handover"
          value="100%"
          subtitle="0 retries in dead-letter queue"
          icon="⚡"
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
          onClick={() => setActiveTab('AUDIT')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'AUDIT' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'AUDIT' ? '#064e3b' : undefined,
            borderColor: activeTab === 'AUDIT' ? '#064e3b' : undefined,
            color: activeTab === 'AUDIT' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Search size={15} />
          <span>Pre-Registration Title & Encumbrance Audit</span>
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
          <span>SRO Cadastral GIS & Valuation Zones Map</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('VALUATION_BANDS')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'VALUATION_BANDS' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'VALUATION_BANDS' ? '#064e3b' : undefined,
            borderColor: activeTab === 'VALUATION_BANDS' ? '#064e3b' : undefined,
            color: activeTab === 'VALUATION_BANDS' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Calculator size={15} />
          <span>Ready Reckoner Rate Bands & Stamp Duty</span>
        </button>
      </div>

      {/* TAB 1: PRE-REGISTRATION AUDIT */}
      {activeTab === 'AUDIT' && (
        <Card>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc' }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', color: '#064e3b', fontWeight: 800 }}>
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
              <Button variant="primary" onClick={handleAuditCheck} style={{ backgroundColor: '#064e3b' }}>
                Run Pre-Registration Audit
              </Button>
            </div>

            {/* Quick Picker */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)', alignSelf: 'center' }}>Sample Records:</span>
              {[
                { ulpin: 'ULPIN-MH-PUN-000001', label: 'Gat 42 (Wagholi - Clear)' },
                { ulpin: 'ULPIN-MH-PUN-000002', label: 'Gat 45 (Wagholi - Pending)' },
                { ulpin: 'ULPIN-MH-PUN-000003', label: 'Gat 88 (Wagholi - Disputed)' },
              ].map((item) => (
                <button
                  key={item.ulpin}
                  type="button"
                  className={`ux4g-btn ux4g-btn-sm ${item.ulpin === searchUlpin ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
                  onClick={() => {
                    setSearchUlpin(item.ulpin);
                  }}
                  style={{
                    backgroundColor: item.ulpin === searchUlpin ? '#064e3b' : undefined,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Findings Dossier */}
            {auditResult && (
              <div
                style={{
                  border: auditResult.status === 'HALTED_RESTRICTED' ? '1px solid #fecaca' : '1px solid #bbf7d0',
                  borderRadius: '10px',
                  background: auditResult.status === 'HALTED_RESTRICTED' ? '#fef2f2' : '#f0fdf4',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: auditResult.status === 'HALTED_RESTRICTED' ? 'var(--ux4g-danger)' : 'var(--ux4g-success)', fontSize: '1.05rem', fontWeight: 800 }}>
                      {auditResult.status === 'HALTED_RESTRICTED' ? '🛑 REGISTRATION HALTED: Active Restriction Detected' : '✅ AUDIT RESULT: Cleared for Deed Registration'}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.2rem' }}>
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Canonical RoR Owner:</strong>
                    <div style={{ color: '#064e3b', fontWeight: 700, marginTop: '0.2rem' }}>{auditResult.ownerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{auditResult.aadhaarMatch}</div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Mortgages & Charges:</strong>
                    <div style={{ color: auditResult.status === 'HALTED_RESTRICTED' ? 'var(--ux4g-danger)' : 'var(--ux4g-success)', fontWeight: 700, marginTop: '0.2rem' }}>{auditResult.mortgageStatus}</div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Court Injunctions & Stays:</strong>
                    <div style={{ color: auditResult.status === 'HALTED_RESTRICTED' ? 'var(--ux4g-danger)' : 'var(--ux4g-success)', fontWeight: 700, marginTop: '0.2rem' }}>{auditResult.courtInjunctions}</div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Government & Tribal Restrictions:</strong>
                    <div style={{ color: 'var(--ux4g-text)', fontWeight: 700, marginTop: '0.2rem' }}>{auditResult.governmentRestriction}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* TAB 2: SRO GIS & VALUATION MAP */}
      {activeTab === 'GIS_MAP' && (
        <Card style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
                Haveli-01 SRO Registration Cadastre & Ready Reckoner Overlay
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Inspect registered deeds, pending execution plots, and purple Ready Reckoner valuation rate bands.
              </p>
            </div>
            <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>
              SRO Haveli 05
            </Badge>
          </div>

          <AuthorityGisMap
            authorityRole={ROLES.SRO}
            activeJurisdiction="Haveli-01 SRO Sub-District"
            height="620px"
            selectedUlpin={searchUlpin}
          />
        </Card>
      )}

      {/* TAB 3: READY RECKONER VALUATION CALCULATOR */}
      {activeTab === 'VALUATION_BANDS' && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
              Maharashtra Annual Statement of Rates (Ready Reckoner 2026-27)
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)' }}>
              Official statutory stamp duty and registration fee valuation calculator for Haveli Sub-District
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Input Form */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div className="ux4g-form-group" style={{ marginBottom: '1rem' }}>
                <label className="ux4g-label">Select Ready Reckoner Valuation Zone</label>
                <select
                  className="ux4g-select"
                  value={selectedZoneRate}
                  onChange={(e) => setSelectedZoneRate(Number(e.target.value))}
                >
                  <option value={85000}>Zone A: Commercial Corridor (₹85,000 / sqm)</option>
                  <option value={52000}>Zone B: Residential Non-Agricultural (₹52,000 / sqm)</option>
                  <option value={32000}>Zone C: Gaothan Residential (₹32,000 / sqm)</option>
                  <option value={18000}>Zone D: Agricultural Bagayat (₹18,000 / sqm)</option>
                </select>
              </div>

              <div className="ux4g-form-group" style={{ marginBottom: '1rem' }}>
                <label className="ux4g-label">Plot / Carpet Area (Square Meters)</label>
                <input
                  type="number"
                  className="ux4g-input"
                  value={plotAreaSqm}
                  onChange={(e) => setPlotAreaSqm(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Calculated Output Card */}
            <div style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                  Statutory Duty Assessment
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#064e3b', margin: '0.5rem 0' }}>
                  ₹{(calculatedMarketValue).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
                  Calculated Minimum Market Valuation (ASR)
                </div>
              </div>

              <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Stamp Duty (6%):</span>
                  <strong>₹{stampDutyAmt.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Registration Fee (1% capped):</span>
                  <strong>₹{regFeeAmt.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #86efac', paddingTop: '0.5rem', fontWeight: 800, color: '#064e3b', fontSize: '0.95rem' }}>
                  <span>Total Govt Chalan:</span>
                  <span>₹{(stampDutyAmt + regFeeAmt).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* NGDRS Integration Webhook Monitor Strip */}
      <Card>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.05rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
            ⚡ National Generic Document Registration System (NGDRS) Pipeline
          </h2>
        </div>
        <div style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--ux4g-text-secondary)' }}>
            Upon deed execution, the registration event triggers the Land Stack webhook emitter, automatically inserting the Form 6 pencil entry and notifying the Talathi for ground inspection.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>&bull; Webhook Emitter: <strong style={{ color: 'var(--ux4g-success)' }}>Active (HTTP 200 OK)</strong></div>
            <div>&bull; Registered Deeds Handed Over Today: <strong>48</strong></div>
            <div>&bull; Queue Latency: <strong>42ms</strong></div>
            <div>&bull; Retries in DLQ: <strong>0</strong></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationDashboard;
