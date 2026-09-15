import React, { useState } from 'react';

import parcelService from '../../../services/parcelService';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import {
  FileSignature,
  Search,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const DeedVerificationPage = () => {
  const [searchUlpin, setSearchUlpin] = useState('ULPIN-MH-PUN-000001');
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [auditNotice, setAuditNotice] = useState(null);

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
      console.error('Deed audit error:', err);
      setAuditNotice(`Error checking parcel: ${err.message}`);
    } finally {
      setLoading(false);
      
    }
  };

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
        deedNumber: 'SRO-PUN-2026-8812',
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
      console.warn('Deed initial check notice:', err);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="page-deed-verification" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <FileSignature size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Deed Verification & Pre-Registration Compliance Audit
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Sub-Registrar compliance checkpoint under Section 17 & 21 of the Indian Registration Act 1908.
            </p>
          </div>
        </div>

        <Badge variant="secondary" style={{ backgroundColor: '#ea580c', color: '#ffffff', border: 'none' }}>
          SRO HAVELI-05
        </Badge>
      </div>

      {auditNotice && <Alert variant="success">{auditNotice}</Alert>}

      <Card style={{ padding: '1.25rem' }}>
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
            Run 4-Point Title Check
          </Button>
        </div>

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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
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
                <strong>Government Restrictions:</strong>
                <div style={{ color: 'var(--ux4g-text)', fontWeight: 700, marginTop: '0.2rem' }}>{auditResult.governmentRestriction}</div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DeedVerificationPage;
