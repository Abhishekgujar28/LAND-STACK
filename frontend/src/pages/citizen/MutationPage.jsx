import React, { useState, useEffect } from 'react';
import {
  GitPullRequest,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  FileText,
  Layers,
  X,
  User,
  MapPin,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import citizenService from '../../services/citizenService';
import mutationService from '../../services/mutationService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Timeline from '../../components/citizen/Timeline';
import ParcelSelector from '../../components/parcel/ParcelSelector';
import DocumentUploadZone from '../../components/common/DocumentUploadZone';

const MUTATION_TYPES = [
  { value: 'Sale Deed Mutation', label: 'Sale Deed Mutation (Kharedi Khat — SRO Push)' },
  { value: 'Succession / Heirship', label: 'Succession / Heirship (Waras — Legal Heir Incorporation)' },
  { value: 'Partition', label: 'Family Partition (Vatasni)' },
  { value: 'Gift Deed', label: 'Gift Deed (Bakshis Patra)' },
  { value: 'Exchange', label: 'Land Exchange (Adal Badal)' },
  { value: 'Court Order', label: 'Civil / Revenue Court Order' },
];

export const MutationPage = () => {
  const { user } = useAuth();
  const currentCitizen = user || {};

  const [activeTab, setActiveTab] = useState('MY');
  const [selectedTimelineMutation, setSelectedTimelineMutation] = useState(null);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form state
  const [selectedUlpin, setSelectedUlpin] = useState('');
  const [selectedParcelObj, setSelectedParcelObj] = useState(null);
  const [formMutationType, setFormMutationType] = useState(MUTATION_TYPES[0].value);
  const [buyerName, setBuyerName] = useState(currentCitizen.name || '');
  const [sellerName, setSellerName] = useState('');
  const [deedNumber, setDeedNumber] = useState('');
  const [formRemarks, setFormRemarks] = useState('');
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const [mutationsList, setMutationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMutations = async () => {
    setLoading(true);
    try {
      const res = await mutationService.getMutations();
      const list = Array.isArray(res) ? res : res?.items || [];
      setMutationsList(list);
    } catch (err) {
      console.warn('[MutationPage] Error fetching mutations:', err);
      setMutationsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMutations();
  }, [currentCitizen.id]);

  const myMutations = mutationsList.filter((m) => {
    const appName = m.applicant_name || m.applicantName || m.initiatedBy || '';
    const appId = m.applicant_id || m.applicantId || m.citizenId || '';
    const buyer = m.buyer_name || m.buyerName || '';
    const citizenId = currentCitizen.id || '';
    const citizenName = currentCitizen.name || '';

    return (
      (citizenId && appId === citizenId) ||
      (citizenName && appName.toLowerCase().includes(citizenName.toLowerCase())) ||
      (citizenName && buyer.toLowerCase().includes(citizenName.toLowerCase()))
    );
  });

  const handleParcelChange = (ulpin, parcel) => {
    setSelectedUlpin(ulpin);
    setSelectedParcelObj(parcel);
    if (parcel?.currentOwner) {
      setSellerName(parcel.currentOwner);
    }
  };

  const handleOpenTimeline = async (mutation) => {
    setSelectedTimelineMutation(mutation);
    setLoadingTimeline(true);

    try {
      const dbSteps = await mutationService.getMutationTimeline(mutation.id);
      if (Array.isArray(dbSteps) && dbSteps.length > 0) {
        const formatted = dbSteps.map((s) => ({
          title: s.title,
          date: s.completed_at ? new Date(s.completed_at).toLocaleDateString('en-IN') : 'In Progress',
          description: s.description,
          actor: s.officer_name || s.officer_role || 'Revenue Officer',
          status: s.completed ? 'COMPLETED' : s.active ? 'CURRENT' : 'PENDING',
        }));
        setTimelineSteps(formatted);
      } else {
        setTimelineSteps(getFallbackSteps(mutation));
      }
    } catch (err) {
      console.warn('[MutationPage] Could not load timeline steps:', err);
      setTimelineSteps(getFallbackSteps(mutation));
    } finally {
      setLoadingTimeline(false);
    }
  };

  const handleApplyMutation = async (e) => {
    e.preventDefault();
    if (!selectedUlpin) {
      setErrorMsg('Please select a registered land parcel for this mutation.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      parcelUlpin: selectedUlpin,
      type: formMutationType,
      buyerName: buyerName || currentCitizen.name,
      sellerName: sellerName || selectedParcelObj?.currentOwner || 'Previous Landholder',
      remarks: formRemarks || `Application for ${formMutationType} under MLRC Section 148-154.`,
      formData: {
        deedNumber: deedNumber || 'SRO-PENDING',
        documentId: uploadedDoc?.id || null,
        gatNumber: selectedParcelObj?.gat_number || selectedParcelObj?.gatNumber || selectedParcelObj?.survey_number,
        village: selectedParcelObj?.village_name || selectedParcelObj?.villageName,
        tehsil: selectedParcelObj?.tehsil || selectedParcelObj?.tehsil_code || 'Haveli',
        area: selectedParcelObj?.area,
      },
    };

    try {
      const res = await mutationService.createMutation(payload);
      setShowApplyModal(false);
      setSubmissionSuccess({
        mutationNumber: res.mutation_number || res.mutationNumber || res.id,
        parcelUlpin: selectedUlpin,
        type: formMutationType,
        status: res.status || 'INITIATED',
        filingDate: new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }),
        nextStep: 'Talathi Verification & Form 135D Statutory 15-Day Public Notice Generation',
      });
      // Reset
      setFormRemarks('');
      setDeedNumber('');
      setUploadedDoc(null);
      // Refresh list
      fetchMutations();
    } catch (err) {
      console.error('[MutationPage] Submission error:', err);
      setErrorMsg(err.message || 'Failed to submit e-Ferfar mutation. Please review details.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFallbackSteps = (mutation) => {
    const isApproved = mutation.status === 'APPROVED' || mutation.status === 'SANCTIONED';
    const isNoticeEnded = mutation.notice_period_ended || mutation.noticePeriodEnded;
    const filingDate = mutation.applied_date || mutation.filing_date || mutation.filingDate || 'Today';

    return [
      {
        title: 'Application Inward & SRO Electronic Transfer',
        date: new Date(filingDate).toLocaleDateString('en-IN'),
        description: `e-Hakk registration submitted for ${mutation.type || mutation.mutation_type || 'Mutation'}.`,
        actor: mutation.applicant_name || mutation.applicantName || 'Citizen Applicant',
        status: 'COMPLETED',
      },
      {
        title: 'Form 6 Provisional Pencil Entry (कच्ची नोंद)',
        date: 'Inward Stage',
        description: 'Talathi acknowledges inward and generates provisional pencil entry in village e-Ferfar register.',
        actor: 'Talathi Office',
        status: 'COMPLETED',
      },
      {
        title: 'Talathi Physical Field Verification & GPS Panchnama',
        date: 'Field Stage',
        description: 'Verification of possession, boundary demarcation stones, and non-agricultural restrictions.',
        actor: 'Talathi / Circle Inspector',
        status: isApproved ? 'COMPLETED' : 'CURRENT',
      },
      {
        title: 'Statutory Form 135D Public Objection Notice (15 Days)',
        date: isNoticeEnded ? 'Notice Completed' : 'Active 15-Day Window',
        description: 'Notice served to all recorded co-sharers, adjoining landholders, and published on notice board.',
        actor: 'Revenue Department e-Ferfar Portal',
        status: isNoticeEnded ? 'COMPLETED' : 'IN_PROGRESS',
      },
      {
        title: 'Tehsildar Statutory Sanction Order (Class-3 DSC)',
        date: isApproved ? (mutation.sanction_date || 'Approved') : 'Pending',
        description: isApproved ? 'Sanction order signed digitally by Executive Magistrate.' : 'Awaiting final bench order from Tehsildar.',
        actor: 'Tehsildar / Executive Magistrate',
        status: isApproved ? 'COMPLETED' : 'PENDING',
      },
      {
        title: 'Final 7/12 RoR Delivery (पक्की नोंद)',
        date: isApproved ? 'Delivered' : 'Pending',
        description: isApproved ? 'Permanent entry updated in record of rights and delivered to Citizen Vault.' : 'Awaiting sanction.',
        actor: 'e-Mahabhumi Digital Records',
        status: isApproved ? 'COMPLETED' : 'PENDING',
      },
    ];
  };

  const displayedMutations = activeTab === 'MY' ? myMutations : mutationsList;

  return (
    <div className="page-mutation" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              e-Ferfar Electronic Mutation Mesh
            </span>
            <Badge variant="primary">MLRC Section 148-154</Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
            Land Record Mutations (e-Ferfar)
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Authoritative tracking of statutory e-Ferfar mutation proceedings, Form 135D public objection notices, and digital 7/12 updation.
          </p>
        </div>

        <Button variant="primary" onClick={() => { setErrorMsg(null); setShowApplyModal(true); }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} />
            Apply for New Mutation (e-Hakk)
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
                e-Ferfar Mutation Registered Successfully in State Registry
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Statutory Mutation Number:</span>
                  <strong style={{ fontFamily: 'var(--ux4g-font-mono)', fontSize: '0.95rem' }}>{submissionSuccess.mutationNumber}</strong>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Transaction Type:</span>
                  <strong>{submissionSuccess.type}</strong>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Target Cadastral Parcel:</span>
                  <code style={{ fontSize: '0.85rem' }}>{submissionSuccess.parcelUlpin}</code>
                </div>
                <div>
                  <span style={{ color: '#15803d', display: 'block', fontSize: '0.75rem' }}>Current State:</span>
                  <Badge variant="info">{submissionSuccess.status}</Badge>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#14532d' }}>
                <strong>Statutory Next Step:</strong> {submissionSuccess.nextStep}
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)' }}>
        <button
          type="button"
          onClick={() => setActiveTab('MY')}
          style={{
            padding: '0.6rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'MY' ? '3px solid var(--ux4g-primary)' : '3px solid transparent',
            background: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: activeTab === 'MY' ? 'var(--ux4g-primary)' : 'var(--ux4g-text-secondary)',
            cursor: 'pointer',
            transition: 'all var(--ux4g-transition-fast)',
          }}
        >
          My Land Mutations ({myMutations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          style={{
            padding: '0.6rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'ALL' ? '3px solid var(--ux4g-primary)' : '3px solid transparent',
            background: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: activeTab === 'ALL' ? 'var(--ux4g-primary)' : 'var(--ux4g-text-secondary)',
            cursor: 'pointer',
            transition: 'all var(--ux4g-transition-fast)',
          }}
        >
          Village Notice Board &amp; Public Notices ({mutationsList.length})
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <Card style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>Loading e-Ferfar mutation proceedings from database...</p>
          </Card>
        ) : displayedMutations.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center', color: 'var(--ux4g-text-muted)' }}>
            {activeTab === 'MY'
              ? 'No mutation proceedings registered under your ownership yet. Click "Apply for New Mutation" to record a title transfer.'
              : 'No mutation records found in the village registry.'}
          </Card>
        ) : (
          displayedMutations.map((mutation) => {
            const mutNumber = mutation.mutation_number || mutation.mutationNumber || mutation.id;
            const mutType = mutation.type || mutation.mutation_type || mutation.mutationType || 'Title Transfer';
            const ulpin = mutation.parcel_ulpin || mutation.parcelId || 'N/A';
            const applicant = mutation.applicant_name || mutation.applicantName || mutation.initiatedBy || 'Applicant';
            const filingDate = mutation.applied_date || mutation.filing_date || mutation.filingDate || 'N/A';

            return (
              <Card key={mutation.id} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
                        MUTATION NUMBER
                      </span>
                      <StatusBadge status={mutation.status} />
                      <Badge variant={mutation.status === 'APPROVED' ? 'success' : 'warning'}>
                        SLA: {mutation.sla_days || 30} Days (RTS)
                      </Badge>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--ux4g-primary)', fontFamily: 'var(--ux4g-font-mono)', fontWeight: 700 }}>
                      {mutNumber}
                    </h3>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ux4g-text)', marginTop: '0.2rem' }}>
                      {mutType}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="outline" size="sm" onClick={() => handleOpenTimeline(mutation)}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        Step-by-Step Timeline
                        <ArrowRight size={13} />
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Attributes */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.75rem',
                    background: 'var(--ux4g-surface-muted)',
                    padding: '0.85rem',
                    borderRadius: 'var(--ux4g-radius-md)',
                    fontSize: '0.825rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Target Parcel:</span>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--ux4g-font-mono)' }}>{ulpin}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Applicant / Khatedar:</span>
                    <div style={{ fontWeight: 500 }}>{applicant}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                      Filing Date: {new Date(filingDate).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Parties:</span>
                    <div style={{ fontWeight: 500 }}>
                      From: <strong>{mutation.seller_name || 'Owner'}</strong> &rarr; To: <strong>{mutation.buyer_name || applicant}</strong>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Sanction Status:</span>
                    <div style={{ fontWeight: 500, color: mutation.status === 'APPROVED' ? 'var(--ux4g-success)' : 'inherit' }}>
                      {mutation.status === 'APPROVED' ? 'Sanction Order Executed' : 'Under Officer Scrutiny'}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Timeline Modal */}
      {selectedTimelineMutation && (
        <Modal
          isOpen={!!selectedTimelineMutation}
          onClose={() => setSelectedTimelineMutation(null)}
          title={`e-Ferfar Statutory Progression — ${selectedTimelineMutation.mutation_number || selectedTimelineMutation.mutationNumber || selectedTimelineMutation.id}`}
        >
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ marginBottom: '1.25rem', background: 'var(--ux4g-primary-light, #e0f2fe)', padding: '0.75rem 1rem', borderRadius: 'var(--ux4g-radius-md)', fontSize: '0.85rem' }}>
              <div><strong>Type:</strong> {selectedTimelineMutation.type || selectedTimelineMutation.mutation_type}</div>
              <div><strong>Parcel:</strong> <code>{selectedTimelineMutation.parcel_ulpin || selectedTimelineMutation.parcelId}</code></div>
              <div style={{ marginTop: '0.25rem' }}><strong>Status:</strong> <StatusBadge status={selectedTimelineMutation.status} /></div>
            </div>

            {loadingTimeline ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                Loading timeline steps from database audit trail...
              </div>
            ) : (
              <Timeline steps={timelineSteps} />
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <Button variant="primary" onClick={() => setSelectedTimelineMutation(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Mutation Modal with Real Workflow */}
      {showApplyModal && (
        <Modal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          title="Apply for e-Ferfar Mutation (e-Hakk Online)"
        >
          <form onSubmit={handleApplyMutation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errorMsg && (
              <Alert variant="danger">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={16} />
                  {errorMsg}
                </span>
              </Alert>
            )}

            {/* 1. Applicant Profile */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <User size={16} color="var(--ux4g-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Applicant / Transferee Details
                </span>
                <Badge variant="success">Authenticated Citizen</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Applicant / Transferee Name</label>
                  <input
                    className="ux4g-input"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="ux4g-label" style={{ fontSize: '0.75rem' }}>Transferor / Recorded Owner Name</label>
                  <input
                    className="ux4g-input"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="Auto-filled from selected parcel"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Parcel Selector */}
            <ParcelSelector
              value={selectedUlpin}
              onChange={handleParcelChange}
              required={true}
              label="Subject Land Parcel (ULPIN / Gat Number)"
              helperText="Authoritative parcel where title alteration is sought"
            />

            {/* 3. Transaction Type */}
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Mutation Transaction Type (MLRC)</label>
              <select
                className="ux4g-select"
                value={formMutationType}
                onChange={(e) => setFormMutationType(e.target.value)}
                required
              >
                {MUTATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Registered Deed Number */}
            <div className="ux4g-form-group">
              <label className="ux4g-label">Registered Deed / SRO Document Number (If Applicable)</label>
              <input
                type="text"
                className="ux4g-input"
                placeholder="e.g. HAV-5-2026-00892"
                value={deedNumber}
                onChange={(e) => setDeedNumber(e.target.value)}
              />
            </div>

            {/* 5. Document Upload Zone */}
            <DocumentUploadZone
              title="Upload Registered Sale Deed / Index-II / Heirship Affidavit"
              documentType="Mutation Deed"
              parcelUlpin={selectedUlpin}
              onUploadSuccess={(doc) => setUploadedDoc(doc)}
              onRemove={() => setUploadedDoc(null)}
              required={false}
            />

            {/* 6. Remarks */}
            <div className="ux4g-form-group">
              <label className="ux4g-label">Statement of Claim / Family Tree / Consideration</label>
              <textarea
                className="ux4g-textarea"
                rows={2}
                placeholder="Provide family tree details, consideration paid, or legal basis for mutation..."
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowApplyModal(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting || !selectedUlpin}>
                {submitting ? (
                  'Recording e-Ferfar Mutation...'
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Submit Statutory e-Ferfar
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

export default MutationPage;
