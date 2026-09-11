import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import mutationService from '../../../services/mutationService';
import KPIStat from '../../../components/government/KPIStat';
import SLAIndicator from '../../../components/government/SLAIndicator';
import AuthorityGisMap from '../../../components/government/AuthorityGisMap';
import { ROLES } from '../../../config/roles';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Modal from '../../../components/ui/Modal';
import { talathiQueueData } from '../../../data/mockDataFallbacks';
import {
  UserCheck,
  Camera,
  MapPin,
  Layers,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
} from 'lucide-react';

export const TalathiDashboard = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState(talathiQueueData);
  const [selectedCaseId, setSelectedCaseId] = useState(talathiQueueData[0]?.id || 'MUT-PU-HVL-2026-00456');
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeWorkspaceView, setActiveWorkspaceView] = useState('PANCHNAMA'); // 'PANCHNAMA' | 'GIS_MAP' | 'FORM6_REGISTER'

  useEffect(() => {
    let isMounted = true;
    mutationService.getTalathiQueue().then((res) => {
      const data = res?.data || res;
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setQueue(data);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const selectedCase = queue.find((c) => c.id === selectedCaseId) || queue[0];

  // Field observation form states
  const [possessionStatus, setPossessionStatus] = useState(selectedCase?.possessionConfirmed ? 'CONFIRMED' : 'DISPUTED');
  const [boundaryStatus, setBoundaryStatus] = useState('DEFINED');
  const [adjoiningNotified, setAdjoiningNotified] = useState(true);
  const [panchnamaNotes, setPanchnamaNotes] = useState(selectedCase?.panchnamaNotes || '');
  const [photos, setPhotos] = useState(selectedCase?.photos || []);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [newPhotoLabel, setNewPhotoLabel] = useState('South Boundary Verification');

  const handleSelectCase = (item) => {
    setSelectedCaseId(item.id);
    setPossessionStatus(item.possessionConfirmed ? 'CONFIRMED' : 'DISPUTED');
    setPanchnamaNotes(item.panchnamaNotes || '');
    setPhotos(item.photos || []);
  };

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
      coords: '18.5793° N, 73.9812° E (GPS Locked ±1.8m)',
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
    <div className="page-talathi-workspace" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Officer Jurisdiction Identity Header */}
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
              <UserCheck size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              Talathi Field Verification Workspace
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
              VILLAGE REVENUE OFFICER
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Officer:</strong> {user?.name || 'Prakash Shinde'} ({user?.localName || 'प्रकाश शिंदे'})</span>
            <span><strong>Jurisdiction:</strong> Circle Wagholi & Wadgaon Sheri (Gat 1 to 240)</span>
            <span><strong>Tehsil:</strong> Haveli | <strong>District:</strong> Pune (MH)</span>
          </div>
        </div>

        {/* GPS Live Geofence Pill */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            textAlign: 'right',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <strong style={{ color: '#ffffff' }}>GPS Active & Field Bound</strong>
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            Wagholi 18.5793° N, 73.9812° E (±1.8m)
          </div>
        </div>
      </div>

      {actionSuccess && (
        <Alert variant="success">
          <strong>Action Complete:</strong> {actionSuccess}
        </Alert>
      )}

      {/* 4 Official KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <KPIStat
          title="Pending Field Verifications"
          value={queue.length}
          subtitle="Assigned across Wagholi Circle"
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
          onClick={() => setActiveWorkspaceView('PANCHNAMA')}
          className={`ux4g-btn ux4g-btn-sm ${activeWorkspaceView === 'PANCHNAMA' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeWorkspaceView === 'PANCHNAMA' ? '#064e3b' : undefined,
            borderColor: activeWorkspaceView === 'PANCHNAMA' ? '#064e3b' : undefined,
            color: activeWorkspaceView === 'PANCHNAMA' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <FileText size={15} />
          <span>Field Verification Queue & Panchnama</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveWorkspaceView('GIS_MAP')}
          className={`ux4g-btn ux4g-btn-sm ${activeWorkspaceView === 'GIS_MAP' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeWorkspaceView === 'GIS_MAP' ? '#064e3b' : undefined,
            borderColor: activeWorkspaceView === 'GIS_MAP' ? '#064e3b' : undefined,
            color: activeWorkspaceView === 'GIS_MAP' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Layers size={15} />
          <span>Wagholi Village Cadastral GIS Map</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveWorkspaceView('FORM6_REGISTER')}
          className={`ux4g-btn ux4g-btn-sm ${activeWorkspaceView === 'FORM6_REGISTER' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeWorkspaceView === 'FORM6_REGISTER' ? '#064e3b' : undefined,
            borderColor: activeWorkspaceView === 'FORM6_REGISTER' ? '#064e3b' : undefined,
            color: activeWorkspaceView === 'FORM6_REGISTER' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <FileText size={15} />
          <span>e-Ferfar Form 6 Register (Pencil Entries)</span>
        </button>
      </div>

      {/* VIEW 1: PANCHNAMA & FIELD QUEUE */}
      {activeWorkspaceView === 'PANCHNAMA' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 400px) 1fr',
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
                <h2 style={{ fontSize: '1.05rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
                  📋 Pending Field Queue
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--ux4g-text-secondary)' }}>
                  Prioritized by statutory SLA
                </div>
              </div>
              <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>{filteredQueue.length} Cases</Badge>
            </div>

            {/* Queue Filter Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--ux4g-border-subtle)',
                overflowX: 'auto',
              }}
            >
              <button
                className={`ux4g-btn ux4g-btn-sm ${activeTab === 'ALL' ? 'ux4g-btn-primary' : 'ux4g-btn-ghost'}`}
                onClick={() => setActiveTab('ALL')}
                style={{ backgroundColor: activeTab === 'ALL' ? '#064e3b' : undefined }}
              >
                All ({queue.length})
              </button>
              <button
                className={`ux4g-btn ux4g-btn-sm ${activeTab === 'URGENT' ? 'ux4g-btn-danger' : 'ux4g-btn-ghost'}`}
                onClick={() => setActiveTab('URGENT')}
              >
                Urgent ({queue.filter((q) => q.daysLeft <= 3).length})
              </button>
              <button
                className={`ux4g-btn ux4g-btn-sm ${activeTab === 'DISCREPANCY' ? 'ux4g-btn-warning' : 'ux4g-btn-ghost'}`}
                onClick={() => setActiveTab('DISCREPANCY')}
              >
                Discrepancies
              </button>
            </div>

            {/* Queue Items */}
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
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #064e3b' : '1px solid var(--ux4g-border-subtle)',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#064e3b' }}>
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

          {/* RIGHT COLUMN: Field Dossier & Panchnama */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Card>
              {/* Header */}
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
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--ux4g-text-muted)' }}>
                    Active Verification Dossier
                  </div>
                  <h2 style={{ fontSize: '1.25rem', margin: '0.2rem 0 0', color: '#064e3b', fontWeight: 800 }}>
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
                {/* Parcel Info */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: 'var(--ux4g-surface-muted)',
                    borderRadius: '10px',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Bhu-Aadhaar (ULPIN):</span>
                    <div style={{ fontWeight: 700, color: '#064e3b', fontFamily: 'monospace' }}>
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

                {/* Section 135D Status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
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

                {/* Geotagged Site Photo Module */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
                      📷 Geotagged Field Photographs ({photos.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPhotoModal(true)}
                      style={{ borderColor: '#064e3b', color: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Camera size={14} />
                      <span>+ Capture / Upload Site Photo</span>
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
                          borderRadius: '10px',
                          overflow: 'hidden',
                          background: '#ffffff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                      >
                        <div
                          style={{
                            height: '90px',
                            background: 'linear-gradient(135deg, #064e3b 0%, #033628 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            position: 'relative',
                          }}
                        >
                          <Camera size={32} opacity={0.6} />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '4px',
                              right: '6px',
                              background: 'rgba(0,0,0,0.65)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              color: '#22c55e',
                            }}
                          >
                            GPS Verified
                          </div>
                        </div>
                        <div style={{ padding: '0.6rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--ux4g-text)' }}>
                            {p.label}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--ux4g-text-muted)' }}>
                            📍 {p.coords}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ground Panchnama Checklist */}
                <div
                  style={{
                    background: '#fafbfc',
                    border: '1px solid var(--ux4g-border-subtle)',
                    borderRadius: '10px',
                    padding: '1.15rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem', color: '#064e3b', fontWeight: 800 }}>
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
                        <option value="CONFIRMED">✅ Confirmed with Transferee ({(selectedCase?.applicant || selectedCase?.applicantName || selectedCase?.buyerName || 'Applicant').split(' ')[0]})</option>
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

                {/* STATUTORY ACTIONS BAR */}
                <div
                  style={{
                    background: 'var(--ux4g-surface-muted)',
                    border: '1px solid var(--ux4g-border-subtle)',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#064e3b' }}>
                      Statutory Submission to Tehsildar
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                      Talathi recommendation directly advances case to Tehsildar statutory bench.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowConflictModal(true)}
                    >
                      ⚠️ Report Conflict
                    </Button>

                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setShowSubmitModal(true)}
                      style={{ backgroundColor: '#064e3b', borderColor: '#064e3b' }}
                    >
                      ✅ Submit Recommendation to Tehsildar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 2: WAGHOLI VILLAGE CADASTRE */}
      {activeWorkspaceView === 'GIS_MAP' && (
        <Card style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
                Wagholi Village Cadastral GIS & Survey Grid
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Field verification overlay with GPS photo markers, soil zones, and Gat parcel boundaries.
              </p>
            </div>
            <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>
              Circle 04 &bull; Wagholi
            </Badge>
          </div>

          <AuthorityGisMap
            authorityRole={ROLES.TALATHI}
            activeJurisdiction="Wagholi Village Cadastre"
            height="620px"
            selectedUlpin={selectedCase.ulpin}
            onSelectParcel={(plot) => {
              const matched = queue.find((q) => q.ulpin === plot.ulpin);
              if (matched) {
                setSelectedCaseId(matched.id);
              }
            }}
          />
        </Card>
      )}

      {/* VIEW 3: FORM 6 REGISTER */}
      {activeWorkspaceView === 'FORM6_REGISTER' && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
              e-Ferfar Village Register of Mutations (Form 6 Pencil Entries)
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)' }}>
              Official statutory register of notices and pencil entries under Section 150 of Maharashtra Land Revenue Code
            </p>
          </div>

          <div className="ux4g-table-wrapper">
            <table className="ux4g-table">
              <thead>
                <tr>
                  <th>Ferfar No.</th>
                  <th>Gat No.</th>
                  <th>Type of Transaction</th>
                  <th>Parties</th>
                  <th>Date of Pencil Entry</th>
                  <th>135D Notice Period</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.form6Entry || 'FER-2026-442'}</strong></td>
                    <td><strong>{item.gatNumber}</strong></td>
                    <td>{item.type}</td>
                    <td>{item.seller} &rarr; {item.applicant}</td>
                    <td>01-Sep-2026</td>
                    <td>{item.notice135D ? '15-Day Notice Served' : 'Notice In Progress'}</td>
                    <td>
                      <Badge variant={item.status === 'RECOMMENDED_TO_TEHSILDAR' ? 'success' : item.status === 'DISCREPANCY_FLAGGED' ? 'warning' : 'info'}>
                        {item.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal: Submit Structured Recommendation */}
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
              style={{ backgroundColor: '#064e3b' }}
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
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <div>&bull; <strong>Physical Possession:</strong> {possessionStatus}</div>
            <div>&bull; <strong>Boundary Demarcation:</strong> {boundaryStatus}</div>
            <div>&bull; <strong>Geotagged Photographs:</strong> {photos.length} GPS Stamped Images</div>
            <div>&bull; <strong>Recommendation:</strong> RECOMMEND_SANCTION (Sanction Mutation Form 6)</div>
          </div>

          <Alert variant="info">
            Once submitted, the case will immediately populate the Tehsildar Statutory Decision Queue for authoritative digital signature and e-Ferfar RoR update.
          </Alert>
        </div>
      </Modal>

      {/* Modal: Report Conflict */}
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
            <Button variant="primary" onClick={handleAddPhoto} style={{ backgroundColor: '#064e3b' }}>
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
              borderRadius: '8px',
              textAlign: 'center',
              background: '#f8fafc',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
            <div style={{ fontWeight: 700, color: '#064e3b' }}>
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
              borderRadius: '6px',
            }}
          >
            📍 <strong>Device Location:</strong> 18.5793° N, 73.9812° E | Altitude: 560m | Accuracy: ±1.8m
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TalathiDashboard;
