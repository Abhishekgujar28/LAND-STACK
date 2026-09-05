import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import talathiQueueData from '../../../data/mutations/talathiQueue.json';
import KPIStat from '../../../components/government/KPIStat';
import SLAIndicator from '../../../components/government/SLAIndicator';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Modal from '../../../components/ui/Modal';

export const TalathiDashboard = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState(talathiQueueData);
  const [selectedCaseId, setSelectedCaseId] = useState(talathiQueueData[0]?.id || 'MUT-PU-HVL-2026-00456');
  const [activeTab, setActiveTab] = useState('ALL');

  const selectedCase = queue.find((c) => c.id === selectedCaseId) || queue[0];

  // Field observation form states initialized from active case data
  const [possessionStatus, setPossessionStatus] = useState(selectedCase?.possessionConfirmed ? 'CONFIRMED' : 'DISPUTED');
  const [boundaryStatus, setBoundaryStatus] = useState('DEFINED');
  const [adjoiningNotified, setAdjoiningNotified] = useState(true);
  const [panchnamaNotes, setPanchnamaNotes] = useState(selectedCase?.panchnamaNotes || '');

  // Photos state for selected case loaded from data
  const [photos, setPhotos] = useState(selectedCase?.photos || []);

  // Modal dialog states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [newPhotoLabel, setNewPhotoLabel] = useState('South Boundary Verification');

  // Handle case selection change
  const handleSelectCase = (item) => {
    setSelectedCaseId(item.id);
    setPossessionStatus(item.possessionConfirmed ? 'CONFIRMED' : 'DISPUTED');
    setPanchnamaNotes(item.panchnamaNotes || '');
    setPhotos(item.photos || []);
  };

  // Filter tabs
  const filteredQueue = queue.filter((item) => {
    if (activeTab === 'URGENT') return item.daysLeft <= 3;
    if (activeTab === 'DISCREPANCY') return item.status === 'DISCREPANCY_FLAGGED';
    if (activeTab === 'COMPLETED') return item.status === 'RECOMMENDED_TO_TEHSILDAR';
    return true;
  });

  const handleAddPhoto = () => {
    const newP = {
      id: Date.now(),
      label: newPhotoLabel || 'Field Verification Photo',
      coords: '18.5529° N, 73.9312° E (GPS Locked ±2.1m)',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      verified: true,
    };
    const updatedPhotos = [...photos, newP];
    setPhotos(updatedPhotos);
    setQueue((prev) =>
      prev.map((item) => (item.id === selectedCase.id ? { ...item, photos: updatedPhotos, photosCount: updatedPhotos.length } : item))
    );
    setShowPhotoModal(false);
    setActionSuccess('Geotagged site photograph attached successfully with cryptographic location hash.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleSubmitRecommendation = (type) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === selectedCase.id
          ? {
              ...item,
              status: type === 'SANCTION' ? 'RECOMMENDED_TO_TEHSILDAR' : 'OBJECTION_RAISED',
            }
          : item
      )
    );
    setShowSubmitModal(false);
    setShowConflictModal(false);
    setActionSuccess(
      type === 'SANCTION'
        ? `Field verification panchnama & recommendation for ${selectedCase.gatNumber} (${selectedCase.id}) successfully dispatched to Tehsildar (Haveli)!`
        : `Boundary conflict and objection for ${selectedCase.gatNumber} successfully logged and forwarded to Tehsildar statutory bench.`
    );
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="page-talathi-workspace" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Officer Jurisdiction Identity Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--ux4g-primary) 0%, #082d47 100%)',
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
            <span style={{ fontSize: '1.6rem' }}>👤</span>
            <h1 style={{ color: '#ffffff', fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>
              Talathi Field Verification Workspace
            </h1>
            <span
              style={{
                background: 'var(--ux4g-accent)',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              VILLAGE REVENUE OFFICER
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Officer:</strong> {user?.name || 'Prakash Shinde'} ({user?.localName || 'प्रकाश शिंदे'})</span>
            <span><strong>Jurisdiction:</strong> Circle Wagholi & Wadgaon Sheri (Gat/Survey 1 to 240)</span>
            <span><strong>Tehsil:</strong> Haveli | <strong>District:</strong> Pune (MH)</span>
          </div>
        </div>

        {/* GPS Live Geofence Pill */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--ux4g-radius-md)',
            textAlign: 'right',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
            <strong style={{ color: '#ffffff' }}>GPS Active & Field Bound</strong>
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>
            Wadgaon Sheri 18.5529° N, 73.9312° E (±2.4m)
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <Alert variant="success" style={{ marginBottom: '1.5rem' }}>
          <strong>Action Complete:</strong> {actionSuccess}
        </Alert>
      )}

      {/* 4 Official KPIs from docs/02-personas.md */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <KPIStat
          title="Pending Field Verifications"
          value={queue.length}
          subtitle="Assigned across 2 village circles"
          icon="📋"
          status="warning"
        />
        <KPIStat
          title="Approaching SLA (<3 Days)"
          value={queue.filter((q) => q.daysLeft <= 3).length}
          subtitle="Requires immediate site panchnama"
          icon="⏱️"
          status="danger"
        />
        <KPIStat
          title="Active Discrepancies"
          value={queue.filter((q) => q.status === 'DISCREPANCY_FLAGGED').length}
          subtitle="RoR vs GIS area variances"
          icon="⚠️"
          status="warning"
        />
        <KPIStat
          title="Verifications Completed"
          value="28"
          subtitle="Dispatched to Tehsildar this week"
          icon="✅"
          status="success"
        />
      </div>

      {/* Main Two-Column Layout: Queue on Left, Selected Case Field Dossier on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: Pending Field Work Queue */}
        <Card>
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--ux4g-border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary)' }}>
                📋 My Pending Field Queue
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--ux4g-text-secondary)' }}>
                Task-first field inspection list prioritized by statutory SLA
              </div>
            </div>
            <Badge variant="primary">{filteredQueue.length} Cases</Badge>
          </div>

          {/* Queue Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderBottom: '1px solid var(--ux4g-border-subtle)',
              overflowX: 'auto',
            }}
          >
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'ALL' ? 'ux4g-btn-primary' : 'ux4g-btn-ghost'}`}
              onClick={() => setActiveTab('ALL')}
            >
              All ({queue.length})
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'URGENT' ? 'ux4g-btn-danger' : 'ux4g-btn-ghost'}`}
              onClick={() => setActiveTab('URGENT')}
            >
              🔴 Urgent SLA ({queue.filter((q) => q.daysLeft <= 3).length})
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'DISCREPANCY' ? 'ux4g-btn-warning' : 'ux4g-btn-ghost'}`}
              onClick={() => setActiveTab('DISCREPANCY')}
            >
              🟡 Discrepancies ({queue.filter((q) => q.status === 'DISCREPANCY_FLAGGED').length})
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'COMPLETED' ? 'ux4g-btn-success' : 'ux4g-btn-ghost'}`}
              onClick={() => setActiveTab('COMPLETED')}
            >
              Completed
            </button>
          </div>

          {/* Queue Item Cards */}
          <div style={{ maxHeight: '680px', overflowY: 'auto', padding: '0.75rem' }}>
            {filteredQueue.map((item) => {
              const isSelected = item.id === selectedCase.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectCase(item)}
                  style={{
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    borderRadius: 'var(--ux4g-radius-md)',
                    border: isSelected ? '2px solid var(--ux4g-primary)' : '1px solid var(--ux4g-border-subtle)',
                    background: isSelected ? 'var(--ux4g-primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all var(--ux4g-transition-fast)',
                    boxShadow: isSelected ? 'var(--ux4g-shadow-sm)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--ux4g-primary)' }}>
                        {item.gatNumber}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)', marginLeft: '0.5rem' }}>
                        ({item.village})
                      </span>
                    </div>
                    <SLAIndicator daysRemaining={item.daysLeft} maxDays={15} />
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ux4g-text)', marginBottom: '0.25rem' }}>
                    {item.type}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--ux4g-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Case: <code>{item.id}</code></span>
                    <span>Area: <strong>{item.area}</strong></span>
                  </div>

                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {item.status === 'RECOMMENDED_TO_TEHSILDAR' ? (
                      <Badge variant="success">Dispatched to Tehsildar</Badge>
                    ) : item.status === 'DISCREPANCY_FLAGGED' ? (
                      <Badge variant="warning">Area Mismatch</Badge>
                    ) : (
                      <Badge variant="neutral">Pending Verification</Badge>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                      📷 {item.photosCount || item.photos?.length || 0} photos
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* RIGHT COLUMN: Interactive Field Dossier & Verification Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            {/* Dossier Header */}
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
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
                  Active Verification Dossier
                </div>
                <h2 style={{ fontSize: '1.25rem', margin: '0.2rem 0 0', color: 'var(--ux4g-primary)' }}>
                  {selectedCase.gatNumber} — {selectedCase.village}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Case Number</span>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ux4g-text)' }}>
                  {selectedCase.id}
                </div>
              </div>
            </div>

            <div style={{ padding: '1.25rem' }}>
              {/* Parcel Key Information Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'var(--ux4g-surface-muted)',
                  borderRadius: 'var(--ux4g-radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Bhu-Aadhaar (ULPIN):</span>
                  <div style={{ fontWeight: 700, color: 'var(--ux4g-primary)', fontFamily: 'var(--ux4g-font-mono)' }}>
                    {selectedCase.ulpin}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Transaction / Mutation:</span>
                  <div style={{ fontWeight: 600 }}>{selectedCase.type}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Registered Area:</span>
                  <div style={{ fontWeight: 700 }}>{selectedCase.area}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Form 6 Pencil Entry:</span>
                  <div style={{ fontWeight: 600, color: 'var(--ux4g-info)' }}>{selectedCase.form6Entry}</div>
                </div>
              </div>

              {/* Parties Information */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--ux4g-border-subtle)',
                  borderRadius: 'var(--ux4g-radius-md)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Current 7/12 RoR Holder:</span>
                  <div style={{ fontWeight: 700 }}>{selectedCase.seller}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Transferee / Applicant:</span>
                  <div style={{ fontWeight: 700, color: 'var(--ux4g-primary)' }}>{selectedCase.applicant}</div>
                </div>
              </div>

              {/* Statutory Notice 135D Status Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 'var(--ux4g-radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>📜</span>
                <div>
                  <strong>Maharashtra Land Revenue Code Section 135-D Notice:</strong>
                  <div style={{ color: 'var(--ux4g-success)' }}>{selectedCase.notice135D}</div>
                </div>
              </div>

              {/* AI Spatial Anomaly Alert */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--ux4g-radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🤖</span>
                <div style={{ flex: 1 }}>
                  <strong>Bhu-Naksha Cadastral GIS Cross-Check:</strong>
                  <div style={{ color: 'var(--ux4g-warning)' }}>
                    RoR area vs digitized cadastral polygon variance: <strong>{selectedCase.aiAreaVariance}</strong>.
                  </div>
                </div>
              </div>

              {/* SECTION: Geotagged Site Photo Module */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--ux4g-primary)' }}>
                    📷 Geotagged Field Photographs ({photos.length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPhotoModal(true)}
                  >
                    + Capture / Upload Site Photo
                  </Button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {photos.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        border: '1px solid var(--ux4g-border)',
                        borderRadius: 'var(--ux4g-radius-md)',
                        overflow: 'hidden',
                        background: '#ffffff',
                        boxShadow: 'var(--ux4g-shadow-sm)',
                      }}
                    >
                      <div
                        style={{
                          height: '100px',
                          background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          position: 'relative',
                        }}
                      >
                        <span style={{ fontSize: '2rem', opacity: 0.7 }}>📸</span>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '6px',
                            background: 'rgba(0,0,0,0.6)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                          }}
                        >
                          GPS Verified
                        </div>
                      </div>
                      <div style={{ padding: '0.6rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--ux4g-text)' }}>
                          {p.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--ux4g-text-muted)' }}>
                          📍 {p.coords}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--ux4g-text-secondary)' }}>
                          🕒 {p.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: Physical Possession & Ground Panchnama Checklist */}
              <div
                style={{
                  background: '#fafbfc',
                  border: '1px solid var(--ux4g-border-subtle)',
                  borderRadius: 'var(--ux4g-radius-md)',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem', color: 'var(--ux4g-primary)' }}>
                  📝 On-Ground Panchnama & Possession Record
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="ux4g-label" style={{ fontSize: '0.8rem' }}>Physical Possession Verified?</label>
                    <select
                      className="ux4g-select"
                      value={possessionStatus}
                      onChange={(e) => setPossessionStatus(e.target.value)}
                    >
                      <option value="CONFIRMED">✅ Confirmed with Transferee ({selectedCase.applicant.split(' ')[0]})</option>
                      <option value="DISPUTED">⚠️ Disputed Possession / Third-Party Tenant</option>
                      <option value="SELLER_OCCUPIED">Still Occupied by Seller</option>
                    </select>
                  </div>

                  <div>
                    <label className="ux4g-label" style={{ fontSize: '0.8rem' }}>Boundary Demarcation (Shew/Stones)</label>
                    <select
                      className="ux4g-select"
                      value={boundaryStatus}
                      onChange={(e) => setBoundaryStatus(e.target.value)}
                    >
                      <option value="DEFINED">Intact stone markers on all 4 corners</option>
                      <option value="DISPUTED">Boundary conflict with adjoining Gat</option>
                      <option value="MISSING_MARKERS">Markers missing, Mojani required</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="ux4g-checkbox-label">
                    <input
                      type="checkbox"
                      className="ux4g-checkbox"
                      checked={adjoiningNotified}
                      onChange={(e) => setAdjoiningNotified(e.target.checked)}
                    />
                    <span style={{ fontSize: '0.85rem' }}>
                      Adjoining landholders were present and consented during site panchnama.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.8rem' }}>Talathi Field Observations & Panchnama Notes</label>
                  <textarea
                    className="ux4g-textarea"
                    rows={3}
                    value={panchnamaNotes}
                    onChange={(e) => setPanchnamaNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* STATUTORY ACTIONS BAR (Talathi structured recommendations) */}
              <div
                style={{
                  background: 'var(--ux4g-surface-muted)',
                  border: '1px solid var(--ux4g-border-subtle)',
                  borderRadius: 'var(--ux4g-radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ux4g-text)' }}>
                    Statutory Submission to Tehsildar
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                    * Talathi recommendation directly advances the case to Tehsildar statutory determination bench.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowConflictModal(true)}
                  >
                    ⚠️ Report Boundary Conflict
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setShowSubmitModal(true)}
                  >
                    ✅ Submit Recommendation to Tehsildar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Submit Structured Recommendation to Tehsildar */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Field Verification to Tehsildar"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSubmitRecommendation('SANCTION')}
            >
              Confirm & Dispatch Recommendation
            </Button>
          </div>
        }
      >
        <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
          <p>
            You are formally submitting the field panchnama findings for <strong>{selectedCase.gatNumber}</strong> ({selectedCase.id}) to <strong>Shri. Sanjay Deshmukh, Tehsildar Haveli</strong>.
          </p>

          <div
            style={{
              background: 'var(--ux4g-surface-muted)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--ux4g-radius-md)',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <div>• <strong>Physical Possession:</strong> {possessionStatus}</div>
            <div>• <strong>Boundary Demarcation:</strong> {boundaryStatus}</div>
            <div>• <strong>Geotagged Photographs:</strong> {photos.length} GPS Stamped Images</div>
            <div>• <strong>Recommendation:</strong> RECOMMEND_SANCTION (Sanction Mutation Form 6)</div>
          </div>

          <Alert variant="info">
            Once submitted, the case will immediately populate the Tehsildar Statutory Decision Queue for authoritative digital signature and e-Ferfar RoR update.
          </Alert>
        </div>
      </Modal>

      {/* Modal: Report Boundary Conflict */}
      <Modal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        title="Report Boundary Conflict / Raise Objection"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => setShowConflictModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleSubmitRecommendation('OBJECTION')}
            >
              Submit Dispute Objection
            </Button>
          </div>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <p>
            Flagging this case will report a formal dispute on <strong>{selectedCase.gatNumber}</strong>. It will halt automatic sanction and place the case on the Tehsildar Revenue Court Hearing list.
          </p>
          <div className="ux4g-form-group">
            <label className="ux4g-label ux4g-label-required">Grounds for Conflict</label>
            <select className="ux4g-select">
              <option>Adjoining plot owner filed written boundary dispute</option>
              <option>Physical area significantly less than registered deed</option>
              <option>Encumbrance / tenant occupancy conflict detected</option>
            </select>
          </div>
          <div className="ux4g-form-group">
            <label className="ux4g-label">Specific Findings</label>
            <textarea
              className="ux4g-textarea"
              rows={3}
              placeholder="Describe on-site dispute, witness statements, or conflicting possession..."
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Capture / Upload Field Photo */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        title="Capture Field Inspection Photo"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => setShowPhotoModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddPhoto}>
              Upload & Verify GPS Stamp
            </Button>
          </div>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <div className="ux4g-form-group">
            <label className="ux4g-label">Photo Description / Angle</label>
            <input
              type="text"
              className="ux4g-input"
              value={newPhotoLabel}
              onChange={(e) => setNewPhotoLabel(e.target.value)}
              placeholder="e.g., South-West corner stone, crop status..."
            />
          </div>

          <div
            style={{
              padding: '1.5rem',
              border: '2px dashed var(--ux4g-border)',
              borderRadius: 'var(--ux4g-radius-md)',
              textAlign: 'center',
              background: '#f8fafc',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
            <div style={{ fontWeight: 600, color: 'var(--ux4g-primary)' }}>
              Take Photo with Field Tablet Camera or Select File
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', marginTop: '0.25rem' }}>
              GPS latitude/longitude and IST timestamp will be embedded automatically.
            </div>
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--ux4g-text-secondary)',
              background: 'var(--ux4g-surface-muted)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--ux4g-radius-sm)',
            }}
          >
            📍 <strong>Device Location:</strong> 18.5529° N, 73.9312° E | Altitude: 560m | Accuracy: ±2.1m
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TalathiDashboard;
