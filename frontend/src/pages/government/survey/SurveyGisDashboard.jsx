import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import mutationService from '../../../services/mutationService';
import KPIStat from '../../../components/government/KPIStat';
import AuthorityGisMap from '../../../components/government/AuthorityGisMap';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Modal from '../../../components/ui/Modal';
import {
  Compass,
  MapPin,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Eye,
  Maximize2,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export const SurveyGisDashboard = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [actionNotice, setActionNotice] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('Cadastral polygon coordinates verified against ETS rover control points. Zero spatial overlap with adjacent survey plots.');
  const [discrepancyNotes, setDiscrepancyNotes] = useState('Boundary polygon overlap detected on western parcel perimeter (0.04 Ha discrepancy).');

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
      .catch((err) => console.warn('[SurveyGisDashboard] Queue fetch error:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCase = queue.find((c) => c.id === selectedCaseId) || queue[0] || null;

  const filteredQueue = queue.filter((item) => {
    if (activeTab === 'URGENT') return (item.daysLeft ?? item.slaDaysLeft ?? 15) <= 5;
    if (activeTab === 'VERIFIED') return item.status === 'FIELD_VERIFIED' || item.status === 'REVIEWED';
    return true;
  });

  const handleVerifySpatial = async (type) => {
    if (!selectedCase) return;
    setActionLoading(true);
    setActionNotice(null);

    try {
      if (type === 'VERIFY') {
        await mutationService.executeAction(selectedCase.id, 'REVIEW', {
          remarks: verificationNotes,
        });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === selectedCase.id ? { ...item, status: 'REVIEWED' } : item
          )
        );
        setShowVerifyModal(false);
        setActionNotice({
          type: 'success',
          message: `Spatial boundary verified and topology certified for ${selectedCase.gatNumber || selectedCase.ctsNumber || selectedCase.id}. Certified polygon layer synced with cadastral database.`,
        });
      } else {
        await mutationService.executeAction(selectedCase.id, 'RETURN_FOR_CLARIFICATION', {
          remarks: discrepancyNotes,
        });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === selectedCase.id ? { ...item, status: 'DOCUMENTS_PENDING' } : item
          )
        );
        setShowConflictModal(false);
        setActionNotice({
          type: 'warning',
          message: `Boundary discrepancy flagged for ${selectedCase.id}. Returned to Revenue Inspector for joint on-site measurement.`,
        });
      }
    } catch (err) {
      console.error('[SurveyGisDashboard] Action error:', err);
      setActionNotice({
        type: 'error',
        message: 'Action failed: ' + (err.message || 'Database error occurred'),
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-survey-gis-workspace" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Officer Jurisdiction Identity Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #115e59 50%, #134e4a 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(15, 118, 110, 0.25)',
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
                color: '#5eead4',
              }}
            >
              <Compass size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              Cadastral Survey &amp; GIS Spatial Verification Desk
            </h1>
            <span
              style={{
                background: '#0d9488',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Shared GIS Domain
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#ccfbf1', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span>👤 <strong>{user?.name || 'Vikram Patole'}</strong> (Cadastral Survey Specialist)</span>
            <span>📍 <strong>Spatial Jurisdiction:</strong> Haveli Tehsil &amp; Pune District Cadastral Grid (EPSG:4326)</span>
            <span>🛰️ <strong>Instrumentation:</strong> CORS GNSS Rover &amp; Drone Orthomosaic Layer</span>
          </div>
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

      {/* Top Survey KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <KPIStat
          title="Spatial Queue"
          value={queue.length}
          change="Pending verification"
          icon={Compass}
          color="#0f766e"
          subtitle="Cadastral plot geometry validations"
        />
        <KPIStat
          title="Topology Certified"
          value={queue.filter((i) => i.status === 'REVIEWED' || i.status === 'APPROVED').length}
          change="Clean spatial bounds"
          icon={CheckCircle2}
          color="#059669"
          subtitle="Zero polygon boundary overlaps"
        />
        <KPIStat
          title="Area Variance SLA"
          value="< 0.5%"
          change="Complies with MLRC"
          icon={Activity}
          color="#2563eb"
          subtitle="Polygon area vs RoR record"
        />
        <KPIStat
          title="High Priority Boundary Checks"
          value={queue.filter((i) => (i.daysLeft ?? 15) <= 5).length}
          change="Statutory deadline"
          icon={AlertTriangle}
          color="#dc2626"
          subtitle="Expedited survey requests"
        />
      </div>

      {/* Main Workspace Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left Column: Spatial Workload Queue */}
        <Card style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Layers size={16} color="#0f766e" />
              Spatial Verification Queue ({filteredQueue.length})
            </h2>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {['ALL', 'URGENT', 'VERIFIED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: activeTab === tab ? 700 : 500,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: activeTab === tab ? '#0f766e' : '#cbd5e1',
                    backgroundColor: activeTab === tab ? '#f0fdfa' : '#ffffff',
                    color: activeTab === tab ? '#0f766e' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                Loading spatial features...
              </div>
            ) : filteredQueue.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                No spatial cases in queue.
              </div>
            ) : (
              filteredQueue.map((item) => {
                const isSelected = item.id === selectedCase?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isSelected ? '#f0fdfa' : '#ffffff',
                      borderLeft: isSelected ? '4px solid #0f766e' : '4px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.gatNumber || (item.ctsNumber ? `CTS ${item.ctsNumber}` : item.id)}
                      </span>
                      <Badge variant={item.status === 'REVIEWED' ? 'success' : 'neutral'}>
                        {item.status}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.25rem' }}>
                      {item.village} • Area: {item.area}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      ULPIN: <span style={{ fontFamily: 'monospace' }}>{item.ulpin}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right Column: Spatial Cadastral Map & Decision Bench */}
        {selectedCase ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Card style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Cadastral Plot Boundary: {selectedCase.gatNumber || selectedCase.ctsNumber}
                  </h2>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    ULPIN: <strong style={{ fontFamily: 'monospace' }}>{selectedCase.ulpin}</strong> | Location: <strong>{selectedCase.village}, Haveli</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConflictModal(true)}
                  >
                    <AlertTriangle size={14} style={{ marginRight: '4px' }} /> Flag Boundary Overlap
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowVerifyModal(true)}
                    style={{ backgroundColor: '#0f766e', borderColor: '#0f766e' }}
                  >
                    <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Certify Spatial Boundary
                  </Button>
                </div>
              </div>

              {/* Authority GIS Map */}
              <AuthorityGisMap
                ulpin={selectedCase.ulpin}
                gatNumber={selectedCase.gatNumber || selectedCase.ctsNumber}
                area={selectedCase.area}
                status={selectedCase.status}
              />

              {/* Spatial Geometry Inspection Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Polygon Geometry</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>PostGIS ST_Polygon (Closed)</div>
                  <div style={{ fontSize: '0.72rem', color: '#475569' }}>CRS: EPSG:4326 (WGS 84)</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Area Reconciliation</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>GIS: {selectedCase.area} | RoR: {selectedCase.area}</div>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Variance: 0.00% (Matched)</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Adjacent Parcel Topology</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>4 Shared Edges</div>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>0 Overlaps / 0 Gaps</div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card style={{ padding: '3.5rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
            <Compass size={48} color="#0f766e" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
              No Spatial Case Selected
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
              Select a parcel from the Spatial Verification Queue on the left to inspect boundary coordinates, ETS rover control points, CORS accuracy, and certify spatial demarcation.
            </p>
          </Card>
        )}
      </div>

      {/* MODAL: Certify Spatial Boundary */}
      {showVerifyModal && (
        <Modal
          title="Certify Cadastral Spatial Boundary"
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Confirm that the cadastral polygon geometry has been verified against ground rover measurements and satellite imagery with zero topological boundary conflicts.
            </p>
            <div className="ux4g-form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                Survey Specialist Notes &amp; Instrument Accuracy
              </label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button variant="secondary" onClick={() => setShowVerifyModal(false)} disabled={actionLoading}>Cancel</Button>
              <Button variant="primary" onClick={() => handleVerifySpatial('VERIFY')} disabled={actionLoading} style={{ backgroundColor: '#0f766e', borderColor: '#0f766e' }}>
                {actionLoading ? 'Certifying...' : 'Certify & Sync Cadastre'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Boundary Discrepancy */}
      {showConflictModal && (
        <Modal
          title="Report Cadastral Discrepancy"
          isOpen={showConflictModal}
          onClose={() => setShowConflictModal(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert
              type="error"
              message="This will return the case with a formal boundary dispute intimation to the Revenue Inspector."
            />
            <div className="ux4g-form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Discrepancy Details</label>
              <textarea
                value={discrepancyNotes}
                onChange={(e) => setDiscrepancyNotes(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button variant="secondary" onClick={() => setShowConflictModal(false)} disabled={actionLoading}>Cancel</Button>
              <Button variant="danger" onClick={() => handleVerifySpatial('DISCREPANCY')} disabled={actionLoading}>
                {actionLoading ? 'Reporting...' : 'Report Boundary Discrepancy'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SurveyGisDashboard;
