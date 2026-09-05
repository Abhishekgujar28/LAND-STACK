import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import KPIStat from '../../../components/government/KPIStat';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Modal from '../../../components/ui/Modal';

const STATUTORY_QUEUE = [
  {
    id: 'MUT-PU-HVL-2026-00456',
    gatNumber: 'Gat 45/2A',
    ulpin: 'IN-MH-PUN-0001-12345',
    village: 'Wadgaon Sheri',
    type: 'Sale Deed (Kharedi Khat)',
    applicant: 'Rohan Kadam',
    seller: 'Aarav Patil',
    area: '0.4200 Ha',
    talathiName: 'Prakash Shinde',
    talathiReport: 'Possession confirmed on site. Boundary stones intact. Recommends sanction.',
    photosCount: 3,
    deedNumber: 'PUN-2026-0456',
    noticePeriodStatus: 'Elapsed (0 objections received)',
    aiFlag: '4.8% area variance between RoR and GIS polygon (Within 5% tolerance)',
    status: 'READY_FOR_ORDER',
    daysPending: 18,
  },
  {
    id: 'MUT-PU-HVL-2026-00459',
    gatNumber: 'Gat 78/1',
    ulpin: 'IN-MH-PUN-0001-12348',
    village: 'Wagholi',
    type: 'Partition / Vatasni',
    applicant: 'Deshmukh Brothers',
    seller: 'Late Govind Deshmukh',
    area: '1.2500 Ha',
    talathiName: 'Prakash Shinde',
    talathiReport: 'All 3 co-sharers signed panchnama. Boundaries marked.',
    photosCount: 2,
    deedNumber: 'PART-2026-0089',
    noticePeriodStatus: 'Notice active (24 days elapsed)',
    aiFlag: 'Clean title. No anomalies detected.',
    status: 'READY_FOR_ORDER',
    daysPending: 12,
  },
  {
    id: 'RTS-APPEAL-2026-003',
    gatNumber: 'Gat 112/4',
    ulpin: 'IN-MH-PUN-0001-12377',
    village: 'Khadakwasla',
    type: 'Disputed Heirship Appeal (RTS Sec 247)',
    applicant: 'Sunil Jagtap',
    seller: 'Respondent: Vijay Jagtap',
    area: '2.1000 Ha',
    talathiName: 'M. V. Pawar',
    talathiReport: 'Conflicting succession genealogy certificate submitted.',
    photosCount: 1,
    deedNumber: 'COURT-APPEAL-88',
    noticePeriodStatus: 'Objection sustained by brother',
    aiFlag: 'High Litigation Risk: Cross-referenced with E-Courts Pune Dist Court Suit 102/2025',
    status: 'HEARING_SCHEDULED',
    daysPending: 34,
  },
];

export const TehsildarDashboard = () => {
  const { user } = useAuth();
  const [selectedCaseId, setSelectedCaseId] = useState('MUT-PU-HVL-2026-00456');
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const selectedCase = STATUTORY_QUEUE.find((c) => c.id === selectedCaseId) || STATUTORY_QUEUE[0];

  const handleExecuteOrder = (decision) => {
    setShowSanctionModal(false);
    setShowRejectModal(false);
    setShowClarificationModal(false);

    if (decision === 'SANCTION') {
      setActionNotice(
        `Statutory Sanction Order passed for ${selectedCase.gatNumber} (${selectedCase.id}). Digitally signed with Tehsildar DSC token. RoR 7/12 mutation entry #1428 certified!`
      );
    } else if (decision === 'REJECT') {
      setActionNotice(
        `Statutory Rejection Order passed for ${selectedCase.gatNumber}. Reason recorded under Section 149/150 MLR Code. Dispatched to parties.`
      );
    } else {
      setActionNotice(
        `Case ${selectedCase.id} returned to Talathi (${selectedCase.talathiName}) for clarification on boundary area.`
      );
    }
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="page-tehsildar-workspace">
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
          value="18"
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
          value="2"
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
            <Badge variant="primary">{STATUTORY_QUEUE.length} Ready</Badge>
          </div>

          <div style={{ padding: '0.75rem' }}>
            {STATUTORY_QUEUE.map((item) => {
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
