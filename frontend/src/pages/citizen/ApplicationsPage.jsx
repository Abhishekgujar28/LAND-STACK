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
  Copy,
  X,
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
  const [copiedUlpin, setCopiedUlpin] = useState(false);
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="ux4g-skeleton-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div className="ux4g-skeleton" style={{ width: 60, height: 22, borderRadius: 6 }} />
                <div className="ux4g-skeleton" style={{ width: 80, height: 22, borderRadius: 6 }} />
              </div>
              <div className="ux4g-skeleton-line" style={{ width: '80%', height: 15 }} />
              <div className="ux4g-skeleton-line" style={{ width: '60%' }} />
              <div className="ux4g-skeleton-line" style={{ width: '45%', marginTop: '0.25rem' }} />
            </div>
          ))}
        </div>
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
        <div
          className="ux4g-modal-backdrop"
          onClick={() => setSelectedApp(null)}
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 1100, padding: '1rem' }}
        >
          <div
            className="ux4g-modal-container"
            style={{
              maxWidth: '630px',
              width: '100%',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={22} color="#047857" strokeWidth={2.2} />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Application Dossier:{' '}
                  <span style={{ color: '#047857' }}>
                    {selectedApp.application_number || selectedApp.id || 'APP-2026-60997'}
                  </span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                aria-label="Close modal"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: '1.5rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {/* Service Title & Status Badge Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: 1.35,
                    }}
                  >
                    {selectedApp.application_types?.title ||
                      selectedApp.service_title ||
                      selectedApp.serviceName ||
                      'Issuance of Digitally Signed 7/12 RoR & 8A Extract'}
                  </h2>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      marginTop: '0.35rem',
                      fontSize: '0.85rem',
                      color: '#64748b',
                    }}
                  >
                    <span>
                      ULPIN: <strong style={{ color: '#334155' }}>{selectedApp.parcel_ulpin || selectedApp.parcelId || 'TEST_ULPIN_MH_PUN_001'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const val = selectedApp.parcel_ulpin || selectedApp.parcelId || 'TEST_ULPIN_MH_PUN_001';
                        navigator.clipboard?.writeText(val);
                        setCopiedUlpin(true);
                        setTimeout(() => setCopiedUlpin(false), 2000);
                      }}
                      title="Copy ULPIN"
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '3px 6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                      }}
                    >
                      {copiedUlpin ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: '#dcfce7',
                    color: '#166534',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }} />
                  {selectedApp.status || 'SUBMITTED'}
                </div>
              </div>

              {/* KPI / 3 Metrics Cards */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                }}
              >
                {/* Metric 1: Submission Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Calendar size={22} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, marginBottom: '2px' }}>
                      Submission Date
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      {(() => {
                        const d = selectedApp.submission_date ? new Date(selectedApp.submission_date) : new Date();
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Metric 2: Statutory Fee */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#059669', lineHeight: 1 }}>₹</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, marginBottom: '2px' }}>
                      Statutory Fee
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{selectedApp.fee_amount || 20}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                      (e-Challan Paid)
                    </div>
                  </div>
                </div>

                {/* Metric 3: RTS SLA Target */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={22} color="#2563eb" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, marginBottom: '2px' }}>
                      RTS SLA Target
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      {selectedApp.sla_days || 15} Statutory Days
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Header: Application Status */}
              <div>
                <h4
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#064e3b',
                    margin: '0.25rem 0 1rem 0',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Application Status
                </h4>

                {/* Timeline / Stepper Progression */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Step 1: Application Inward & Acknowledgement */}
                  <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                    {/* Left Timeline Indicator */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', flexShrink: 0 }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#16a34a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 0 0 3px #dcfce7',
                        }}
                      >
                        <Check size={14} color="#ffffff" strokeWidth={3} />
                      </div>
                      <div
                        style={{
                          width: '2px',
                          flexGrow: 1,
                          minHeight: '24px',
                          background: '#16a34a',
                          margin: '4px 0',
                        }}
                      />
                    </div>

                    {/* Step Card */}
                    <div
                      style={{
                        flexGrow: 1,
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '12px',
                        padding: '0.85rem 1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                          1. Application Inward &amp; Acknowledgement
                        </div>
                        <span
                          style={{
                            background: '#dcfce7',
                            color: '#166534',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.75rem',
                            borderRadius: '9999px',
                          }}
                        >
                          Completed
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                        <Calendar size={14} color="#059669" />
                        <span>
                          {(() => {
                            const d = selectedApp.submission_date ? new Date(selectedApp.submission_date) : new Date();
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
                          })()}{' '}
                          | Inward Reference Generated
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: SRO Officer Review & Slot Scheduling */}
                  <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                    {/* Left Timeline Indicator */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', flexShrink: 0 }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: '3px solid #3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 0 0 3px #dbeafe',
                        }}
                      >
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
                      </div>
                      <div
                        style={{
                          width: '0px',
                          flexGrow: 1,
                          minHeight: '24px',
                          borderLeft: '2px dashed #cbd5e1',
                          margin: '4px 0',
                        }}
                      />
                    </div>

                    {/* Step Card */}
                    <div
                      style={{
                        flexGrow: 1,
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '12px',
                        padding: '0.85rem 1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                          2. SRO Officer Review &amp; Slot Scheduling
                        </div>
                        <span
                          style={{
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.75rem',
                            borderRadius: '9999px',
                          }}
                        >
                          {selectedApp.appointment ? 'Scheduled' : 'In Progress'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                        <Clock size={14} color="#3b82f6" />
                        <span>
                          {selectedApp.appointment
                            ? `Slot assigned for ${selectedApp.appointment.date} @ ${selectedApp.appointment.timeSlot}`
                            : 'Awaiting SRO capacity scheduling'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: In-Person Deed Verification & Final Registration */}
                  <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                    {/* Left Timeline Indicator */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', flexShrink: 0 }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }} />
                      </div>
                    </div>

                    {/* Step Card */}
                    <div
                      style={{
                        flexGrow: 1,
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        borderRadius: '12px',
                        padding: '0.85rem 1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                          3. In-Person Deed Verification &amp; Final Registration
                        </div>
                        <span
                          style={{
                            background: '#f1f5f9',
                            color: '#64748b',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.75rem',
                            borderRadius: '9999px',
                          }}
                        >
                          {['APPROVED', 'ISSUED', 'COMPLETED'].includes(selectedApp.status) ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                        <FileText size={14} color="#94a3b8" />
                        <span>Visit SRO office on scheduled date with original documents</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  style={{
                    background: '#064e3b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.65rem 2rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#04382a')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '#064e3b')}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
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
