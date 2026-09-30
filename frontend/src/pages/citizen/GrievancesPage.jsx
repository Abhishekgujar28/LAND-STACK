import React, { useState, useEffect } from 'react';
import {
  Scale,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  User,
  MapPin,
  FileText,
  FileCheck,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import grievanceService from '../../services/grievanceService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import ParcelSelector from '../../components/parcel/ParcelSelector';
import DocumentUploadZone from '../../components/common/DocumentUploadZone';

const GRIEVANCE_CATEGORIES = [
  'Delayed Mutation (Exceeded 30-Day SLA)',
  'Unauthorized Entry / Third-Party Claim Dispute',
  'Name / Share / Area Correction on Form 7/12',
  'Mojani Cadastral Boundary Dispute',
  'Illegal Encumbrance / Unrecognized Bank Lien',
  'Revenue Officer Misconduct / Demand of Unofficial Fees',
  'Other Statutory Revenue Complaint',
];

export const GrievancesPage = () => {
  const { user } = useAuth();
  const currentCitizen = user || {};

  const [grievancesList, setGrievancesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLodgeModal, setShowLodgeModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [formCategory, setFormCategory] = useState(GRIEVANCE_CATEGORIES[0]);
  const [selectedUlpin, setSelectedUlpin] = useState('');
  const [selectedParcelObj, setSelectedParcelObj] = useState(null);
  const [formSubject, setFormSubject] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [contactMobile, setContactMobile] = useState(currentCitizen.mobile || '');
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const data = await grievanceService.getGrievances();
      const list = Array.isArray(data) ? data : data?.data || [];
      setGrievancesList(list);
    } catch (err) {
      console.warn('[GrievancesPage] Error fetching grievances:', err);
      setGrievancesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [currentCitizen.id]);

  const handleParcelChange = (ulpin, parcel) => {
    setSelectedUlpin(ulpin);
    setSelectedParcelObj(parcel);
  };

  const handleLodgeGrievance = async (e) => {
    e.preventDefault();
    if (!formSubject.trim() || !formDescription.trim()) {
      setErrorMsg('Please fill in both subject and description of your grievance.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      citizenId: currentCitizen.id,
      parcelUlpin: selectedUlpin || null,
      category: formCategory,
      subject: formSubject.trim(),
      description: `${formDescription.trim()}${contactMobile ? ` [Contact: ${contactMobile}]` : ''}`,
      departmentCode: 'DEPT-REV',
    };

    try {
      const res = await grievanceService.createGrievance(payload);
      setShowLodgeModal(false);
      setSubmissionSuccess({
        trackingId: res.grievanceNumber || res.grievance_number || res.id,
        category: formCategory,
        subject: formSubject,
        status: res.status || 'OPEN',
        filedDate: new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }),
        parcel: selectedUlpin || 'General / Non-parcel specific',
        officerEscort: 'Assigned to Sub-Divisional Officer (SDO) Grievance Bench',
      });
      // Reset form
      setFormSubject('');
      setFormDescription('');
      setSelectedUlpin('');
      setSelectedParcelObj(null);
      setUploadedDoc(null);
      // Refresh
      fetchGrievances();
    } catch (err) {
      console.error('[GrievancesPage] Submission failed:', err);
      setErrorMsg(err.message || 'Failed to lodge grievance. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-grievances" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Citizen Grievance Redressal (e-Lokshahi)
            </span>
            <Badge variant="warning">District Collectorate Escort</Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
            Land Grievances &amp; Disputes
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Escalate mutation delays, unauthorized pencil entries, spelling errors on Form 7/12, or surveyor boundary issues with statutory tracking.
          </p>
        </div>

        <Button variant="primary" onClick={() => { setErrorMsg(null); setShowLodgeModal(true); }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} />
            Lodge New Grievance
          </span>
        </Button>
      </div>

      {/* Submission Success Banner */}
      {submissionSuccess && (
        <Card style={{ borderLeft: '4px solid var(--ux4g-success)', backgroundColor: '#f0fdf4', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={20} />
                Grievance Lodged Successfully in District Redressal System
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Tracking Ticket ID:</span>
                  <strong style={{ fontFamily: 'var(--ux4g-font-mono)', fontSize: '0.95rem' }}>{submissionSuccess.trackingId}</strong>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Category:</span>
                  <strong>{submissionSuccess.category}</strong>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Subject:</span>
                  <strong>{submissionSuccess.subject}</strong>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Status:</span>
                  <Badge variant="warning">{submissionSuccess.status}</Badge>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#14532d' }}>
                <strong>Statutory Officer Escort:</strong> {submissionSuccess.officerEscort}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmissionSuccess(null)}
              style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Dismiss
            </button>
          </div>
        </Card>
      )}

      {/* Grievance Tickets List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2].map((i) => (
            <div key={i} className="ux4g-skeleton-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div className="ux4g-skeleton-line" style={{ width: '40%', marginBottom: '0.5rem' }} />
                  <div className="ux4g-skeleton-line" style={{ width: '70%', height: 16 }} />
                </div>
                <div className="ux4g-skeleton" style={{ width: 80, height: 24, borderRadius: 6 }} />
              </div>
              <div className="ux4g-skeleton-line" style={{ width: '90%' }} />
              <div className="ux4g-skeleton-line" style={{ width: '55%' }} />
            </div>
          ))}
        </div>
      ) : grievancesList.length === 0 ? (
        <Card style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--ux4g-surface-muted)',
              color: 'var(--ux4g-text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Scale size={28} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>No Active Grievance Tickets</h3>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: '0 auto 1.25rem', maxWidth: '420px', fontSize: '0.9rem' }}>
            You have not raised any grievances. If you face statutory delays or discrepancies with your land records, lodge a ticket above.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowLodgeModal(true)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Plus size={14} />
              Lodge a Grievance
            </span>
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {grievancesList.map((item) => {
            const ticketId = item.grievanceNumber || item.grievance_number || item.id;
            const filedDate = item.filedDate || item.filed_date || item.createdDate || 'N/A';
            const ulpin = item.parcelId || item.parcel_ulpin;

            return (
              <Card key={item.id} className="ux4g-card-hover" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
                        TICKET ID: {ticketId}
                      </span>
                      <StatusBadge status={item.status} />
                      <Badge variant="neutral">{item.category}</Badge>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>
                      {item.subject}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>
                    Filed on: {new Date(filedDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--ux4g-surface-muted)',
                    padding: '0.85rem',
                    borderRadius: 'var(--ux4g-radius-md)',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div style={{ marginBottom: '0.35rem' }}>
                    <strong>Grievance Description:</strong> {item.description}
                  </div>
                  {ulpin && (
                    <div style={{ marginBottom: '0.35rem' }}>
                      <strong>Affected Land Parcel:</strong> <code>{ulpin}</code>
                    </div>
                  )}
                  <div style={{ color: item.resolutionNotes ? 'var(--ux4g-success)' : 'var(--ux4g-text-secondary)', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid var(--ux4g-border-subtle)' }}>
                    <strong>Officer Resolution Notes:</strong>{' '}
                    {item.resolutionNotes || item.resolution_notes || item.officerRemarks || 'Assigned to Sub-Divisional Officer (SDO) for inquiry and hearing.'}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lodge Grievance Modal */}
      {showLodgeModal && (
        <Modal
          isOpen={showLodgeModal}
          onClose={() => setShowLodgeModal(false)}
          title="Lodge Grievance on Land Record (e-Lokshahi)"
        >
          <form onSubmit={handleLodgeGrievance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errorMsg && (
              <Alert variant="danger">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={16} />
                  {errorMsg}
                </span>
              </Alert>
            )}

            {/* 1. Complainant Contact Info */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <User size={16} color="var(--ux4g-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Complainant Contact Information
                </span>
                <Badge variant="success">Authenticated Citizen</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Full Legal Name</label>
                  <input className="ux4g-input" value={currentCitizen.name || ''} readOnly style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Contact Mobile</label>
                  <input
                    className="ux4g-input"
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Email Address</label>
                  <input className="ux4g-input" value={currentCitizen.email || ''} readOnly style={{ backgroundColor: '#f1f5f9' }} />
                </div>
              </div>
            </div>

            {/* 2. Category */}
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Grievance Category</label>
              <select
                className="ux4g-select"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                required
              >
                {GRIEVANCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Parcel Selector (Optional / Contextual) */}
            <ParcelSelector
              value={selectedUlpin}
              onChange={handleParcelChange}
              required={false}
              label="Affected Land Parcel (If Applicable)"
              helperText="Link the grievance to an owned cadastral parcel, or leave blank for administrative issues"
            />

            {/* 4. Subject */}
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Grievance Subject</label>
              <input
                type="text"
                className="ux4g-input"
                placeholder="e.g. Unauthorized pencil entry in Gat 42 without notice"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                required
              />
            </div>

            {/* 5. Description */}
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Detailed Statement of Dispute / Facts</label>
              <textarea
                className="ux4g-textarea"
                rows={3}
                placeholder="State chronological facts, reference application numbers, dates of revenue visits, or Talathi notices..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
              />
            </div>

            {/* 6. Document Attachments */}
            <DocumentUploadZone
              title="Attach Evidentiary Proof (Notice copy, 7/12 extract, or survey map)"
              documentType="Grievance Evidence"
              parcelUlpin={selectedUlpin}
              onUploadSuccess={(doc) => setUploadedDoc(doc)}
              onRemove={() => setUploadedDoc(null)}
              required={false}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowLodgeModal(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  'Lodge in District Redressal System...'
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Register Grievance Ticket
                    <ArrowRight size={14} />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default GrievancesPage;
