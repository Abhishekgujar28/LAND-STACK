import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Plus,
  ArrowRight,
  ArrowLeft,
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
  Eye,
  Check,
  Building,
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
import DocumentUploader from '../../components/common/DocumentUploader';

const STATUTORY_SERVICES = [
  {
    code: 'APPT_ROR_EXTRACT',
    title: 'Certified Digitally Signed 7/12 RoR Extract',
    category: 'Extracts & RoR',
    fee: 50,
    sla_days: 3,
    description: 'Statutory extract under MLR Code with QR code verification and Tehsildar DSC seal.',
    requiredDoc: 'Identity Proof (Aadhaar / Voter ID / PAN)',
  },
  {
    code: 'APPT_ZONE_CERT',
    title: 'Form 8A Landholding Account Certificate',
    category: 'Extracts & RoR',
    fee: 50,
    sla_days: 3,
    description: 'Consolidated khata holding certificate across all survey numbers in the revenue circle.',
    requiredDoc: 'Proof of Landholding / Previous Khata Copy',
  },
  {
    code: 'APPT_DEMARCATION',
    title: 'Cadastral Boundary Map & e-Mojani Survey',
    category: 'Survey & Demarcation',
    fee: 1000,
    sla_days: 15,
    description: 'Official ground boundary measurement by Cadastral Surveyor using ETS/CORS rover equipment.',
    requiredDoc: 'Adjacent Landholders Consent / Possession Affidavit',
  },
  {
    code: 'APPT_NON_AGRI',
    title: 'Non-Agricultural (NA) Land Conversion Clearance',
    category: 'Planning & Conversion',
    fee: 500,
    sla_days: 30,
    description: 'Statutory Section 44 conversion clearance from Collector / SDO for residential/commercial use.',
    requiredDoc: 'Town Planning DP Zoning Extract & Architect Layout Plan',
  },
  {
    code: 'APPT_NEC',
    title: '13-Year Non-Encumbrance Certificate (NEC)',
    category: 'Due Diligence',
    fee: 200,
    sla_days: 7,
    description: 'Sub-Registrar certified search of registered encumbrances, charges, and mortgages.',
    requiredDoc: 'Self-Attested Application Form & Previous Title Deed',
  },
];

export const ApplicationsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentCitizen = user || {};

  const [applicationsList, setApplicationsList] = useState([]);
  const [servicesList, setServicesList] = useState(STATUTORY_SERVICES);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Multi-Step Workflow State: 1 = Applicant, 2 = Land, 3 = Service, 4 = Documents, 5 = Review
  const [wizardStep, setWizardStep] = useState(1);

  // Form State
  const [formTypeCode, setFormTypeCode] = useState(STATUTORY_SERVICES[0].code);
  const [selectedUlpin, setSelectedUlpin] = useState('');
  const [selectedParcelObj, setSelectedParcelObj] = useState(null);
  const [applicantAddress, setApplicantAddress] = useState(currentCitizen.address || '');
  const [formRemarks, setFormRemarks] = useState('');
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [declarationChecked, setDeclarationChecked] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getApplications();
      const list = Array.isArray(res) ? res : res?.items || res?.data || [];
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

    // Fetch dynamic service types if available
    applicationService.getApplicationTypes()
      .then((types) => {
        if (Array.isArray(types) && types.length > 0) {
          setServicesList(types);
        }
      })
      .catch((err) => {
        console.warn('[ApplicationsPage] Using statutory service catalog:', err.message);
      });

    // Check if ULPIN was passed via URL (e.g. from GIS Map "Start Service")
    const urlUlpin = searchParams.get('ulpin');
    if (urlUlpin) {
      setSelectedUlpin(urlUlpin);
      setShowNewAppModal(true);
      setWizardStep(2); // Jump straight to land verification
    }
  }, [searchParams]);

  const handleParcelChange = (ulpin, parcel) => {
    setSelectedUlpin(ulpin);
    setSelectedParcelObj(parcel);
  };

  const selectedService = servicesList.find((s) => s.code === formTypeCode) || servicesList[0];

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (wizardStep === 2 && !selectedUlpin) {
      setErrorMsg('Please select a verified land parcel to proceed.');
      return;
    }
    if (wizardStep === 4 && selectedService.requiredDoc && !uploadedDoc) {
      setErrorMsg(`Please upload the required document (${selectedService.requiredDoc}) to continue.`);
      return;
    }

    setWizardStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setWizardStep((prev) => Math.max(1, prev - 1));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedUlpin) {
      setErrorMsg('Please select a registered land parcel to link with this application.');
      return;
    }
    if (!declarationChecked) {
      setErrorMsg('Please affirm the statutory declaration before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

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
        village: selectedParcelObj?.village_name || selectedParcelObj?.villageName || selectedParcelObj?.village || 'Wagholi',
        tehsil: selectedParcelObj?.tehsil || selectedParcelObj?.tehsil_code || 'Haveli',
        district: selectedParcelObj?.district_code || selectedParcelObj?.districtCode || 'Pune',
        gatNumber: selectedParcelObj?.gat_number || selectedParcelObj?.gatNumber || selectedParcelObj?.survey_number,
        area: selectedParcelObj?.area,
        landUse: selectedParcelObj?.land_use || selectedParcelObj?.landUse || 'Agricultural',
        documentId: uploadedDoc?.id || null,
        documentTitle: uploadedDoc?.title || null,
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
        documentAttached: uploadedDoc ? uploadedDoc.title || uploadedDoc.name || 'Statutory Upload' : 'None',
      });
      // Reset form
      setWizardStep(1);
      setFormRemarks('');
      setUploadedDoc(null);
      setDeclarationChecked(false);
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

        <Button
          variant="primary"
          onClick={() => {
            setErrorMsg(null);
            setWizardStep(1);
            setShowNewAppModal(true);
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} />
            Apply for New Revenue Service
          </span>
        </Button>
      </div>

      {/* Submission Success Confirmation Banner */}
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
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Application ID:</span>
                  <strong style={{ fontFamily: 'var(--ux4g-font-mono)', fontSize: '0.95rem' }}>{submissionSuccess.applicationNumber}</strong>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Service Type:</span>
                  <strong>{submissionSuccess.serviceTitle}</strong>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Target Parcel:</span>
                  <code style={{ fontSize: '0.85rem' }}>{submissionSuccess.parcelUlpin}</code>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Current Status:</span>
                  <Badge variant="info">{submissionSuccess.status}</Badge>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#14532d' }}>
                <strong>Next Step:</strong> {submissionSuccess.nextStep} &bull; <strong>Documents Attached:</strong> {submissionSuccess.documentAttached}
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
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ux4g-text-secondary)' }}>Filing Date:</span>
                      <strong>{submissionDate}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ux4g-text-secondary)' }}>Statutory Fee:</span>
                      <strong>₹{app.fee_amount || app.feeAmount || 50}</strong>
                    </div>
                    {app.remarks && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.25rem' }}>
                        <span style={{ color: 'var(--ux4g-text-secondary)' }}>Remarks:</span>
                        <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.remarks}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderTop: '1px solid var(--ux4g-border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--ux4g-surface-muted)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>
                    RTS SLA: <strong>{app.sla_days || 15} Days</strong>
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Eye size={13} />
                      Track Application
                    </span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Application Tracking Modal */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title={`Application Dossier: ${selectedApp.application_number || selectedApp.id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>
                  {selectedApp.application_types?.title || selectedApp.type_code || selectedApp.serviceName}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                  ULPIN: <strong>{selectedApp.parcel_ulpin || selectedApp.parcelId}</strong>
                </span>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Submission Date</span>
                <strong>{new Date(selectedApp.submission_date || Date.now()).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Statutory Fee</span>
                <strong>₹{selectedApp.fee_amount || 50} (e-Challan Paid)</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>RTS SLA Target</span>
                <strong>{selectedApp.sla_days || 15} Statutory Days</strong>
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', color: 'var(--ux4g-primary)', margin: '0.5rem 0 0.25rem' }}>
              Statutory Workflow Progression (RTS Act)
            </h4>

            {/* Tracking History */}
            <div style={{ borderLeft: '3px solid var(--ux4g-primary)', paddingLeft: '1.25rem', marginLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ux4g-primary)' }}>1. Application Inward &amp; Acknowledgement</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                  {new Date(selectedApp.submission_date || Date.now()).toLocaleDateString('en-IN')} &bull; Inward Reference Generated
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
                  3. Statutory Decision &amp; Certificate Dispatch
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                  {selectedApp.status === 'APPROVED' || selectedApp.status === 'ISSUED' ? 'Signed extract delivered to Citizen Vault' : 'Pending final officer sign-off'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <Button variant="primary" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Multi-Step Application Wizard Modal */}
      {showNewAppModal && (
        <Modal
          isOpen={showNewAppModal}
          onClose={() => setShowNewAppModal(false)}
          title="Apply for Government Revenue Service"
        >
          {/* Step Progress Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            {[
              { step: 1, label: 'Applicant' },
              { step: 2, label: 'Land Parcel' },
              { step: 3, label: 'Service Info' },
              { step: 4, label: 'Documents' },
              { step: 5, label: 'Review' },
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  fontWeight: wizardStep === s.step ? 700 : 500,
                  color: wizardStep === s.step ? 'var(--ux4g-primary, #064e3b)' : wizardStep > s.step ? '#16a34a' : '#94a3b8',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: wizardStep === s.step ? 'var(--ux4g-primary, #064e3b)' : wizardStep > s.step ? '#16a34a' : '#e2e8f0',
                    color: wizardStep >= s.step ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {wizardStep > s.step ? '✓' : s.step}
                </span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <form onSubmit={wizardStep === 5 ? handleApply : handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errorMsg && (
              <Alert variant="danger">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={16} />
                  {errorMsg}
                </span>
              </Alert>
            )}

            {/* ================= STEP 1: APPLICANT ================= */}
            {wizardStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <User size={16} color="var(--ux4g-primary)" />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Applicant Details (Form 1)
                    </span>
                    <Badge variant="success">e-KYC Verified</Badge>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
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
                      <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Communication Address</label>
                      <input
                        className="ux4g-input"
                        value={applicantAddress}
                        onChange={(e) => setApplicantAddress(e.target.value)}
                        placeholder="Enter current residential address"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2: LAND PARCEL ================= */}
            {wizardStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <ParcelSelector
                  value={selectedUlpin}
                  onChange={handleParcelChange}
                  required={true}
                  label="Target Cadastral Parcel (ULPIN / Gat Number)"
                  helperText="Authoritative parcel selected from your Form 8A Khata ledger"
                />

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
                      <div>Village: <strong>{selectedParcelObj.village_name || selectedParcelObj.villageName || 'Wagholi'}</strong></div>
                      <div>Classification: <strong>{selectedParcelObj.classification || 'Jirayat'}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= STEP 3: SERVICE-SPECIFIC INFO ================= */}
            {wizardStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--ux4g-primary, #064e3b)', marginBottom: '0.25rem' }}>
                    {selectedService.title}
                  </div>
                  <p style={{ color: '#475569', margin: '0 0 0.5rem' }}>{selectedService.description}</p>
                  <div style={{ display: 'flex', gap: '1.5rem', color: '#166534', fontWeight: 600 }}>
                    <span>Statutory Fee: ₹{selectedService.fee}</span>
                    <span>Statutory SLA: {selectedService.sla_days} Days</span>
                  </div>
                </div>

                <div className="ux4g-form-group">
                  <label className="ux4g-label">Specific Application Purpose / Details</label>
                  <textarea
                    className="ux4g-textarea"
                    rows={3}
                    placeholder="State specific purpose (e.g. Bank Agriculture Loan, Boundary Demarcation, Title Verification, Legal Succession)..."
                    value={formRemarks}
                    onChange={(e) => setFormRemarks(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ================= STEP 4: DOCUMENTS ================= */}
            {wizardStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <DocumentUploader
                  title={`Upload Required: ${selectedService.requiredDoc || 'Statutory Supporting Document'}`}
                  documentType={selectedService.title}
                  parcelUlpin={selectedUlpin}
                  onUploadSuccess={(doc) => setUploadedDoc(doc)}
                  onRemove={() => setUploadedDoc(null)}
                  required={Boolean(selectedService.requiredDoc)}
                  description="Upload certified PDF extract or clear photograph (Max 5MB). Accepted: PDF, JPG, PNG."
                />
              </div>
            )}

            {/* ================= STEP 5: REVIEW & SUBMIT ================= */}
            {wizardStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', fontSize: '0.82rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem', color: 'var(--ux4g-primary)', fontSize: '0.95rem', fontWeight: 700 }}>
                    Application Summary Review
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.65rem' }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Applicant:</span>
                      <strong>{currentCitizen.name}</strong> ({currentCitizen.mobile})
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Service:</span>
                      <strong>{selectedService.title}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Target Parcel:</span>
                      <code>{selectedUlpin}</code>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Village / Tehsil:</span>
                      <strong>{selectedParcelObj?.villageName || selectedParcelObj?.village_name || 'Wagholi'}, {selectedParcelObj?.tehsil || 'Haveli'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Fee Payable:</span>
                      <strong style={{ color: '#166534' }}>₹{selectedService.fee} (e-Challan)</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Uploaded Document:</span>
                      <strong>{uploadedDoc ? (uploadedDoc.title || 'Document Verified') : 'None'}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: '#f0fdf4', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                  <input
                    type="checkbox"
                    id="declaration"
                    checked={declarationChecked}
                    onChange={(e) => setDeclarationChecked(e.target.checked)}
                    style={{ marginTop: '3px' }}
                    required
                  />
                  <label htmlFor="declaration" style={{ fontSize: '0.75rem', color: '#14532d', cursor: 'pointer' }}>
                    I solemnly declare that all particulars submitted herein are true and correct to the best of my knowledge under the Maharashtra Land Revenue Code 1966. I authorize the Revenue Department to verify title records.
                  </label>
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
              {wizardStep > 1 ? (
                <Button type="button" variant="outline" size="sm" onClick={handlePrevStep} disabled={submitting}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ArrowLeft size={14} /> Back
                  </span>
                </Button>
              ) : (
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewAppModal(false)} disabled={submitting}>
                  Cancel
                </Button>
              )}

              {wizardStep < 5 ? (
                <Button type="button" variant="primary" size="sm" onClick={handleNextStep}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    Next <ArrowRight size={14} />
                  </span>
                </Button>
              ) : (
                <Button type="submit" variant="primary" size="sm" disabled={submitting || !declarationChecked}>
                  {submitting ? 'Submitting to Database...' : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      Submit Statutory Application <ArrowRight size={14} />
                    </span>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ApplicationsPage;
