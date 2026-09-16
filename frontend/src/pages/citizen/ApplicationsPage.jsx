import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Layers,
  Search,
  User,
  MapPin,
  FileCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import applicationService from '../../services/applicationService';
import citizenService from '../../services/citizenService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import ParcelSelector from '../../components/parcel/ParcelSelector';
import DocumentUploadZone from '../../components/common/DocumentUploadZone';

const FALLBACK_SERVICES = [
  { code: 'APPT_ROR_EXTRACT', title: 'Certified Digitally Signed 7/12 RoR Extract', fee: 50, sla_days: 3 },
  { code: 'APPT_ZONE_CERT', title: 'Form 8A Landholding Account Certificate', fee: 50, sla_days: 3 },
  { code: 'APPT_DEMARCATION', title: 'Cadastral Boundary Map & e-Mojani Survey', fee: 1000, sla_days: 15 },
  { code: 'APPT_NON_AGRI', title: 'Non-Agricultural (NA) Land Conversion Clearance', fee: 500, sla_days: 30 },
];

export const ApplicationsPage = () => {
  const { user } = useAuth();
  const currentCitizen = user || {};

  const [applicationsList, setApplicationsList] = useState([]);
  const [servicesList, setServicesList] = useState(FALLBACK_SERVICES);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [formTypeCode, setFormTypeCode] = useState(FALLBACK_SERVICES[0].code);
  const [selectedUlpin, setSelectedUlpin] = useState('');
  const [selectedParcelObj, setSelectedParcelObj] = useState(null);
  const [applicantAddress, setApplicantAddress] = useState(currentCitizen.address || '');
  const [formRemarks, setFormRemarks] = useState('');
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getApplications();
      const list = Array.isArray(res) ? res : res?.items || [];
      setApplicationsList(list);
    } catch (err) {
      console.warn('[ApplicationsPage] Error loading applications:', err);
      setApplicationsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();

    // Fetch dynamic service types
    applicationService.getApplicationTypes()
      .then((types) => {
        if (Array.isArray(types) && types.length > 0) {
          setServicesList(types);
          setFormTypeCode(types[0].code);
        }
      })
      .catch((err) => {
        console.warn('[ApplicationsPage] Error loading application types, using standard catalog:', err);
      });
  }, []);

  const handleParcelChange = (ulpin, parcel) => {
    setSelectedUlpin(ulpin);
    setSelectedParcelObj(parcel);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedUlpin) {
      setErrorMsg('Please select a registered land parcel to link with this application.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const selectedService = servicesList.find((s) => s.code === formTypeCode) || servicesList[0];

    const payload = {
      typeCode: selectedService.code,
      parcelUlpin: selectedUlpin,
      feeAmount: selectedService.fee || 50,
      remarks: formRemarks || `Application for ${selectedService.title} submitted via Citizen Portal.`,
      formData: {
        applicantName: currentCitizen.name,
        applicantMobile: currentCitizen.mobile,
        applicantEmail: currentCitizen.email,
        applicantAddress: applicantAddress || currentCitizen.address,
        village: selectedParcelObj?.village_name || selectedParcelObj?.villageName,
        tehsil: selectedParcelObj?.tehsil || selectedParcelObj?.tehsil_code || 'Haveli',
        gatNumber: selectedParcelObj?.gat_number || selectedParcelObj?.gatNumber || selectedParcelObj?.survey_number,
        area: selectedParcelObj?.area,
        documentId: uploadedDoc?.id || null,
      },
      documents: uploadedDoc?.id ? [uploadedDoc.id] : [],
    };

    try {
      const newApp = await applicationService.createApplication(payload);
      setShowNewAppModal(false);
      setSubmissionSuccess({
        applicationNumber: newApp.application_number || newApp.id,
        serviceTitle: selectedService.title,
        parcelUlpin: selectedUlpin,
        submissionDate: new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }),
        status: newApp.status || 'SUBMITTED',
        nextStep: 'Document Verification by Talathi / Revenue Circle Officer',
        documentAttached: uploadedDoc ? uploadedDoc.title || uploadedDoc.name || 'Uploaded Document' : 'None',
      });
      // Reset form
      setFormRemarks('');
      setUploadedDoc(null);
      // Refresh list
      fetchApplications();
    } catch (err) {
      console.error('[ApplicationsPage] Submission failed:', err);
      setErrorMsg(err.message || 'Failed to submit application. Please verify all details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps = applicationsList.filter((a) => {
    if (selectedStatus === 'ALL') return true;
    return a.status === selectedStatus;
  });

  return (
    <div className="page-applications" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Citizen Service Delivery SLA Tracker
            </span>
            <Badge variant="info">Right to Public Services Act (RTS)</Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
            My Service Applications
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Track certified 7/12 extracts, Mojani survey requests, Form 8A Certificates, and NA permissions with statutory SLA monitoring.
          </p>
        </div>

        <Button variant="primary" onClick={() => { setErrorMsg(null); setShowNewAppModal(true); }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} />
            Apply for New Revenue Service
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
                Application Submitted Successfully to Department of Revenue
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Application Tracking ID:</span>
                  <strong style={{ fontFamily: 'var(--ux4g-font-mono)', fontSize: '0.95rem' }}>{submissionSuccess.applicationNumber}</strong>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Service Type:</span>
                  <strong>{submissionSuccess.serviceTitle}</strong>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Linked Parcel:</span>
                  <code style={{ fontSize: '0.85rem' }}>{submissionSuccess.parcelUlpin}</code>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Current Status:</span>
                  <Badge variant="info">{submissionSuccess.status}</Badge>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#14532d' }}>
                <strong>Statutory Next Step:</strong> {submissionSuccess.nextStep} &bull; <strong>Documents Attached:</strong> {submissionSuccess.documentAttached}
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

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '1px solid var(--ux4g-border-subtle)' }}>
        {[
          { key: 'ALL', label: `All Applications (${applicationsList.length})` },
          { key: 'SUBMITTED', label: `Submitted (${applicationsList.filter((a) => a.status === 'SUBMITTED' || a.status === 'PENDING').length})` },
          { key: 'IN_REVIEW', label: `In Review (${applicationsList.filter((a) => a.status === 'IN_REVIEW' || a.status === 'UNDER_REVIEW' || a.status === 'IN_PROGRESS').length})` },
          { key: 'APPROVED', label: `Approved / Issued (${applicationsList.filter((a) => a.status === 'APPROVED' || a.status === 'ISSUED' || a.status === 'COMPLETED').length})` },
          { key: 'REJECTED', label: `Rejected (${applicationsList.filter((a) => a.status === 'REJECTED').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedStatus(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderBottom: selectedStatus === tab.key ? '3px solid var(--ux4g-primary)' : '3px solid transparent',
              background: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: selectedStatus === tab.key ? 'var(--ux4g-primary)' : 'var(--ux4g-text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--ux4g-transition-fast)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications Grid */}
      {loading ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>Loading your authoritative service applications from database...</p>
        </Card>
      ) : filteredApps.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>
            {applicationsList.length === 0
              ? 'No revenue service applications submitted yet. Click "Apply for New Revenue Service" to request certified extracts or surveys.'
              : `No applications matching status "${selectedStatus}".`}
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filteredApps.map((app) => {
            const appNumber = app.application_number || app.id;
            const appTitle = app.application_types?.title || app.type_code || app.serviceName || 'Revenue Service';
            const ulpin = app.parcel_ulpin || app.parcelId || 'Not Specified';
            const submissionDate = app.submission_date ? new Date(app.submission_date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : (app.appliedDate || 'N/A');

            return (
              <Card key={app.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)', letterSpacing: '0.04em' }}>
                        APP ID: {appNumber}
                      </span>
                      <h3 style={{ margin: '0.2rem 0', fontSize: '1.1rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>
                        {appTitle}
                      </h3>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginBottom: '0.75rem' }}>
                    Cadastral Parcel: <strong style={{ fontFamily: 'var(--ux4g-font-mono)' }}>{ulpin}</strong>
                  </div>

                  <div
                    style={{
                      background: 'var(--ux4g-surface-muted)',
                      padding: '0.75rem',
                      borderRadius: 'var(--ux4g-radius-sm)',
                      fontSize: '0.8rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>Submitted Date:</span>
                      <strong>{submissionDate}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>Statutory Fee:</span>
                      <strong>₹{app.fee_amount != null ? app.fee_amount : 50} ({app.payment_status || 'PAID'})</strong>
                    </div>
                    {app.form_data?.remarks && (
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--ux4g-border-subtle)', color: 'var(--ux4g-text)' }}>
                        <strong>Remarks:</strong> {app.form_data.remarks}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1.25rem', background: '#fafbfc', borderTop: '1px solid var(--ux4g-border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      Track Statutory Timeline
                      <ArrowRight size={13} />
                    </span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Real Statutory Status Tracking Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Lifecycle & Audit Trail — ${selectedApp.application_number || selectedApp.id}`}
        >
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: 'var(--ux4g-radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                <div><strong>Service:</strong> {selectedApp.application_types?.title || selectedApp.type_code}</div>
                <div><strong>Target Parcel:</strong> <code>{selectedApp.parcel_ulpin || selectedApp.parcelId}</code></div>
                <div><strong>Current Status:</strong> <StatusBadge status={selectedApp.status} /></div>
                <div><strong>Payment:</strong> ₹{selectedApp.fee_amount || 50} ({selectedApp.payment_status || 'PAID'})</div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', color: 'var(--ux4g-primary)', marginBottom: '0.75rem' }}>
              Statutory Workflow Progression (RTS Act)
            </h4>

            {/* Render authentic tracking history if present */}
            <div style={{ borderLeft: '3px solid var(--ux4g-primary)', paddingLeft: '1.25rem', marginLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Array.isArray(selectedApp.tracking_history) && selectedApp.tracking_history.length > 0 ? (
                selectedApp.tracking_history.map((step, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ fontWeight: 600, color: step.status === 'REJECTED' ? 'var(--ux4g-danger)' : 'var(--ux4g-primary)', fontSize: '0.9rem' }}>
                      {step.step}. {step.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.15rem' }}>
                      {step.description}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>
                      {new Date(step.date).toLocaleString('en-IN')} &bull; Officer / Actor: <strong>{step.actor}</strong>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ux4g-primary)' }}>1. Application Inward &amp; Electronic Acknowledgement</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                      {new Date(selectedApp.submission_date || Date.now()).toLocaleDateString('en-IN')} &bull; e-Challan validated
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: ['IN_REVIEW', 'UNDER_REVIEW', 'APPROVED', 'ISSUED'].includes(selectedApp.status) ? 'var(--ux4g-primary)' : '#94a3b8' }}>
                      2. Revenue Circle Desk &amp; Field Verification
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                      Assigned to Talathi / Mandal Adhikari for jurisdictional verification
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: ['APPROVED', 'ISSUED'].includes(selectedApp.status) ? 'var(--ux4g-success)' : '#94a3b8' }}>
                      3. Statutory Decision &amp; Digital Certificate Dispatch
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                      {selectedApp.status === 'APPROVED' || selectedApp.status === 'ISSUED' ? 'Signed extract delivered to Citizen Vault' : 'Pending final officer sign-off'}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <Button variant="primary" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Application Modal with Real Workflows */}
      {showNewAppModal && (
        <Modal
          isOpen={showNewAppModal}
          onClose={() => setShowNewAppModal(false)}
          title="Apply for Government Revenue Service"
        >
          <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errorMsg && (
              <Alert variant="danger">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={16} />
                  {errorMsg}
                </span>
              </Alert>
            )}

            {/* 1. Applicant Information (Section 4) */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <User size={16} color="var(--ux4g-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Applicant Information (Form 1)
                </span>
                <Badge variant="success">Authenticated Citizen</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Full Legal Name</label>
                  <input className="ux4g-input" value={currentCitizen.name || ''} readOnly style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Mobile Number</label>
                  <input className="ux4g-input" value={currentCitizen.mobile || ''} readOnly style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Email Address</label>
                  <input className="ux4g-input" value={currentCitizen.email || ''} readOnly style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Postal Address</label>
                  <input
                    className="ux4g-input"
                    value={applicantAddress}
                    onChange={(e) => setApplicantAddress(e.target.value)}
                    placeholder="Enter communication address"
                  />
                </div>
              </div>
            </div>

            {/* 2. Service Selection */}
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Select Statutory Revenue Service</label>
              <select
                className="ux4g-select"
                value={formTypeCode}
                onChange={(e) => setFormTypeCode(e.target.value)}
                required
              >
                {servicesList.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.title} &mdash; Fee: ₹{s.fee || 50} (SLA: {s.sla_days || 15} Days)
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Real Parcel Selector (Section 5) */}
            <ParcelSelector
              value={selectedUlpin}
              onChange={handleParcelChange}
              required={true}
              label="Target Cadastral Parcel (ULPIN / Gat Number)"
              helperText="Authoritative parcel selected from your Form 8A Khata ledger"
            />

            {/* 4. Jurisdiction Auto-populated */}
            {selectedParcelObj && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--ux4g-primary)' }}>
                  <MapPin size={15} />
                  Jurisdictional Competency (Auto-populated from Cadastral Mesh)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
                  <div>State: <strong>{selectedParcelObj.state_code || selectedParcelObj.stateCode || 'Maharashtra'}</strong></div>
                  <div>District: <strong>{selectedParcelObj.district_code || selectedParcelObj.districtCode || 'Pune'}</strong></div>
                  <div>Tehsil: <strong>{selectedParcelObj.tehsil || selectedParcelObj.tehsil_code || 'Haveli'}</strong></div>
                  <div>Village: <strong>{selectedParcelObj.village_name || selectedParcelObj.villageName}</strong></div>
                </div>
              </div>
            )}

            {/* 5. Document Upload Zone (Section 6) */}
            <DocumentUploadZone
              title="Supporting Document (Proof of Identity / Ownership / Purpose)"
              documentType="Application Attachment"
              parcelUlpin={selectedUlpin}
              onUploadSuccess={(doc) => setUploadedDoc(doc)}
              onRemove={() => setUploadedDoc(null)}
              required={false}
            />

            {/* 6. Remarks */}
            <div className="ux4g-form-group">
              <label className="ux4g-label">Specific Application Purpose / Remarks</label>
              <textarea
                className="ux4g-textarea"
                rows={2}
                placeholder="State specific purpose (e.g. Bank Crop Loan, Boundary Demarcation, Civil Litigation, Title Verification)..."
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowNewAppModal(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting || !selectedUlpin}>
                {submitting ? (
                  'Submitting to Revenue Database...'
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Submit Statutory Service Request
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

export default ApplicationsPage;
