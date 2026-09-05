import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import adminSystemData from '../../../data/analytics/adminSystem.json';
import KPIStat from '../../../components/government/KPIStat';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [auditStatus, setAuditStatus] = useState(null);

  const handleVerifyHashChain = () => {
    setAuditStatus(
      `Cryptographic Hash-Chain Verification Completed: ${adminSystemData.auditLog.partitionsScanned} verified across Kafka partitions. Merkle root checksum ${adminSystemData.auditLog.merkleRootChecksum.slice(0, 18)}... VALID. ${adminSystemData.auditLog.tamperEvidence}.`
    );
    setTimeout(() => setAuditStatus(null), 6000);
  };

  return (
    <div className="page-admin-dashboard" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Admin Operations Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
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
            <span style={{ fontSize: '1.6rem' }}>⚙️</span>
            <h1 style={{ color: '#ffffff', fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>
              System Administrator Console — Platform Operations
            </h1>
            <span
              style={{
                background: '#ef4444',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              SYS_ADMIN • NIC CLOUD
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Administrator:</strong> {user?.name || 'Manoj Tiwari'}</span>
            <span><strong>Cluster:</strong> {adminSystemData.clusterName}</span>
            <span><strong>Datacenter:</strong> {adminSystemData.datacenter}</span>
            <span><strong>OPA Policy:</strong> {adminSystemData.opaPolicyVersion}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" onClick={handleVerifyHashChain} style={{ color: '#fff', borderColor: '#94a3b8' }}>
            🔐 Verify Hash-Chain
          </Button>
          <Button variant="primary" size="sm" style={{ background: '#2563eb' }}>
            🚀 Deploy OPA Policy
          </Button>
        </div>
      </div>

      {auditStatus && (
        <Alert variant="success" style={{ marginBottom: '1.5rem' }}>
          <strong>Integrity Confirmed:</strong> {auditStatus}
        </Alert>
      )}

      {/* Cluster & Infrastructure KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <KPIStat
          title="Cluster Pod Health"
          value={`${adminSystemData.healthyPods} / ${adminSystemData.totalPods}`}
          subtitle="All microservices running normal"
          icon="🛡️"
          status="success"
        />
        <KPIStat
          title="Kafka Consumer Lag"
          value={adminSystemData.kafkaConsumerLag}
          subtitle="Realtime mutation event bus"
          icon="⚡"
          status="success"
        />
        <KPIStat
          title="Dead-Letter Queue (DLQ)"
          value={adminSystemData.deadLetterQueueDepth}
          subtitle="Zero failed payload events"
          icon="📥"
          status="success"
        />
        <KPIStat
          title="Audit Hash-Chain Status"
          value={adminSystemData.auditLog.status}
          subtitle="Tamper-evident log integrity"
          icon="🔐"
          status="success"
        />
      </div>

      {/* Cryptographic Hash-Chain & Tamper-Evident Verification Panel */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--ux4g-primary)' }}>
              🔐 Cryptographic Audit Log & Provenance Verification
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
              SHA-256 Merkle tree verification across all mutation state transitions
            </div>
          </div>
          <Badge variant="success">Zero Tamper Evidence</Badge>
        </div>

        <div style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--ux4g-surface-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--ux4g-radius-md)' }}>
              <div>Last Hash-Chain Scan: <strong>Today {adminSystemData.auditLog.lastVerifiedUtc}</strong></div>
              <div>Partitions Scanned: <strong>{adminSystemData.auditLog.partitionsScanned}</strong></div>
            </div>
            <div style={{ background: 'var(--ux4g-surface-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--ux4g-radius-md)' }}>
              <div>Merkle Root Checksum: <code style={{ fontSize: '0.75rem' }}>{adminSystemData.auditLog.merkleRootChecksum.slice(0, 24)}...</code></div>
              <div>Compliance Signature: <strong>{adminSystemData.auditLog.hsmSignature}</strong></div>
            </div>
          </div>

          <p style={{ margin: 0, color: 'var(--ux4g-text-secondary)' }}>
            Every mutation approval by a Tehsildar and verification by a Talathi is immutably linked to the previous state transition via cryptographic parent hashes.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
