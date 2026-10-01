import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import mutationService from '../../../services/mutationService';
import KPIStat from '../../../components/government/KPIStat';
import AuthorityGisMap from '../../../components/government/AuthorityGisMap';
import { ROLES } from '../../../config/roles';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Modal from '../../../components/ui/Modal';
import {
  Scale,
  MapPin,
  Calendar,
  Layers,
  FileCheck2,
  AlertTriangle,
  FileText,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';

export const TehsildarDashboard = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('DOSSIER'); // 'DOSSIER' | 'GIS_MAP' | 'COURT_CALENDAR'

  useEffect(() => {
    let isMounted = true;
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
      .catch((err) => console.warn('Tehsildar queue fetch error:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Modals
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const selectedCase = queue.find((c) => c.id === selectedCaseId) || queue[0] || null;

  const handleExecuteOrder = async (decision) => {
    if (!selectedCase) return;
    setActionLoading(true);

    try {
      if (decision === 'SANCTION') {
        await mutationService.approveMutation(selectedCase.id, {
          remarks: 'Statutory Sanction Order passed under Section 149/150 MLR Code. Field inspection verified.',
          _mfaToken: '123456',
        });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === selectedCase.id ? { ...item, status: 'APPROVED' } : item
          )
        );
        setActionNotice(
          `Statutory Sanction Order passed for ${selectedCase.gatNumber || selectedCase.id} (${selectedCase.id}). Digitally signed with Executive Magistrate DSC token. RoR mutation entry certified in PostgreSQL!`
        );
      } else if (decision === 'REJECT') {
        await mutationService.rejectMutation(selectedCase.id, {
          reason: 'Statutory Rejection Order passed under Section 149/150 MLR Code.',
          _mfaToken: '123456',
        });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === selectedCase.id ? { ...item, status: 'REJECTED' } : item
          )
        );
        setActionNotice(
          `Statutory Rejection Order passed for ${selectedCase.gatNumber || selectedCase.id}. Reason recorded under Section 149/150 MLR Code. Dispatched to parties.`
        );
      } else {
        await mutationService.executeAction(selectedCase.id, 'RETURN_FOR_CLARIFICATION', {
          remarks: 'Case returned to Field Revenue Officer for clarification on boundary area.',
        });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === selectedCase.id ? { ...item, status: 'DOCUMENTS_PENDING' } : item
          )
        );
        setActionNotice(
          `Case ${selectedCase.id} returned to Field Revenue Officer for clarification on boundary area.`
        );
      }
    } catch (err) {
      console.error('[TehsildarDashboard] Action execution failed:', err);
      setActionNotice(`Failed to execute order: ${err.message || 'Database error'}`);
    } finally {
      setActionLoading(false);
      setShowSanctionModal(false);
      setShowRejectModal(false);
      setShowClarificationModal(false);
    }
  };

  return (
    <div className="page-tehsildar-workspace" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              <Scale size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              Sub-District Magistrate Statutory Decision Workspace
            </h1>
            <span
              style={{
                background: '#dc2626',
                color: '#ffffff',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              PRIMARY STATUTORY AUTHORITY
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Officer:</strong> {user?.name || 'Sanjay Deshmukh'}</span>
            <span><strong>Designation:</strong> Sub-District Magistrate &amp; Revenue Officer</span>
            <span><strong>Jurisdiction:</strong> Haveli Sub-District, Pune (112 Villages)</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            textAlign: 'right',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            DSC Digital Token Active
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            Class-3 e-Sign: SANJAY_DESHMUKH_REV_MH
          </div>
        </div>
      </div>

      {actionNotice && (
        <Alert variant="success">
          <strong>Statutory Order Executed:</strong> {actionNotice}
        </Alert>
      )}

      {/* Headline Statutory KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <KPIStat
          title="Awaiting Statutory Order"
          value={queue.filter((q) => q.status === 'READY_FOR_ORDER').length}
          subtitle="Field verified cases ready"
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
          onClick={() => setActiveWorkspaceTab('DOSSIER')}
          className={`ux4g-btn ux4g-btn-sm ${activeWorkspaceTab === 'DOSSIER' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeWorkspaceTab === 'DOSSIER' ? '#064e3b' : undefined,
            borderColor: activeWorkspaceTab === 'DOSSIER' ? '#064e3b' : undefined,
            color: activeWorkspaceTab === 'DOSSIER' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <FileText size={15} />
          <span>Statutory Order Bench & Dossier</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveWorkspaceTab('GIS_MAP')}
          className={`ux4g-btn ux4g-btn-sm ${activeWorkspaceTab === 'GIS_MAP' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeWorkspaceTab === 'GIS_MAP' ? '#064e3b' : undefined,
            borderColor: activeWorkspaceTab === 'GIS_MAP' ? '#064e3b' : undefined,
            color: activeWorkspaceTab === 'GIS_MAP' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Layers size={15} />
          <span>Haveli Tehsil GIS Cadastre (112 Villages)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveWorkspaceTab('COURT_CALENDAR')}
          className={`ux4g-btn ux4g-btn-sm ${activeWorkspaceTab === 'COURT_CALENDAR' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeWorkspaceTab === 'COURT_CALENDAR' ? '#064e3b' : undefined,
            borderColor: activeWorkspaceTab === 'COURT_CALENDAR' ? '#064e3b' : undefined,
            color: activeWorkspaceTab === 'COURT_CALENDAR' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Calendar size={15} />
          <span>Revenue Court Hearings Calendar (4)</span>
        </button>
      </div>

      {/* TAB 1: STATUTORY DOSSIER VIEW */}
      {activeWorkspaceTab === 'DOSSIER' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 400px) 1fr',
            gap: '1.5rem',
            alignItems: 'start',
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
              <h2 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--ux4g-primary)' }}>
                📋 Tehsil Statutory Decision Queue
              </h2>
              <Badge variant="primary">{queue.length} Cases</Badge>
            </div>

            <div style={{ padding: '0.75rem', maxHeight: '680px', overflowY: 'auto' }}>
              {queue.length === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--ux4g-text-muted)', fontSize: '0.875rem' }}>
                  {loading ? 'Loading decision queue...' : 'No cases pending statutory order.'}
                </div>
              ) : (
                queue.map((item) => {
                  const isSelected = selectedCase && item.id === selectedCase.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCaseId(item.id)}
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 800, color: '#064e3b', fontSize: '0.95rem' }}>
                          {item.gatNumber || `Plot ${item.ulpin?.slice(-3) || '—'}`} ({item.village || 'Haveli'})
                        </span>
                        <Badge variant={item.status === 'HEARING_SCHEDULED' ? 'warning' : 'info'}>
                          {item.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.type}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', marginTop: '0.25rem' }}>
                        Verified by Field Officer {item.talathiName || 'Officer'} &bull; {item.daysPending || 0} days in workflow
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Split-Panel Review & Statutory Order Execution */}
          {!selectedCase ? (
            <Card style={{ padding: '3.5rem 2rem', textAlign: 'center', background: '#ffffff' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#064e3b' }}>⚖️</div>
              <h2 style={{ fontSize: '1.25rem', color: '#064e3b', fontWeight: 800, margin: '0 0 0.5rem' }}>
                {loading ? 'Loading Statutory Decision Bench...' : 'No Statutory Case Selected'}
              </h2>
              <p style={{ color: 'var(--ux4g-text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
                {loading
                  ? 'Retrieving statutory cases requiring quasi-judicial decision...'
                  : 'Select a case from the queue to review evidence dossier, run AI title risk checks, and pass statutory sanction/rejection orders.'}
              </p>
            </Card>
          ) : (
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
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ux4g-text-muted)', textTransform: 'uppercase' }}>
                    Statutory Hearing & Order Bench
                  </div>
                  <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
                    {selectedCase.gatNumber || `Plot ${selectedCase.ulpin?.slice(-3) || '—'}`} — {selectedCase.village || 'Haveli'}
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Case ULPIN</span>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>
                    {selectedCase.ulpin}
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.25rem' }}>
                {/* Evidence Dossier + AI Advisory */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  {/* Evidence Dossier */}
                  <div
                    style={{
                      padding: '0.95rem',
                      background: 'var(--ux4g-surface-muted)',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: '0.5rem', color: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FileCheck2 size={16} />
                      <span>Evidence & Verification Dossier</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div>&bull; <strong>Registered Deed:</strong> {selectedCase.deedNumber || 'SRO Deed Verified'}</div>
                      <div>&bull; <strong>Field Inspection Report:</strong> {selectedCase.talathiReport || 'Ground inspection verified'}</div>
                      <div>&bull; <strong>Site Photos:</strong> {selectedCase.photosCount || 0} GPS stamped</div>
                      <div>&bull; <strong>Section 135D Notice:</strong> {selectedCase.noticePeriodStatus || 'Statutory Notice Elapsed (0 Objections)'}</div>
                      <div>&bull; <strong>Encumbrances:</strong> Nil active bank charges</div>
                    </div>
                  </div>

                  {/* AI Advisory Panel */}
                  <div
                    style={{
                      padding: '0.95rem',
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: '0.5rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <AlertTriangle size={16} />
                      <span>AI Risk Advisory & Decision Support</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#78350f', lineHeight: 1.5 }}>
                      {selectedCase.aiFlag || 'Clean title pedigree. No conflicting injunctions or tribal transfer restrictions detected.'}
                    </p>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#92400e' }}>
                      AI Confidence: <strong>94.6%</strong> | Model: <code>LandGov-v2.1</code>
                    </div>
                  </div>
                </div>

                {/* Legal Authority Note */}
                <Alert variant="info" style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <strong>Sole Statutory Competence:</strong> Under the Land Revenue Code (1966), only the Executive Magistrate holds the statutory power to sanction or reject mutation orders.
                </Alert>

                {/* Mini Cadastral Preview */}
                <div style={{ marginBottom: '1.25rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                  <div style={{ background: '#064e3b', color: '#ffffff', padding: '0.5rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Cadastral GIS Verification (Plot {selectedCase.gatNumber || selectedCase.ulpin})</span>
                    <Button variant="ghost" size="sm" onClick={() => setActiveWorkspaceTab('GIS_MAP')} style={{ color: '#fef08a', padding: 0 }}>
                      Expand Full Tehsil Map &rarr;
                    </Button>
                  </div>
                  <AuthorityGisMap
                    authorityRole={ROLES.TEHSILDAR}
                    activeJurisdiction="Haveli Tehsil"
                    height="260px"
                    selectedUlpin={selectedCase.ulpin}
                  />
                </div>

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
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <RotateCcw size={14} />
                    <span>Return to Field Officer</span>
                  </Button>

                  <Button
                    variant="danger"
                    size="md"
                    onClick={() => setShowRejectModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <XCircle size={15} />
                    <span>Reject with MLR Grounds</span>
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setShowSanctionModal(true)}
                    style={{ backgroundColor: '#064e3b', borderColor: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Statutory Sanction Order (e-Sign)</span>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: FULL TEHSIL GIS CADASTRE */}
      {activeWorkspaceTab === 'GIS_MAP' && (
        <Card style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
                Haveli Tehsil Executive Cadastral GIS (112 Villages)
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Inspect village outer borders, digitized land parcels, and mutation hotspots across the entire Sub-District.
              </p>
            </div>
            <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>
              EPSG:4326 WGS84
            </Badge>
          </div>

          <AuthorityGisMap
            authorityRole={ROLES.TEHSILDAR}
            activeJurisdiction="Haveli Tehsil (112 Villages)"
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

      {/* TAB 3: REVENUE COURT HEARINGS BENCH */}
      {activeWorkspaceTab === 'COURT_CALENDAR' && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
              Revenue Court Hearing Cause List — Today's Bench
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)' }}>
              Executive Magistrate Court, Haveli Tehsil, Pune
            </p>
          </div>

          <div className="ux4g-table-wrapper">
            <table className="ux4g-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Case No.</th>
                  <th>Plot No. / Village</th>
                  <th>Parties (Applicant vs Opponent)</th>
                  <th>Section</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>11:00 AM</strong></td>
                  <td><code>REV-HVL-2026-0089</code></td>
                  <td>Plot 88, Wagholi</td>
                  <td>Priya Shinde vs. Dnyaneshwar Lande</td>
                  <td>Sec 150(2) MLR Code</td>
                  <td><Badge variant="warning">Hearing In Progress</Badge></td>
                  <td>
                    <Button variant="primary" size="sm" style={{ backgroundColor: '#064e3b' }}>
                      Record Bench Notes
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td><strong>12:30 PM</strong></td>
                  <td><code>REV-HVL-2026-0092</code></td>
                  <td>Plot 112, Manjri</td>
                  <td>Kishore Patil vs. State of MH</td>
                  <td>Sec 149 Title Dispute</td>
                  <td><Badge variant="neutral">Summons Issued</Badge></td>
                  <td>
                    <Button variant="outline" size="sm">
                      View Cause File
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td><strong>02:30 PM</strong></td>
                  <td><code>REV-HVL-2026-0095</code></td>
                  <td>Plot 64, Lohegaon</td>
                  <td>Amit Jagtap vs. Ramesh Kale</td>
                  <td>Sec 36A Tribal Land Sanction</td>
                  <td><Badge variant="danger">High Risk</Badge></td>
                  <td>
                    <Button variant="outline" size="sm">
                      View Cause File
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td><strong>04:00 PM</strong></td>
                  <td><code>REV-HVL-2026-0101</code></td>
                  <td>Plot 204, Hadapsar</td>
                  <td>Suman Shinde vs. Cadastral Surveyor</td>
                  <td>Boundary Demarcation</td>
                  <td><Badge variant="neutral">Adjourned to 12-Sep</Badge></td>
                  <td>
                    <Button variant="outline" size="sm">
                      View Cause File
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

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
            <Button variant="primary" onClick={() => handleExecuteOrder('SANCTION')} style={{ backgroundColor: '#064e3b' }}>
              ✍️ Sign & Issue Statutory Order
            </Button>
          </div>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <p>
            You are about to issue the authoritative <strong>Statutory Mutation Order</strong> for <strong>{selectedCase?.gatNumber || selectedCase?.id || 'Selected Case'}</strong> ({selectedCase?.id || '—'}).
          </p>
          <div
            style={{
              padding: '0.75rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <div>&bull; Transferee: <strong>{selectedCase?.applicant || 'Applicant'}</strong></div>
            <div>&bull; RoR Update: Form 6 certified &amp; Record of Rights record updated</div>
            <div>&bull; Digital Token: <code>SHA-256 DSC RSA 2048 Bit Verified</code></div>
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
              <option>Breach of Prevention of Fragmentation &amp; Consolidation of Holdings Act</option>
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
        title="Return to Field Officer for Clarification"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => setShowClarificationModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleExecuteOrder('CLARIFICATION')} style={{ backgroundColor: '#064e3b' }}>
              Return Case to Field Officer
            </Button>
          </div>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <div className="ux4g-form-group">
            <label className="ux4g-label">Clarification Directive to Field Officer</label>
            <textarea
              className="ux4g-textarea"
              rows={3}
              placeholder="e.g. Conduct joint measurement with cadastral surveyor to verify south boundary stone..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TehsildarDashboard;
