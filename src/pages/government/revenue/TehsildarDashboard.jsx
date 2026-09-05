import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import tehsildarQueueData from '../../../data/mutations/tehsildarQueue.json';
import KPIStat from '../../../components/government/KPIStat';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Modal from '../../../components/ui/Modal';

export const TehsildarDashboard = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState(tehsildarQueueData);
  const [selectedCaseId, setSelectedCaseId] = useState(tehsildarQueueData[0]?.id || 'MUT-PU-HVL-2026-00456');
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const selectedCase = queue.find((c) => c.id === selectedCaseId) || queue[0];

  const handleExecuteOrder = (decision) => {
    setShowSanctionModal(false);
    setShowRejectModal(false);
    setShowClarificationModal(false);

    if (decision === 'SANCTION') {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === selectedCase.id ? { ...item, status: 'STATUTORY_ORDER_PASSED' } : item
        )
      );
      setActionNotice(
        `Statutory Sanction Order passed for ${selectedCase.gatNumber} (${selectedCase.id}). Digitally signed with Tehsildar DSC token. RoR 7/12 mutation entry certified!`
      );
    } else if (decision === 'REJECT') {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === selectedCase.id ? { ...item, status: 'STATUTORY_REJECTED' } : item
        )
      );
      setActionNotice(
        `Statutory Rejection Order passed for ${selectedCase.gatNumber}. Reason recorded under Section 149/150 MLR Code. Dispatched to parties.`
      );
    } else {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === selectedCase.id ? { ...item, status: 'RETURNED_TO_TALATHI' } : item
        )
      );
      setActionNotice(
        `Case ${selectedCase.id} returned to Talathi (${selectedCase.talathiName}) for clarification on boundary area.`
      );
    }
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="page-tehsildar-workspace" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Officer Jurisdiction Identity Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0b3c5d 0%, #062134 100%)',
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
            <span style={{ fontSize: '1.6rem' }}>⚖️</span>
            <h1 style={{ color: '#ffffff', fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>
              Tehsildar Statutory Decision Workspace
            </h1>
            <span
              style={{
                background: '#dc2626',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              PRIMARY STATUTORY AUTHORITY
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Officer:</strong> {user?.name || 'Sanjay Deshmukh'}</span>
            <span><strong>Designation:</strong> Tehsildar & Executive Magistrate</span>
            <span><strong>Jurisdiction:</strong> Entire Haveli Taluka, Pune (112 Villages)</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--ux4g-radius-md)',
            textAlign: 'right',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ color: '#ffffff', fontWeight: 700 }}>DSC Digital Token Active</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Class-3 e-Sign: SANJAY_DESHMUKH_REV_MH</div>
        </div>
      </div>

      {actionNotice && (
        <Alert variant="success" style={{ marginBottom: '1.5rem' }}>
          <strong>Statutory Order Executed:</strong> {actionNotice}
        </Alert>
      )}

      {/* Headline Statutory KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <KPIStat
          title="Awaiting Statutory Order"
          value={queue.filter((q) => q.status === 'READY_FOR_ORDER').length}
          subtitle="Talathi verified cases ready"
          icon="⚖️"
          status="warning"
        />
        <KPIStat
          title="Hearings Scheduled Today"
          value="4"
          subtitle="Revenue court bench (11:00 AM)"
          icon="📅"
          status="normal"
        />
        <KPIStat
          title="SLA Breached (>30 Days)"
          value={queue.filter((q) => q.daysPending > 30).length}
          subtitle="Auto-escalation warning"
          icon="⚠️"
          status="danger"
        />
        <KPIStat
          title="AI Risk Advisory Flags"
          value="5"
          subtitle="High area / litigation variance"
          icon="🤖"
          status="warning"
        />
      </div>

      {/* Main Review Cockpit: Left List, Right Split Dossier */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Cases List */}
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
            <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary)' }}>
              📋 Tehsil Statutory Decision Queue
            </h2>
            <Badge variant="primary">{queue.length} Cases</Badge>
          </div>

          <div style={{ padding: '0.75rem' }}>
            {queue.map((item) => {
              const isSelected = item.id === selectedCase.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  style={{
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    borderRadius: 'var(--ux4g-radius-md)',
                    border: isSelected ? '2px solid var(--ux4g-primary)' : '1px solid var(--ux4g-border-subtle)',
                    background: isSelected ? 'var(--ux4g-primary-light)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--ux4g-primary)' }}>
                      {item.gatNumber} ({item.village})
                    </span>
                    <Badge variant={item.status === 'HEARING_SCHEDULED' ? 'warning' : 'info'}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.type}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', marginTop: '0.25rem' }}>
                    Verified by Talathi {item.talathiName} • {item.daysPending} days in workflow
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Split-Panel Review & Statutory Order Execution */}
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
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
                Statutory Hearing & Order Bench
              </div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--ux4g-primary)' }}>
                {selectedCase.gatNumber} — {selectedCase.village}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Case ULPIN</span>
              <div style={{ fontFamily: 'var(--ux4g-font-mono)', fontWeight: 700, fontSize: '0.85rem' }}>
                {selectedCase.ulpin}
              </div>
            </div>
          </div>

          <div style={{ padding: '1.25rem' }}>
            {/* Split Panel: Dossier Evidence + AI Advisory */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* Evidence Dossier */}
              <div
                style={{
                  padding: '0.85rem',
                  background: 'var(--ux4g-surface-muted)',
                  borderRadius: 'var(--ux4g-radius-md)',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--ux4g-primary)' }}>
                  📁 Evidence & Verification Dossier
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div>• <strong>Registered Deed:</strong> {selectedCase.deedNumber}</div>
                  <div>• <strong>Talathi Panchnama:</strong> {selectedCase.talathiReport}</div>
                  <div>• <strong>Site Photos:</strong> {selectedCase.photosCount} GPS stamped</div>
                  <div>• <strong>Section 135D:</strong> {selectedCase.noticePeriodStatus}</div>
                  <div>• <strong>Encumbrances:</strong> Nil active bank charges</div>
                </div>
              </div>

              {/* AI Advisory Panel */}
              <div
                style={{
                  padding: '0.85rem',
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--ux4g-radius-md)',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--ux4g-warning)' }}>
                  🤖 AI Risk Advisory & Decision Support
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#78350f' }}>
                  {selectedCase.aiFlag}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#92400e' }}>
                  AI Confidence: <strong>94.6%</strong> | Model: <code>LandGov-v2.1</code>
                </div>
              </div>
            </div>

            {/* Legal Authority Note */}
            <Alert variant="info" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <strong>Sole Statutory Competence:</strong> As Tehsildar, you possess the exclusive statutory authority to sanction or reject mutation orders under the Maharashtra Land Revenue Code (1966). AI recommendations are non-binding advisory inputs.
            </Alert>

            {/* STATUTORY ACTIONS */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: '1px solid var(--ux4g-border-subtle)',
              }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClarificationModal(true)}
              >
                🔄 Return to Talathi for Clarification
              </Button>

              <Button
                variant="danger"
                size="md"
                onClick={() => setShowRejectModal(true)}
              >
                ❌ Reject with Legal Grounds
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setShowSanctionModal(true)}
              >
                ✅ Statutory Sanction Order (e-Sign)
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sanction Modal with Digital Signature */}
      <Modal
        isOpen={showSanctionModal}
        onClose={() => setShowSanctionModal(false)}
        title="Execute Statutory Sanction Order"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => setShowSanctionModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleExecuteOrder('SANCTION')}>
              ✍️ Sign & Issue Statutory Order
            </Button>
          </div>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <p>
            You are about to issue the authoritative <strong>Statutory Mutation Order</strong> for <strong>{selectedCase.gatNumber}</strong> ({selectedCase.id}).
          </p>
          <div
            style={{
              padding: '0.75rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--ux4g-radius-md)',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <div>• Transferee: <strong>{selectedCase.applicant}</strong></div>
            <div>• RoR Update: Form 6 certified & 7/12 record updated</div>
            <div>• Digital Token: <code>SHA-256 DSC RSA 2048 Bit Verified</code></div>
          </div>
        </div>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Statutory Mutation Rejection Order"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleExecuteOrder('REJECT')}>
              Confirm Rejection Order
            </Button>
          </div>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <div className="ux4g-form-group">
            <label className="ux4g-label ux4g-label-required">Mandatory Legal Ground (MLR Code)</label>
            <select className="ux4g-select">
              <option>Section 149: Failure to produce registered title conveyance</option>
              <option>Section 150(2): Written objection sustained after hearing</option>
              <option>Breach of Maharashtra Prevention of Fragmentation Act (Tukdebandi)</option>
              <option>Violation of Section 36A (Tribal Land Transfer without Collector sanction)</option>
            </select>
          </div>
          <div className="ux4g-form-group">
            <label className="ux4g-label">Formal Reason for Order Record</label>
            <textarea className="ux4g-textarea" rows={3} placeholder="Enter statutory legal grounds..." />
          </div>
        </div>
      </Modal>

      {/* Clarification Modal */}
      <Modal
        isOpen={showClarificationModal}
        onClose={() => setShowClarificationModal(false)}
        title="Return to Talathi for Clarification"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => setShowClarificationModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleExecuteOrder('CLARIFICATION')}>
              Return Case to Talathi
            </Button>
          </div>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <div className="ux4g-form-group">
            <label className="ux4g-label">Clarification Directive to Talathi</label>
            <textarea
              className="ux4g-textarea"
              rows={3}
              placeholder="e.g. Conduct joint measurement with e-Mojani surveyor to verify south boundary stone..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TehsildarDashboard;
