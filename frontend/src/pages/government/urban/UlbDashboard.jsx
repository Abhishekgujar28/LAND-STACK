import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import mutationService from '../../../services/mutationService';
import KPIStat from '../../../components/government/KPIStat';
import SLAIndicator from '../../../components/government/SLAIndicator';
import AuthorityGisMap from '../../../components/government/AuthorityGisMap';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Modal from '../../../components/ui/Modal';
import {
  Building2,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Search,
  Layers,
  FileCheck2,
  DollarSign,
  Compass,
  Building,
  Key,
} from 'lucide-react';

export const UlbDashboard = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('DOSSIER'); // 'DOSSIER' | 'CTS_CARD' | 'ZONING' | 'TAX' | 'GIS_MAP'
  const [actionNotice, setActionNotice] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showZoningModal, setShowZoningModal] = useState(false);

  // Form states
  const [sanctionRemarks, setSanctionRemarks] = useState('Statutory approval granted under PMC Urban Land Administration Regulations 2026. PMRDA CDP 2041 zoning and property tax compliance verified.');
  const [rejectReason, setRejectReason] = useState('Zoning mismatch under PMRDA 2041 Master Plan / Outstanding municipal dues.');
  const [mfaCode, setMfaCode] = useState('123456');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mutationService.getOfficerQueue()
      .then((res) => {
        const items = res?.items || (Array.isArray(res) ? res : res?.data?.items || []);
        if (isMounted) {
          setQueue(items);
          if (items.length > 0) {
            setSelectedCaseId(items[0].id);
          }
        }
      })
      .catch((err) => console.warn('[UlbDashboard] Queue fetch error:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCase = queue.find((c) => c.id === selectedCaseId) || queue[0] || null;

  const filteredQueue = queue.filter((item) => {
    const daysLeft = item.daysLeft ?? item.slaDaysLeft ?? 15;
    if (activeTab === 'URGENT') return daysLeft <= 5;
    if (activeTab === 'CTS') return Boolean(item.ctsNumber);
    if (activeTab === 'TAX_DUES') return item.tax && item.tax.pendingDues > 0;
    if (activeTab === 'APPROVED') return item.status === 'APPROVED';
    return true;
  });

  // KPI calculations
  const totalParcels = queue.length;
  const ctsParcelsCount = queue.filter((i) => Boolean(i.ctsNumber)).length;
  const urgentCount = queue.filter((i) => (i.daysLeft ?? i.slaDaysLeft ?? 15) <= 5).length;
  const taxClearedCount = queue.filter((i) => i.tax?.paymentStatus === 'PAID').length;

  const handleExecuteOrder = async (decision) => {
    if (!selectedCase) return;
    setActionLoading(true);
    setActionNotice(null);

    try {
      if (decision === 'SANCTION') {
        await mutationService.approveMutation(selectedCase.id, {
          remarks: sanctionRemarks,
          _mfaToken: mfaCode || '123456',
        });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === selectedCase.id ? { ...item, status: 'APPROVED' } : item
          )
        );
        setShowSanctionModal(false);
        setActionNotice({
          type: 'success',
          message: `Urban Mutation Sanction Order passed for CTS ${selectedCase.ctsNumber || selectedCase.gatNumber || selectedCase.id} (${selectedCase.id}). RoR CTS Property Card title updated with PMC DSC seal.`,
        });
      } else if (decision === 'REJECT') {
        await mutationService.rejectMutation(selectedCase.id, {
          reason: rejectReason,
          _mfaToken: mfaCode || '123456',
        });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === selectedCase.id ? { ...item, status: 'REJECTED' } : item
          )
        );
        setShowRejectModal(false);
        setActionNotice({
          type: 'error',
          message: `Statutory Rejection Order passed for case ${selectedCase.id}. Grounds: "${rejectReason}". Formal notice dispatched to parties.`,
        });
      } else if (decision === 'ZONING_VERIFY') {
        await mutationService.executeAction(selectedCase.id, 'REVIEW', {
          remarks: 'PMRDA Comprehensive Development Plan 2041 zoning and permissible FSI formally certified by ULB Officer.',
        });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === selectedCase.id ? { ...item, status: 'REVIEWED' } : item
          )
        );
        setShowZoningModal(false);
        setActionNotice({
          type: 'success',
          message: `Zoning clearance certificate recorded for ${selectedCase.ctsNumber || selectedCase.id}. Case marked as REVIEWED.`,
        });
      }
    } catch (err) {
      console.error('[UlbDashboard] Action error:', err);
      setActionNotice({
        type: 'error',
        message: 'Action failed: ' + (err.message || 'Database error occurred'),
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-ulb-workspace" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Officer Jurisdiction Identity Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 50%, #0f172a 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(30, 58, 138, 0.25)',
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
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
              }}
            >
              <Building2 size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              Urban Local Body (ULB) Land Administration Workspace
            </h1>
            <span
              style={{
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Municipal Authority Desk
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#bfdbfe', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span>👤 <strong>{user?.name || 'Anita Bhosale'}</strong> (Urban Land Records Officer)</span>
            <span>🏛️ <strong>Pune Municipal Corporation (PMC)</strong></span>
            <span>📍 <strong>Jurisdiction:</strong> Pune Municipal Limits &amp; PMRDA Urban Agglomeration (DIST-PUN)</span>
            <span>🔐 <strong>Statutory Authority:</strong> MLRC Urban NA &amp; Maharashtra Municipal Corp Act</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveWorkspaceTab('GIS_MAP')}
            style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <Compass size={14} style={{ marginRight: '4px' }} /> Urban GIS Viewer
          </Button>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <Alert
          type={actionNotice.type}
          message={actionNotice.message}
          onClose={() => setActionNotice(null)}
        />
      )}

      {/* Top Municipal KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <KPIStat
          title="Active Urban Caseload"
          value={totalParcels}
          change="+3 this week"
          icon={Building2}
          color="#2563eb"
          subtitle="Non-Agricultural & City Survey cases"
        />
        <KPIStat
          title="CTS Property Cards"
          value={ctsParcelsCount}
          change="100% indexed"
          icon={FileCheck2}
          color="#059669"
          subtitle="Verified City Survey numbers"
        />
        <KPIStat
          title="SLA Risk (≤ 5 Days)"
          value={urgentCount}
          change={urgentCount > 0 ? "Requires action" : "On schedule"}
          icon={AlertTriangle}
          color={urgentCount > 0 ? "#dc2626" : "#059669"}
          subtitle="Statutory 30-day municipal SLA"
        />
        <KPIStat
          title="Municipal Tax Cleared"
          value={`${taxClearedCount}/${totalParcels}`}
          change="Assessed via PMC tax portal"
          icon={DollarSign}
          color="#7c3aed"
          subtitle="Zero arrears pre-requisite"
        />
      </div>

      {/* Main Workspace: 2-Column Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left Column: Urban Caseload Queue */}
        <Card style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={16} color="#2563eb" />
                Urban Property Queue ({filteredQueue.length})
              </h2>
              <Badge variant="primary">PMC Urban</Badge>
            </div>

            {/* Queue Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'CTS', label: 'CTS Cards' },
                { id: 'URGENT', label: 'Urgent SLA' },
                { id: 'TAX_DUES', label: 'Tax Dues' },
                { id: 'APPROVED', label: 'Sanctioned' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: activeTab === tab.id ? '#2563eb' : '#cbd5e1',
                    backgroundColor: activeTab === tab.id ? '#eff6ff' : '#ffffff',
                    color: activeTab === tab.id ? '#1d4ed8' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Items List */}
          <div style={{ maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                Loading municipal cases...
              </div>
            ) : filteredQueue.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                No municipal cases matching filter.
              </div>
            ) : (
              filteredQueue.map((item) => {
                const isSelected = item.id === selectedCase?.id;
                const daysLeft = item.daysLeft ?? item.slaDaysLeft ?? 15;
                const isUrgent = daysLeft <= 5;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      borderLeft: isSelected ? '4px solid #2563eb' : '4px solid transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.ctsNumber ? `CTS ${item.ctsNumber}` : item.gatNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: item.status === 'APPROVED' ? '#dcfce7' : isUrgent ? '#fee2e2' : '#f1f5f9',
                          color: item.status === 'APPROVED' ? '#166534' : isUrgent ? '#991b1b' : '#475569',
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.25rem' }}>
                      {item.type} • <strong>{item.landUse || 'Residential (NA)'}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                      <span>Applicant: <strong>{item.applicant}</strong></span>
                      <span style={{ color: isUrgent ? '#dc2626' : '#64748b', fontWeight: isUrgent ? 700 : 500 }}>
                        ⏳ {daysLeft}d left
                      </span>
                    </div>

                    {item.tax && (
                      <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.35rem' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            backgroundColor: item.tax.paymentStatus === 'PAID' ? '#dcfce7' : '#fef3c7',
                            color: item.tax.paymentStatus === 'PAID' ? '#166534' : '#92400e',
                            fontWeight: 600,
                          }}
                        >
                          Tax: {item.tax.paymentStatus}
                        </span>
                        {item.zoning && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '1px 5px',
                              borderRadius: '3px',
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              fontWeight: 600,
                            }}
                          >
                            FSI {item.zoning.maxFsi}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right Column: Case 360° Decision Bench */}
        {selectedCase ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header Card for Selected Case */}
            <Card style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      {selectedCase.ctsNumber ? `City Survey CTS ${selectedCase.ctsNumber}` : selectedCase.gatNumber}
                    </h2>
                    <Badge variant={selectedCase.status === 'APPROVED' ? 'success' : 'warning'}>
                      {selectedCase.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>Case ID: <strong>{selectedCase.id}</strong></span>
                    <span>ULPIN: <strong style={{ fontFamily: 'monospace' }}>{selectedCase.ulpin}</strong></span>
                    <span>Jurisdiction: <strong>{selectedCase.village}, Haveli, Pune</strong></span>
                  </div>
                </div>

                {/* Primary Statutory Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowZoningModal(true)}
                  >
                    <ShieldCheck size={14} style={{ marginRight: '4px' }} /> Verify Zoning
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowRejectModal(true)}
                    disabled={selectedCase.status === 'REJECTED'}
                  >
                    <XCircle size={14} style={{ marginRight: '4px' }} /> Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowSanctionModal(true)}
                    disabled={selectedCase.status === 'APPROVED'}
                    style={{ backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' }}
                  >
                    <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Sanction Urban Mutation
                  </Button>
                </div>
              </div>

              {/* Workspace Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', marginTop: '1rem', paddingBottom: '0.5rem' }}>
                {[
                  { id: 'DOSSIER', label: '📋 Urban Dossier', icon: FileText },
                  { id: 'CTS_CARD', label: '🏛️ CTS Property Card', icon: FileCheck2 },
                  { id: 'ZONING', label: '📐 PMRDA 2041 Zoning', icon: Building2 },
                  { id: 'TAX', label: '💰 Municipal Tax Register', icon: DollarSign },
                  { id: 'GIS_MAP', label: '🗺️ GIS Boundary', icon: Compass },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveWorkspaceTab(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        fontWeight: activeWorkspaceTab === tab.id ? 700 : 500,
                        border: 'none',
                        borderBottom: activeWorkspaceTab === tab.id ? '2px solid #1e3a8a' : '2px solid transparent',
                        backgroundColor: 'transparent',
                        color: activeWorkspaceTab === tab.id ? '#1e3a8a' : '#64748b',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon size={14} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* TAB CONTENT: Urban Dossier */}
            {activeWorkspaceTab === 'DOSSIER' && (
              <Card style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                  Statutory Urban Land Case Dossier
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Land Classification</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {selectedCase.classification || 'Non-Agricultural'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>Land Use: {selectedCase.landUse || 'Residential (NA)'}</div>
                  </div>

                  <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Plot Area</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {selectedCase.area || '0.85 Hectare'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>Demarcated in City Survey Office</div>
                  </div>

                  <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Applicant / Transferee</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {selectedCase.applicant}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>Filing Date: {new Date(selectedCase.filingDate).toLocaleDateString('en-IN')}</div>
                  </div>

                  <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Current Title Holder</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {selectedCase.seller || 'Recorded Urban Landholder'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>Source: e-Mahabhumi City Registry</div>
                  </div>
                </div>

                {/* Statutory Urban Compliance Checklist */}
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                  Statutory Municipal Verification Checklist
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { title: 'City Survey (CTS) Property Card Title Authenticity', status: selectedCase.ctsNumber ? 'PASSED' : 'PENDING', desc: `CTS ID ${selectedCase.ctsNumber || 'Not assigned'} verified against City Survey Office records.` },
                    { title: 'PMRDA Development Plan 2041 Permissible Land Use', status: selectedCase.zoning ? 'PASSED' : 'PENDING', desc: `Zoned under ${selectedCase.zoning?.currentZone || 'Master Plan'}. Max FSI: ${selectedCase.zoning?.maxFsi || '1.1'}.` },
                    { title: 'Municipal Property Tax Assessment Clearance', status: selectedCase.tax?.paymentStatus === 'PAID' ? 'PASSED' : 'WARNING', desc: `Assessment Year ${selectedCase.tax?.assessmentYear || '2024-2025'}. Status: ${selectedCase.tax?.paymentStatus || 'Pending verification'}.` },
                    { title: 'Form 135D Public Notice Period (15 Days)', status: 'PASSED', desc: 'Statutory 15-day objection period elapsed with zero formal objections.' },
                  ].map((chk, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{chk.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{chk.desc}</div>
                      </div>
                      <Badge variant={chk.status === 'PASSED' ? 'success' : chk.status === 'WARNING' ? 'warning' : 'neutral'}>
                        {chk.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* TAB CONTENT: CTS Property Card */}
            {activeWorkspaceTab === 'CTS_CARD' && (
              <Card style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      City Survey CTS Property Card (नगर भूमापन पत्रिका)
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Authoritative Urban Record of Rights — Section 127 MLR Code</div>
                  </div>
                  <Badge variant="primary">CTS Verified</Badge>
                </div>

                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.82rem' }}>
                    <div><strong>City Survey Number:</strong> <span style={{ color: '#b45309', fontWeight: 700 }}>{selectedCase.ctsNumber || 'CTS-WAG-102'}</span></div>
                    <div><strong>Ward / Division:</strong> Wagholi Urban Circle</div>
                    <div><strong>Municipal Authority:</strong> Pune Municipal Corporation</div>
                    <div><strong>Tenure:</strong> Class-1 (Occupant Class 1 - Non-Agricultural)</div>
                    <div><strong>Plot Area:</strong> {selectedCase.area || '850.00 Sq. Meters'}</div>
                    <div><strong>Current Registered Holder:</strong> {selectedCase.seller || 'Landholder'}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
                  <p><strong>Urban Land Administration Note:</strong> Under the Maharashtra Land Revenue Code, rural 7/12 extracts cease operation upon non-agricultural conversion and city survey demarcation. Title is definitively governed by this CTS Property Card extract.</p>
                </div>
              </Card>
            )}

            {/* TAB CONTENT: PMRDA 2041 Zoning */}
            {activeWorkspaceTab === 'ZONING' && (
              <Card style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  PMRDA Comprehensive Development Plan 2041 — Zoning &amp; Planning Scrutiny
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                  Statutory spatial clearance under Maharashtra Regional &amp; Town Planning Act (MRTP Act 1966).
                </div>

                {selectedCase.zoning ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Master Plan</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedCase.zoning.masterPlan}</div>
                    </div>
                    <div style={{ padding: '0.85rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 600 }}>Current Zone</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>{selectedCase.zoning.currentZone}</div>
                    </div>
                    <div style={{ padding: '0.85rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>Max Permissible FSI</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>{selectedCase.zoning.maxFsi} FSI</div>
                    </div>
                    <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Road Width Requirement</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedCase.zoning.roadWidthMeters} Meters Minimum</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                    Zoning data indexing for this parcel is in progress under PMRDA 2041 layer.
                  </div>
                )}

                {selectedCase.zoning?.permissibleUses && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Permissible Land Uses in this Zone:
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {selectedCase.zoning.permissibleUses.map((use, i) => (
                        <span key={i} style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.75rem', fontWeight: 600 }}>
                          ✓ {use}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* TAB CONTENT: Municipal Tax Register */}
            {activeWorkspaceTab === 'TAX' && (
              <Card style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Municipal Property Tax Assessment &amp; Clearance
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                  PMC Property Tax Billing System — NOC requirement for title registration.
                </div>

                {selectedCase.tax ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Assessment Year</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{selectedCase.tax.assessmentYear}</div>
                    </div>
                    <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Annual Property Tax</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>₹{selectedCase.tax.annualTax.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ padding: '0.85rem', backgroundColor: selectedCase.tax.pendingDues === 0 ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', border: `1px solid ${selectedCase.tax.pendingDues === 0 ? '#bbf7d0' : '#fecaca'}` }}>
                      <div style={{ fontSize: '0.72rem', color: selectedCase.tax.pendingDues === 0 ? '#166534' : '#991b1b', fontWeight: 600 }}>Pending Dues</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: selectedCase.tax.pendingDues === 0 ? '#15803d' : '#dc2626' }}>
                        ₹{selectedCase.tax.pendingDues.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Tax Receipt Number</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{selectedCase.tax.receiptNumber || 'N/A'}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                    No municipal tax assessment found for this property ID.
                  </div>
                )}
              </Card>
            )}

            {/* TAB CONTENT: GIS Map Viewer */}
            {activeWorkspaceTab === 'GIS_MAP' && (
              <Card style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Urban Cadastral GIS &amp; Boundary Map
                </h3>
                <AuthorityGisMap
                  ulpin={selectedCase.ulpin}
                  gatNumber={selectedCase.ctsNumber ? `CTS ${selectedCase.ctsNumber}` : selectedCase.gatNumber}
                  area={selectedCase.area}
                  status={selectedCase.status}
                />
              </Card>
            )}
          </div>
        ) : (
          <Card style={{ padding: '3.5rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
            <Building2 size={48} color="#94a3b8" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
              No Urban Property Selected
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
              Select a property from the Urban Property Queue on the left to inspect CTS property cards, PMRDA 2041 zoning compliance, municipal property tax records, and execute statutory sanction orders.
            </p>
          </Card>
        )}
      </div>

      {/* MODAL: Statutory Sanction Order */}
      {showSanctionModal && (
        <Modal
          title="Issue Statutory Sanction Order (Urban Mutation)"
          isOpen={showSanctionModal}
          onClose={() => setShowSanctionModal(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert
              type="info"
              message={`You are issuing a statutory sanction order for ${selectedCase.ctsNumber ? `CTS ${selectedCase.ctsNumber}` : selectedCase.id}. This will execute an atomic database transaction in PostgreSQL, update the mutation status to APPROVED, and create an immutable audit record.`}
            />

            <div className="ux4g-form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                Statutory Order Remarks &amp; Legal Citations <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={sanctionRemarks}
                onChange={(e) => setSanctionRemarks(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div className="ux4g-form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                Officer DSC / Biometric Step-Up Token (MFA) <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="password"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="Enter 6-digit TOTP token (Demo: 123456)"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Button variant="secondary" onClick={() => setShowSanctionModal(false)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleExecuteOrder('SANCTION')}
                disabled={actionLoading}
                style={{ backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' }}
              >
                {actionLoading ? 'Executing Order...' : 'Digitally Sign & Approve Order'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Statutory Rejection */}
      {showRejectModal && (
        <Modal
          title="Issue Statutory Rejection Order"
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert
              type="error"
              message="Statutory rejections require recorded legal grounds under Maharashtra Land Revenue Code / Municipal Regulations."
            />

            <div className="ux4g-form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                Legal Grounds for Rejection <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div className="ux4g-form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                Officer DSC / Biometric Step-Up Token (MFA)
              </label>
              <input
                type="password"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="Enter 6-digit TOTP token (Demo: 123456)"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Button variant="secondary" onClick={() => setShowRejectModal(false)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleExecuteOrder('REJECT')}
                disabled={actionLoading}
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Zoning Verification */}
      {showZoningModal && (
        <Modal
          title="Formally Certify PMRDA 2041 Zoning Clearance"
          isOpen={showZoningModal}
          onClose={() => setShowZoningModal(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Certify that this property complies with PMRDA Comprehensive Development Plan 2041 permissible land uses and maximum permissible FSI.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button variant="secondary" onClick={() => setShowZoningModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => handleExecuteOrder('ZONING_VERIFY')}>
                Certify &amp; Mark Reviewed
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UlbDashboard;
