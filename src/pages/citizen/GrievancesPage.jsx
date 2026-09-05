import React, { useState } from 'react';
import {
  Scale,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import citizensData from '../../data/users/citizens.json';
import grievancesData from '../../data/grievances/grievances.json';
import parcelsData from '../../data/parcels/parcels.json';
import ownershipData from '../../data/parcels/ownership.json';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/common/StatusBadge';

export const GrievancesPage = () => {
  const { user } = useAuth();
  const currentCitizen =
    citizensData.find((c) => c.id === user?.id) ||
    citizensData[0];

  const [grievancesList, setGrievancesList] = useState(grievancesData);
  const [showLodgeModal, setShowLodgeModal] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');

  // Form State
  const [formCategory, setFormCategory] = useState('Delayed Mutation');
  const [formParcelId, setFormParcelId] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const userHoldings = ownershipData.filter((o) => o.ownerId === currentCitizen.id);
  const userGrievances = grievancesList.filter((g) => g.citizenId === currentCitizen.id);

  const handleLodgeGrievance = (e) => {
    e.preventDefault();
    const newGrvId = `GRV-0${String(grievancesList.length + 1).padStart(2, '0')}`;
    const newGrievance = {
      id: newGrvId,
      citizenId: currentCitizen.id,
      parcelId: formParcelId || userHoldings[0]?.parcelId || 'ULPIN-MH-PUN-000001',
      category: formCategory,
      subject: formSubject,
      status: 'PENDING',
      createdDate: new Date().toISOString().split('T')[0],
      resolutionDate: null,
      officerRemarks: 'Assigned to Tehsildar Public Grievance Officer for preliminary inquiry.',
    };

    setGrievancesList([newGrievance, ...grievancesList]);
    setShowLodgeModal(false);
    setFormSubject('');
    setFormDescription('');
    setSuccessAlert(`Grievance ticket registered! Tracking Ticket ID: ${newGrvId}`);
    setTimeout(() => setSuccessAlert(''), 7000);
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
            Land Grievances & Disputes
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Escalate mutation delays, unauthorized pencil entries, spelling errors on Form 7/12, or surveyor boundary issues.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowLodgeModal(true)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} />
            Lodge New Grievance
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

      {/* Grievance Tickets List */}
      {userGrievances.length === 0 ? (
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
            You have not raised any grievances. If you face delays or issues with your land records, lodge a ticket above.
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
          {userGrievances.map((item) => {
            const parcel = parcelsData.find((p) => p.ulpin === item.parcelId) || {};
            return (
              <Card key={item.id} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
                        TICKET ID: {item.id}
                      </span>
                      <StatusBadge status={item.status} />
                      <Badge variant="neutral">{item.category}</Badge>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>
                      {item.subject}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>
                    Lodged: {item.createdDate}
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
                    <strong>Affected Parcel:</strong> <code>{item.parcelId}</code> {parcel.villageName && `(${parcel.villageName}, Gat ${parcel.gatNumber})`}
                  </div>
                  <div style={{ color: 'var(--ux4g-text-secondary)' }}>
                    <strong>Officer Action:</strong> {item.officerRemarks || 'Inquiry initiated by Sub-Divisional Officer (SDO).'}
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
          <form onSubmit={handleLodgeGrievance}>
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Grievance Category</label>
              <select
                className="ux4g-select"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                required
              >
                <option value="Delayed Mutation">Delayed Mutation (Exceeded 15-day SLA)</option>
                <option value="Unauthorized Entry Dispute">Unauthorized Entry / Third-Party Claim</option>
                <option value="Name / Share Correction on 7/12">Name / Share / Area Correction on Form 7/12</option>
                <option value="Mojani Surveyor Boundary Dispute">Mojani Surveyor Boundary Measurement Dispute</option>
                <option value="Illegal Encumbrance Lien">Unrecognized Bank Lien / Encumbrance</option>
              </select>
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Select Affected Land Parcel</label>
              <select
                className="ux4g-select"
                value={formParcelId}
                onChange={(e) => setFormParcelId(e.target.value)}
                required
              >
                <option value="">Select parcel...</option>
                {userHoldings.map((h) => {
                  const p = parcelsData.find((item) => item.ulpin === h.parcelId) || {};
                  return (
                    <option key={h.parcelId} value={h.parcelId}>
                      {h.parcelId} — {p.villageName} (Gat {p.gatNumber || p.surveyNumber})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Grievance Subject</label>
              <input
                type="text"
                className="ux4g-input"
                placeholder="Brief summary of dispute or complaint..."
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                required
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Detailed Description & Evidence</label>
              <textarea
                className="ux4g-textarea"
                rows={3}
                placeholder="State relevant facts, previous application numbers, or dates..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowLodgeModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Register Grievance
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

export default GrievancesPage;
