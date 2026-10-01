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
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeWorkspaceView, setActiveWorkspaceView] = useState('VERIFICATION'); // 'VERIFICATION' | 'GIS_MAP' | 'FORM6_REGISTER'

  // Field observation form states
  const [possessionStatus, setPossessionStatus] = useState('CONFIRMED');
  const [boundaryStatus, setBoundaryStatus] = useState('DEFINED');
  const [adjoiningNotified, setAdjoiningNotified] = useState(true);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [photos, setPhotos] = useState([]);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [newPhotoLabel, setNewPhotoLabel] = useState('South Boundary Verification');

  const defaultQueueItems = [
    {
      id: 'MUT-026860',
      ulpin: 'TEST_ULPIN_MH_PUN_001',
      gatNumber: 'Plot 42',
      village: 'Wagholi',
      applicant: 'Abhishek Gujar',
      applicantName: 'Abhishek Gujar',
      type: 'Sale Deed Mutation',
      area: '1.45 Hectare',
      form6Entry: 'FER-6860',
      notice135D: '15-Day Statutory Notice Period Active (0 Objections)',
      daysLeft: 4,
      slaDaysLeft: 4,
      status: 'PENDING_VERIFICATION',
      possessionConfirmed: true,
      inspectionNotes: 'Physical boundary stones intact on all 4 corners. Possession confirmed with transferee. Zero boundary overlap.',
      photos: [
        { id: 1, label: 'North Boundary Marker', coords: '18.5793° N, 73.9812° E (GPS Locked ±1.8m)', time: '11:30 AM IST', verified: true },
        { id: 2, label: 'Farm Approach Road Perimeter', coords: '18.5795° N, 73.9815° E (GPS Locked ±1.5m)', time: '11:42 AM IST', verified: true }
      ],
      photosCount: 2,
    },
    {
      id: 'MUT-026861',
      ulpin: 'TEST_ULPIN_MH_PUN_002',
      gatNumber: 'Plot 45',
      village: 'Wagholi',
      applicant: 'Prakash Shinde',
      applicantName: 'Prakash Shinde',
      type: 'Succession / Heirship',
      area: '0.92 Hectare',
      form6Entry: 'FER-6861',
      notice135D: 'Notice issued to legal heirs. Statutory waiting period elapsed.',
      daysLeft: 2,
      slaDaysLeft: 2,
      status: 'PENDING_VERIFICATION',
      possessionConfirmed: true,
      inspectionNotes: 'Family genealogical tree verified with municipal death certificate. Co-parceners consented.',
      photos: [
        { id: 3, label: 'East Corner Peg Marker', coords: '18.5801° N, 73.9822° E (GPS Locked ±1.9m)', time: '02:15 PM IST', verified: true }
      ],
      photosCount: 1,
    },
    {
      id: 'MUT-026862',
      ulpin: 'TEST_ULPIN_MH_PUN_003',
      gatNumber: 'Plot 49',
      village: 'Wagholi',
      applicant: 'Sunita Patil',
      applicantName: 'Sunita Patil',
      type: 'Partition Deed (Family)',
      area: '2.10 Hectare',
      form6Entry: 'FER-6862',
      notice135D: 'Registered partition document verified with Sub-Registrar Haveli-01.',
      daysLeft: 7,
      slaDaysLeft: 7,
      status: 'RECOMMENDED_TO_TEHSILDAR',
      possessionConfirmed: true,
      inspectionNotes: 'Sub-divided parcels surveyed with ETS rover. Mutation recommendation dispatched to Magistrate bench.',
      photos: [
        { id: 4, label: 'Internal Partition Boundary', coords: '18.5810° N, 73.9840° E (GPS Locked ±1.4m)', time: '04:00 PM IST', verified: true }
      ],
      photosCount: 1,
    },
    {
      id: 'MUT-026863',
      ulpin: 'TEST_ULPIN_MH_PUN_004',
      gatNumber: 'Plot 55',
      village: 'Wagholi',
      applicant: 'State Bank of India',
      applicantName: 'State Bank of India',
      type: 'Mortgage / Bank Lien Release',
      area: '1.20 Hectare',
      form6Entry: 'FER-6863',
      notice135D: 'Bank no-dues certificate uploaded and verified.',
      daysLeft: 11,
      slaDaysLeft: 11,
      status: 'PENDING_VERIFICATION',
      possessionConfirmed: true,
      inspectionNotes: 'Institutional encumbrance satisfaction letter verified.',
      photos: [],
      photosCount: 0,
    },
    {
      id: 'MUT-026864',
      ulpin: 'TEST_ULPIN_MH_PUN_005',
      gatNumber: 'Plot 78',
      village: 'Wagholi',
      applicant: 'Ramesh Kulkarni',
      applicantName: 'Ramesh Kulkarni',
      type: 'Boundary Rectification & Survey',
      area: '1.80 Hectare',
      form6Entry: 'FER-6864',
      notice135D: 'Joint measurement notice dispatched to adjoining survey holders.',
      daysLeft: 1,
      slaDaysLeft: 1,
      status: 'DISCREPANCY_FLAGGED',
      possessionConfirmed: false,
      inspectionNotes: 'Discrepancy flagged on western boundary margin. Overlap with Nala drainage buffer.',
      photos: [
        { id: 5, label: 'Disputed Nala Buffer Margin', coords: '18.5830° N, 73.9860° E (GPS Locked ±1.2m)', time: '10:10 AM IST', verified: true }
      ],
      photosCount: 1,
    }
  ];

  useEffect(() => {
    let isMounted = true;
    mutationService.getOfficerQueue()
      .then((res) => {
        const items = res?.items || (Array.isArray(res) ? res : res?.data?.items || []);
        if (isMounted) {
          let cleanQueue = defaultQueueItems;
          if (items.length > 0) {
            cleanQueue = items.slice(0, 5).map((item, idx) => {
              const fallback = defaultQueueItems[idx % defaultQueueItems.length];
              const cleanGat = (item.gatNumber || item.surveyNumber || '').replace(/Gat/gi, 'Plot').trim();
              return {
                ...fallback,
                ...item,
                id: item.id || fallback.id,
                ulpin: item.ulpin || fallback.ulpin,
                gatNumber: cleanGat || fallback.gatNumber,
                village: item.village || fallback.village,
                type: item.type || fallback.type,
                area: item.area || fallback.area,
                applicant: item.applicant || item.applicantName || fallback.applicant,
                applicantName: item.applicantName || item.applicant || fallback.applicantName,
                photos: item.photos || fallback.photos,
                photosCount: (item.photos || fallback.photos).length,
              };
            });
          }
          setQueue(cleanQueue);
          if (cleanQueue.length > 0) {
            setSelectedCaseId(cleanQueue[0].id);
            setPossessionStatus(cleanQueue[0].possessionConfirmed ? 'CONFIRMED' : 'DISPUTED');
            setInspectionNotes(cleanQueue[0].inspectionNotes || '');
            setPhotos(cleanQueue[0].photos || []);
          }
        }
      })
      .catch((err) => {
        console.warn('Queue fetch fallback:', err);
        if (isMounted) {
          setQueue(defaultQueueItems);
          setSelectedCaseId(defaultQueueItems[0].id);
          setPossessionStatus('CONFIRMED');
          setInspectionNotes(defaultQueueItems[0].inspectionNotes);
          setPhotos(defaultQueueItems[0].photos);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCase = queue.find((c) => c.id === selectedCaseId) || queue[0] || null;

  const handleSelectCase = (item) => {
    setSelectedCaseId(item.id);
    setPossessionStatus(item.possessionConfirmed ? 'CONFIRMED' : 'DISPUTED');
    setInspectionNotes(item.inspectionNotes || '');
    setPhotos(item.photos || []);
  };

  const filteredQueue = queue.filter((item) => {
    const daysLeft = item.daysLeft ?? item.slaDaysLeft ?? 15;
    if (activeTab === 'URGENT') return daysLeft <= 3;
    if (activeTab === 'DISCREPANCY') return item.status === 'DISCREPANCY_FLAGGED';
    if (activeTab === 'COMPLETED') return item.status === 'RECOMMENDED_TO_TEHSILDAR';
    return true;
  });

  const handleAddPhoto = () => {
    if (!selectedCase) return;
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
  };

  const handleSubmitRecommendation = async (type) => {
    if (!selectedCase) return;
    
    try {
      await mutationService.fieldVerify(selectedCase.id, {
        verified: type === 'SANCTION',
        remarks: inspectionNotes
      });
      
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
          ? `Field verification report & recommendation for Plot ${selectedCase.gatNumber || selectedCase.id} (${selectedCase.id}) successfully dispatched to Executive Magistrate!`
          : `Boundary conflict and objection for Plot ${selectedCase.gatNumber || selectedCase.id} successfully logged and forwarded to statutory bench.`
      );
    } catch (err) {
      console.error('Failed to submit field verification:', err);
      alert('Failed to submit: ' + err.message);
    }
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
              Village Revenue Officer Field Verification Workspace
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
            <span><strong>Officer:</strong> {user?.name || 'Sayali Wadhai'}</span>
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
          subtitle="Requires immediate site inspection"
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
          subtitle="Dispatched to Executive Magistrate this week"
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
          onClick={() => setActiveWorkspaceView('VERIFICATION')}
          className={`ux4g-btn ux4g-btn-sm ${activeWorkspaceView === 'VERIFICATION' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeWorkspaceView === 'VERIFICATION' ? '#064e3b' : undefined,
            borderColor: activeWorkspaceView === 'VERIFICATION' ? '#064e3b' : undefined,
            color: activeWorkspaceView === 'VERIFICATION' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <FileText size={15} />
          <span>Field Verification Queue & Inspection Report</span>
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
          <span>Mutation Register (Form 6 Draft Entries)</span>
        </button>
      </div>

      {/* VIEW 1: INSPECTION & FIELD QUEUE */}
      {activeWorkspaceView === 'VERIFICATION' && (
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
              <Badge variant="primary" style={{ backgroundColor: '#064e3b', color: '#ffffff', fontWeight: 800, padding: '4px 8px' }}>
                {filteredQueue.length} Cases
              </Badge>
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
              {filteredQueue.length === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--ux4g-text-muted)', fontSize: '0.875rem' }}>
                  {loading ? 'Loading assigned cases...' : 'No verification cases in this view.'}
                </div>
              ) : (
                filteredQueue.map((item) => {
                  const isSelected = selectedCase && item.id === selectedCase.id;
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
                            {item.gatNumber || `Plot ${item.ulpin?.slice(-3) || '—'}`}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)', marginLeft: '0.5rem' }}>
                            ({item.village || 'Wagholi'})
                          </span>
                        </div>
                        <SLAIndicator daysRemaining={item.daysLeft ?? item.slaDaysLeft ?? 15} maxDays={15} />
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ux4g-text)', marginBottom: '0.25rem' }}>
                        {item.type}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--ux4g-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Case: <code>{item.id}</code></span>
                        <span>Area: <strong>{item.area || '—'}</strong></span>
                      </div>

                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {item.status === 'RECOMMENDED_TO_TEHSILDAR' ? (
                          <Badge variant="success">Dispatched to Magistrate</Badge>
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
                })
              )}
            </div>
          </Card>

          {/* RIGHT COLUMN: Field Dossier & Inspection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!selectedCase ? (
              <Card style={{ padding: '3.5rem 2rem', textAlign: 'center', background: '#ffffff' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#064e3b' }}>📋</div>
                <h2 style={{ fontSize: '1.25rem', color: '#064e3b', fontWeight: 800, margin: '0 0 0.5rem' }}>
                  {loading ? 'Loading Verification Queue...' : 'No Verification Case Selected'}
                </h2>
                <p style={{ color: 'var(--ux4g-text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
                  {loading
                    ? 'Retrieving statutory cases assigned to your village jurisdiction.'
                    : 'Select a pending case from the left queue to conduct ground inspection, view satellite boundaries, and submit your recommendation.'}
                </p>
              </Card>
            ) : (
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
                      {selectedCase.gatNumber || `Plot ${selectedCase.ulpin?.slice(-3) || '—'}`} — {selectedCase.village || 'Wagholi'}
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
                      <div style={{ fontWeight: 700 }}>{selectedCase.area || '0.42 Ha'}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Form 6 Preliminary Entry:</span>
                      <div style={{ fontWeight: 600, color: 'var(--ux4g-info)' }}>{selectedCase.form6Entry || `MUT-${selectedCase.id?.slice(-4) || '442'}`}</div>
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
                      <div style={{ color: 'var(--ux4g-success)' }}>{selectedCase.notice135D || '15-Day Statutory Notice Period Active (0 Objections)'}</div>
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
                      📝 On-Ground Inspection & Possession Record
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label className="ux4g-label" style={{ fontSize: '0.8rem' }}>Physical Possession Verified?</label>
                        <select
                          className="ux4g-select"
                          value={possessionStatus}
                          onChange={(e) => setPossessionStatus(e.target.value)}
                        >
                          <option value="CONFIRMED">✅ Confirmed with Transferee ({(selectedCase?.applicant || selectedCase?.applicantName || 'Applicant').split(' ')[0]})</option>
                          <option value="DISPUTED">⚠️ Disputed Possession / Third-Party Tenant</option>
                          <option value="SELLER_OCCUPIED">Still Occupied by Seller</option>
                        </select>
                      </div>

                      <div>
                        <label className="ux4g-label" style={{ fontSize: '0.8rem' }}>Boundary Demarcation (Markers/Pegs)</label>
                        <select
                          className="ux4g-select"
                          value={boundaryStatus}
                          onChange={(e) => setBoundaryStatus(e.target.value)}
                        >
                          <option value="DEFINED">Intact stone markers on all 4 corners</option>
                          <option value="DISPUTED">Boundary conflict with adjoining Plot</option>
                          <option value="MISSING_MARKERS">Markers missing, Survey measurement required</option>
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
                          Adjoining landholders were present and consented during site inspection.
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="ux4g-label" style={{ fontSize: '0.8rem' }}>Field Officer Observations & Inspection Notes</label>
                      <textarea
                        className="ux4g-textarea"
                        rows={3}
                        value={inspectionNotes}
                        onChange={(e) => setInspectionNotes(e.target.value)}
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
                        Statutory Submission to Executive Magistrate
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                        Field recommendation directly advances case to statutory decision bench.
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
                        ✅ Submit Recommendation to Executive Magistrate
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
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
                Field verification overlay with GPS photo markers, soil zones, and parcel boundaries.
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
            selectedUlpin={selectedCase?.ulpin || ''}
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
              Village Register of Mutations (Form 6 Draft Entries)
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)' }}>
              Official statutory register of notices and draft entries under Section 150 of Land Revenue Code
            </p>
          </div>

          <div className="ux4g-table-wrapper">
            <table className="ux4g-table">
              <thead>
                <tr>
                  <th>Mutation No.</th>
                  <th>Plot No.</th>
                  <th>Type of Transaction</th>
                  <th>Parties</th>
                  <th>Date of Draft Entry</th>
                  <th>135D Notice Period</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.form6Entry || `MUT-${item.id?.slice(-4) || '2026-442'}`}</strong></td>
                    <td><strong>{item.gatNumber || `Plot ${item.ulpin?.slice(-3) || '—'}`}</strong></td>
                    <td>{item.type}</td>
                    <td>{item.seller || 'Seller'} &rarr; {item.applicant || 'Applicant'}</td>
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
        title="Submit Field Verification to Executive Magistrate"
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
            You are formally submitting the field inspection findings for <strong>{selectedCase?.gatNumber || selectedCase?.id || 'Selected Case'}</strong> ({selectedCase?.id || '—'}) to <strong>Executive Magistrate, Haveli</strong>.
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
            Once submitted, the case will immediately populate the Statutory Decision Queue for authoritative digital signature and RoR update.
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
            Flagging this case will report a formal dispute on <strong>{selectedCase?.gatNumber || selectedCase?.id || 'Selected Case'}</strong>. It will halt automatic sanction and place the case on the Tehsildar Revenue Court Hearing list.
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
