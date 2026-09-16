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
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import applicationService from '../../services/applicationService';
import parcelService from '../../services/parcelService';


import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/common/StatusBadge';

const DEFAULT_SERVICES = [
  { id: 'SRV-001', name: 'Certified Digitally Signed 7/12 RoR Extract', category: 'Extracts', type: '7/12 Extract' },
  { id: 'SRV-002', name: 'Form 8A Landholding Account Certificate', category: 'Extracts', type: '8A Extract' },
  { id: 'SRV-003', name: 'Cadastral Boundary Map & e-Mojani Survey', category: 'Survey', type: 'Mojani' },
  { id: 'SRV-004', name: 'Non-Agricultural (NA) Permission Inquiry', category: 'Conversion', type: 'NA Conversion' },
  { id: 'SRV-005', name: 'Bhu-Aadhaar ULPIN Verification Certificate', category: 'Identity', type: 'ULPIN Certificate' },
];

export const ApplicationsPage = () => {
  const { user } = useAuth();
  const currentCitizen = user;

  const [applicationsList, setApplicationsList] = useState([]);
  const [parcelsList, setParcelsList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');

  // New Application Form State
  const [formServiceId, setFormServiceId] = useState(DEFAULT_SERVICES[0].id);
  const [formParcelId, setFormParcelId] = useState('');
  const [formRemarks, setFormRemarks] = useState('');

  useEffect(() => {
    applicationService.getApplications({ citizenId: currentCitizen.id }).then((data) => {
      if (Array.isArray(data)) setApplicationsList(data);
    }).catch(() => {});

    parcelService.getParcels().then((data) => {
      if (Array.isArray(data)) setParcelsList(data);
    }).catch(() => {});
  }, [currentCitizen.id]);

  const filteredApps = applicationsList.filter(
    (a) => selectedStatus === 'ALL' || a.status === selectedStatus
  );

  const handleApply = async (e) => {
    e.preventDefault();
    const service = DEFAULT_SERVICES.find((s) => s.id === formServiceId) || DEFAULT_SERVICES[0];
    const newAppId = `APP-0${String(applicationsList.length + 1).padStart(2, '0')}`;
    const newApp = {
      id: newAppId,
      citizenId: currentCitizen.id,
      parcelId: formParcelId || parcelsList[0]?.ulpin || 'TEST_ULPIN_MH_PUN_001',
      serviceName: service.name,
      type: service.type,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      slaDays: 15,
      remarks: formRemarks || `Application for ${service.name} submitted online.`,
    };

    try {
      await applicationService.submitApplication(newApp);
    } catch (err) {
      console.warn('Submission notice:', err);
    }

    setApplicationsList((prev) => [newApp, ...prev]);
    setShowNewAppModal(false);
    setSuccessAlert(`Application submitted successfully! Tracking Application ID: ${newAppId}`);
    
  };

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
            Track certified 7/12 extracts, Mojani survey requests, Property Card, and NA permissions with statutory SLA monitoring.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowNewAppModal(true)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} />
            Apply for New Revenue Service
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

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '1px solid var(--ux4g-border-subtle)' }}>
        {[
          { key: 'ALL', label: `All Applications (${applicationsList.length})` },
          { key: 'APPROVED', label: `Approved (${applicationsList.filter((a) => a.status === 'APPROVED').length})` },
          { key: 'IN_PROGRESS', label: `In Progress (${applicationsList.filter((a) => a.status === 'IN_PROGRESS').length})` },
          { key: 'PENDING', label: `Pending (${applicationsList.filter((a) => a.status === 'PENDING').length})` },
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
      {filteredApps.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>
            No applications found matching status "{selectedStatus}".
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filteredApps.map((app) => {
            const parcel = parcelsList.find((p) => p.ulpin === app.parcelId) || {};
            return (
              <Card key={app.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)', letterSpacing: '0.04em' }}>
                        APP ID: {app.id}
                      </span>
                      <h3 style={{ margin: '0.2rem 0', fontSize: '1.1rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>
                        {app.serviceName || app.type}
                      </h3>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginBottom: '0.75rem' }}>
                    Parcel: <strong style={{ fontFamily: 'var(--ux4g-font-mono)' }}>{app.parcelId}</strong>
                    {(parcel.villageName || parcel.village_name) && ` (${parcel.villageName || parcel.village_name}, Gat ${parcel.gatNumber || parcel.gat_number || parcel.surveyNumber || parcel.survey_number})`}
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
                      <span>Applied Date:</span>
                      <strong>{app.appliedDate}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>Statutory SLA:</span>
                      <strong>{app.slaDays} Days (RTS Act)</strong>
                    </div>
                    {app.remarks && (
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--ux4g-border-subtle)', color: 'var(--ux4g-text)' }}>
                        <strong>Remarks:</strong> {app.remarks}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1.25rem', background: '#fafbfc', borderTop: '1px solid var(--ux4g-border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      Track SLA &amp; Progress
                      <ArrowRight size={13} />
                    </span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Track App Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Status Tracking — ${selectedApp.id}`}
        >
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ background: 'var(--ux4g-primary-light, #e0f2fe)', padding: '1rem', borderRadius: 'var(--ux4g-radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <div><strong>Service:</strong> {selectedApp.serviceName}</div>
              <div><strong>Target Parcel:</strong> <code>{selectedApp.parcelId}</code></div>
              <div style={{ marginTop: '0.25rem' }}><strong>Status:</strong> <StatusBadge status={selectedApp.status} /></div>
              <div><strong>Applied on:</strong> {selectedApp.appliedDate} &bull; <strong>SLA Target:</strong> {selectedApp.slaDays} Days</div>
            </div>

            <div style={{ borderLeft: '3px solid var(--ux4g-primary)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--ux4g-primary)' }}>1. Application Inward &amp; Payment Verified</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>{selectedApp.appliedDate} &bull; e-Receipt acknowledged</div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, color: selectedApp.status !== 'PENDING' ? 'var(--ux4g-primary)' : 'var(--ux4g-text-muted)' }}>
                  2. Revenue Officer Desk Scrutiny
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>Talathi / Mandal Adhikari verification</div>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: selectedApp.status === 'APPROVED' ? 'var(--ux4g-success)' : 'var(--ux4g-text-muted)' }}>
                  3. Digital Certificate Generation &amp; Dispatch
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                  {selectedApp.status === 'APPROVED' ? 'Delivered to Citizen Documents Vault' : 'Under Process'}
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

      {/* New Application Modal */}
      {showNewAppModal && (
        <Modal
          isOpen={showNewAppModal}
          onClose={() => setShowNewAppModal(false)}
          title="Apply for Government Revenue Service"
        >
          <form onSubmit={handleApply}>
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Select Revenue Service</label>
              <select
                className="ux4g-select"
                value={formServiceId}
                onChange={(e) => setFormServiceId(e.target.value)}
                required
              >
                {DEFAULT_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Select Registered Land Parcel (ULPIN)</label>
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
              <label className="ux4g-label">Additional Instructions / Remarks</label>
              <textarea
                className="ux4g-textarea"
                rows={3}
                placeholder="Mention specific purposes like bank loan, passport verification, legal reference..."
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowNewAppModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Submit Service Request
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

export default ApplicationsPage;
