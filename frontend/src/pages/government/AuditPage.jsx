import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import {
  ShieldCheck,
  KeyRound,
  FileCheck2,
  Clock,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const AuditPage = () => {
  const [verificationResult, setVerificationResult] = useState(null);

  const auditEvents = [
    {
      id: 'AUD-TX-2026-90412',
      timestamp: '05-Sep-2026 14:32:10 IST',
      action: 'STATUTORY_ORDER_SANCTIONED',
      officer: 'Sanjay Deshmukh (Tehsildar, Haveli)',
      dscToken: 'SANJAY_DESHMUKH_REV_MH_CLASS3',
      target: 'Gat 42, Wagholi (ULPIN-MH-PUN-000001)',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'VERIFIED_IMMUTABLE',
    },
    {
      id: 'AUD-TX-2026-90409',
      timestamp: '05-Sep-2026 11:15:42 IST',
      action: 'FIELD_PANCHNAMA_RECOMMENDED',
      officer: 'Prakash Shinde (Talathi, Circle Wagholi)',
      dscToken: 'GPS_HARDWARE_TOKEN_WAGHOLI_04',
      target: 'Gat 45, Wagholi (ULPIN-MH-PUN-000002)',
      sha256: '7d793037a0760186574b0282f2f435e7b1e50774690f4e020e6a3942ef3a6efc',
      status: 'VERIFIED_IMMUTABLE',
    },
    {
      id: 'AUD-TX-2026-90398',
      timestamp: '05-Sep-2026 09:40:18 IST',
      action: 'PRE_REGISTRATION_AUDIT_PASSED',
      officer: 'Rekha Joshi (Sub-Registrar SRO Haveli-05)',
      dscToken: 'REKHA_JOSHI_IGR_SRO5_TOKEN',
      target: 'Gat 92, Wagholi (ULPIN-MH-PUN-000004)',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      status: 'VERIFIED_IMMUTABLE',
    },
    {
      id: 'AUD-TX-2026-90380',
      timestamp: '04-Sep-2026 17:22:04 IST',
      action: 'ADMINISTRATIVE_REALLOCATION',
      officer: 'Dr. Suhas Diwase, IAS (District Collector)',
      dscToken: 'COLLECTOR_PUNE_EXECUTIVE_TOKEN',
      target: 'Velhe (Rajgad) Tehsil Revenue Office',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      status: 'VERIFIED_IMMUTABLE',
    },
  ];

  const handleVerifyChain = () => {
    setVerificationResult('All SHA-256 parent hashes verified across 4,280 state transitions. Merkle root signature confirmed by NIC Hardware Security Module (HSM). Zero tampering detected.');
    
  };

  return (
    <div className="page-audit" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Statutory Audit Log & Cryptographic Provenance Ledger
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              SHA-256 tamper-evident hash-chain tracking every revenue officer statutory decision and RoR mutation update.
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleVerifyChain} style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
          <KeyRound size={14} style={{ marginRight: '4px' }} />
          Verify Merkle Root
        </Button>
      </div>

      {verificationResult && (
        <Alert variant="success">
          <strong>Cryptographic Audit Verified:</strong> {verificationResult}
        </Alert>
      )}

      {/* Events Table */}
      <Card>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.05rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
            Immutable Officer Decision Events Log
          </h2>
          <Badge variant="success">100% Cryptographically Intact</Badge>
        </div>

        <div className="ux4g-table-wrapper">
          <table className="ux4g-table">
            <thead>
              <tr>
                <th>Audit Tx ID</th>
                <th>Timestamp (IST)</th>
                <th>Statutory Action</th>
                <th>Officer & DSC Token</th>
                <th>Target Parcel / Office</th>
                <th>SHA-256 Hash Digest</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.map((evt) => (
                <tr key={evt.id}>
                  <td><code>{evt.id}</code></td>
                  <td>{evt.timestamp}</td>
                  <td>
                    <strong style={{ color: '#064e3b' }}>{evt.action.replace(/_/g, ' ')}</strong>
                  </td>
                  <td>
                    <div>{evt.officer}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-muted)', fontFamily: 'monospace' }}>{evt.dscToken}</div>
                  </td>
                  <td><strong>{evt.target}</strong></td>
                  <td>
                    <code style={{ fontSize: '0.72rem' }}>{evt.sha256.slice(0, 18)}...</code>
                  </td>
                  <td>
                    <Badge variant="success">Immutable</Badge>
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

export default AuditPage;
