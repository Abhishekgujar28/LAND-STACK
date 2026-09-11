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
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import parcelService from '../../services/parcelService';
import mutationService from '../../services/mutationService';
import { DEFAULT_CITIZENS } from '../../context/authConstants';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Timeline from '../../components/citizen/Timeline';

export const MutationPage = () => {
  const { user } = useAuth();
  const currentCitizen = user || DEFAULT_CITIZENS[0];

  const [activeTab, setActiveTab] = useState('MY');
  const [selectedTimelineMutation, setSelectedTimelineMutation] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');

  // Form state
  const [formParcelId, setFormParcelId] = useState('');
  const [formMutationType, setFormMutationType] = useState('Sale Deed / Kharedi Khat');
  const [formDocNumber, setFormDocNumber] = useState('');
  const [formSroOffice, setFormSroOffice] = useState('SRO Haveli 5 (Pune)');
  const [formRemarks, setFormRemarks] = useState('');

  const [mutationsList, setMutationsList] = useState([]);
  const [parcelsList, setParcelsList] = useState([]);

  useEffect(() => {
    mutationService.getMutations().then((data) => {
      if (Array.isArray(data)) setMutationsList(data);
    }).catch(() => {});

    parcelService.getParcels().then((data) => {
      if (Array.isArray(data)) setParcelsList(data);
    }).catch(() => {});
  }, [currentCitizen.id]);

  const myMutations = mutationsList.filter(
    (m) =>
      (m.initiatedBy && m.initiatedBy.includes(currentCitizen.id)) ||
      (m.initiatedBy && m.initiatedBy.includes(currentCitizen.name)) ||
      (m.citizenId === currentCitizen.id)
  );

  const handleOpenTimeline = (mutation) => {
    setSelectedTimelineMutation(mutation);
  };

  const handleApplyMutation = async (e) => {
    e.preventDefault();
    const newMutId = `MUT-${String(mutationsList.length + 1).padStart(3, '0')}`;
    const newMutNum = `FERFAR-2025-0${String(100 + mutationsList.length + 1)}`;
    const newMutation = {
      id: newMutId,
      mutationNumber: newMutNum,
      parcelId: formParcelId || parcelsList[0]?.ulpin || 'ULPIN-MH-PUN-000001',
      mutationType: formMutationType,
      status: 'PENDING',
      initiatedBy: `${currentCitizen.id} (${currentCitizen.name})`,
      assignedOfficer: 'GOV-002 (Prakash Shinde)',
      sanctionedBy: null,
      noticePeriodEnded: false,
      filingDate: new Date().toISOString().split('T')[0],
      sanctionDate: null,
    };

    try {
      await mutationService.createMutation(newMutation);
    } catch {}

    setMutationsList((prev) => [newMutation, ...prev]);
    setShowApplyModal(false);
    setSuccessAlert(`e-Ferfar Mutation request registered! Mutation No: ${newMutNum}. 15-Day Form 135D notice generated.`);
    setTimeout(() => setSuccessAlert(''), 7000);
  };

  // Get timeline steps for selected mutation
  const getSteps = (mutation) => {
    if (!mutation) return [];
    return [
      {
        title: 'SRO Deed Verification & Registration',
        date: mutation.filingDate || 'Today',
        description: `Deed application for ${mutation.mutationType} audited for Ready Reckoner stamp duty & registered by Sub-Registrar.`,
        actor: 'Sub-Registrar Office (SRO)',
        status: 'COMPLETED',
      },
      {
        title: 'Form 6 Provisional Pencil Entry (कच्ची नोंद)',
        date: mutation.filingDate || 'In Progress',
        description: 'Talathi generated provisional entry in village e-Ferfar register.',
        actor: mutation.assignedOfficer || 'Talathi Wagholi',
        status: 'COMPLETED',
      },
      {
        title: 'Talathi Physical Field Visit & GPS Photo Panchnama',
        date: 'In Progress',
        description: 'Talathi visits land parcel, captures geotagged photographs with live GPS coords, and verifies boundary demarcation stones.',
        actor: 'Talathi Field Office',
        status: mutation.status === 'APPROVED' ? 'COMPLETED' : 'CURRENT',
      },
      {
        title: 'Statutory Form 135D Public Notice (15 Days)',
        date: mutation.noticePeriodEnded ? 'Notice Completed' : 'Active 15-Day Window',
        description: 'Public objection period served to co-sharers and adjoining landholders.',
        actor: 'Revenue Department Portal',
        status: mutation.noticePeriodEnded ? 'COMPLETED' : 'IN_PROGRESS',
      },
      {
        title: 'Tehsildar Statutory Sanction Order (Class-3 DSC)',
        date: mutation.sanctionDate || 'Pending',
        description: mutation.status === 'APPROVED' ? `Final sanction order signed using Class-3 DSC by ${mutation.sanctionedBy || 'Tehsildar'}` : 'Awaiting Tehsildar revenue verification and DSC signature.',
        actor: mutation.sanctionedBy || 'Tehsildar (Executive Magistrate)',
        status: mutation.status === 'APPROVED' ? 'COMPLETED' : 'PENDING',
      },
      {
        title: 'Final RoR (गाव नमुना ७/१२) & DigiLocker Delivery',
        date: mutation.sanctionDate || 'Pending',
        description: mutation.status === 'APPROVED' ? 'Permanent entry (पक्की नोंद) reflected in MahaBhulekh and pushed to Citizen DigiLocker.' : 'Awaiting sanction to issue certified 7/12 copy.',
        actor: 'e-Mahabhumi System',
        status: mutation.status === 'APPROVED' ? 'COMPLETED' : 'PENDING',
      },
    ];
  };

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
            Track statutory e-Ferfar mutation workflows, public 15-day objection notices (Form 135D), and apply online.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowApplyModal(true)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} />
            Apply for New Mutation (e-Hakk)
          </span>
        </Button>
      </div>

      {successAlert && (
        <Alert variant="success">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} />
            {successAlert}
          </span>
        </Alert>
      )}

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--ux4g-border-subtle)',
        }}
      >
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
          Village Notice Board &amp; All Mutations ({mutationsList.length})
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(activeTab === 'MY' ? myMutations : mutationsList).length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center', color: 'var(--ux4g-text-muted)' }}>
            No mutation proceedings found for this selection.
          </Card>
        ) : (
          (activeTab === 'MY' ? myMutations : mutationsList).map((mutation) => {
            const parcel = parcelsList.find((p) => p.ulpin === mutation.parcelId) || {};
            return (
              <Card key={mutation.id} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
                        MUTATION NUMBER
                      </span>
                      <StatusBadge status={mutation.status} />
                      <Badge variant={mutation.noticePeriodEnded ? 'success' : 'warning'}>
                        {mutation.noticePeriodEnded ? '15-Day Notice Completed' : '15-Day Notice Active'}
                      </Badge>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--ux4g-primary)', fontFamily: 'var(--ux4g-font-mono)', fontWeight: 700 }}>
                      {mutation.mutationNumber}
                    </h3>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ux4g-text)', marginTop: '0.2rem' }}>
                      {mutation.mutationType}
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
                    <div style={{ fontWeight: 600, fontFamily: 'var(--ux4g-font-mono)' }}>{mutation.parcelId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>{parcel.villageName || parcel.village_name} (Gat {parcel.gatNumber || parcel.gat_number || parcel.surveyNumber || parcel.survey_number})</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Initiated By:</span>
                    <div style={{ fontWeight: 500 }}>{mutation.initiatedBy}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Filing: {mutation.filingDate}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Assigned Revenue Officer:</span>
                    <div style={{ fontWeight: 500 }}>{mutation.assignedOfficer}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Sanction Authority:</span>
                    <div style={{ fontWeight: 500 }}>{mutation.sanctionedBy || 'Pending Mandal Adhikari'}</div>
                    {mutation.sanctionDate && <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-success)' }}>Sanctioned: {mutation.sanctionDate}</div>}
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
          title={`Mutation Timeline — ${selectedTimelineMutation.mutationNumber}`}
        >
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ marginBottom: '1.25rem', background: 'var(--ux4g-primary-light, #e0f2fe)', padding: '0.75rem 1rem', borderRadius: 'var(--ux4g-radius-md)', fontSize: '0.85rem' }}>
              <div><strong>Type:</strong> {selectedTimelineMutation.mutationType}</div>
              <div><strong>Parcel:</strong> <code>{selectedTimelineMutation.parcelId}</code></div>
              <div style={{ marginTop: '0.25rem' }}><strong>Status:</strong> <StatusBadge status={selectedTimelineMutation.status} /></div>
            </div>
            <Timeline steps={getSteps(selectedTimelineMutation)} />
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <Button variant="primary" onClick={() => setSelectedTimelineMutation(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Mutation Modal */}
      {showApplyModal && (
        <Modal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          title="Apply for e-Ferfar Mutation (e-Hakk Online)"
        >
          <form onSubmit={handleApplyMutation}>
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Select Land Parcel</label>
              <select
                className="ux4g-select"
                value={formParcelId}
                onChange={(e) => setFormParcelId(e.target.value)}
                required
              >
                <option value="">Select your owned parcel...</option>
                {parcelsList.map((p) => (
                  <option key={p.ulpin} value={p.ulpin}>
                    {p.ulpin} &mdash; {p.villageName || p.village_name} (Gat {p.gatNumber || p.gat_number || p.surveyNumber || p.survey_number})
                  </option>
                ))}
              </select>
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Mutation Transaction Type</label>
              <select
                className="ux4g-select"
                value={formMutationType}
                onChange={(e) => setFormMutationType(e.target.value)}
                required
              >
                <option value="Sale Deed / Kharedi Khat">Sale Deed / Kharedi Khat (Sub-Registrar Push)</option>
                <option value="Inheritance / Waras">Inheritance / Waras (Legal Heir Incorporation)</option>
                <option value="Family Partition / Vatasni">Family Partition / Vatasni</option>
                <option value="Gift Deed / Bakshis Patra">Gift Deed / Bakshis Patra</option>
                <option value="Release Deed / Hakka Sod">Release Deed / Hakka Sod</option>
                <option value="Bank Boja Charge Registration">Bank Boja Charge Registration</option>
                <option value="Area Rectification via e-Mojani">Area Rectification via e-Mojani</option>
              </select>
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Registered Deed / Document Number</label>
              <input
                type="text"
                className="ux4g-input"
                placeholder="e.g. HAV-5-2025-00456"
                value={formDocNumber}
                onChange={(e) => setFormDocNumber(e.target.value)}
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Sub-Registrar (SRO) / Revenue Office</label>
              <input
                type="text"
                className="ux4g-input"
                value={formSroOffice}
                onChange={(e) => setFormSroOffice(e.target.value)}
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Applicant Statement &amp; Legal Heirs</label>
              <textarea
                className="ux4g-textarea"
                rows={3}
                placeholder="Provide details of parties, consideration amount, or heirship relationships..."
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowApplyModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Submit e-Ferfar Application
                  <ArrowRight size={14} />
                </span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MutationPage;
