import React, { useState } from 'react';
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase' }}>
              Citizen Grievance Redressal (e-Lokshahi)
            </span>
            <Badge variant="warning">District Collectorate Escort</Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0 }}>
            Land Grievances & Disputes
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Escalate mutation delays, unauthorized pencil entries, spelling errors on Form 7/12, or surveyor boundary issues.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowLodgeModal(true)}>
          + Lodge New Grievance
        </Button>
      </div>

      {successAlert && <Alert variant="success">{successAlert}</Alert>}

      {/* Grievance Tickets List */}
      {userGrievances.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚖️</div>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--ux4g-primary)' }}>No Active Grievance Tickets</h3>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: '0 auto 1.25rem', maxWidth: '420px', fontSize: '0.9rem' }}>
            You have not raised any grievances. If you face delays or issues with your land records, lodge a ticket above.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowLodgeModal(true)}>
            + Lodge a Grievance
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {userGrievances.map((item) => {
            const parcel = parcelsData.find((p) => p.ulpin === item.parcelId) || {};
            return (
              <Card key={item.id} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
                        TICKET: {item.id}
                      </span>
                      <StatusBadge status={item.status} />
                      <Badge variant="primary">{item.category}</Badge>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--ux4g-primary)' }}>
                      {item.subject}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>
                    Filed: <strong>{item.createdDate}</strong>
                    {item.resolutionDate && <span> &bull; Resolved: <strong>{item.resolutionDate}</strong></span>}
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginBottom: '0.75rem' }}>
                  Associated Parcel: <strong style={{ fontFamily: 'var(--ux4g-font-mono)' }}>{item.parcelId}</strong>
                  {parcel.villageName && ` (${parcel.villageName}, Gat ${parcel.gatNumber})`}
                </div>

                {item.officerRemarks && (
                  <div
                    style={{
                      background: 'var(--ux4g-surface-muted)',
                      padding: '0.75rem',
                      borderRadius: 'var(--ux4g-radius-sm)',
                      fontSize: '0.825rem',
                      borderLeft: '3px solid var(--ux4g-primary)',
                    }}
                  >
                    <strong>Revenue Officer Remarks / Action Taken:</strong>
                    <div style={{ marginTop: '0.25rem', color: 'var(--ux4g-text)' }}>{item.officerRemarks}</div>
                  </div>
                )}
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
          title="Lodge Revenue Grievance / Dispute Notice"
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
                <option value="Delayed Mutation">Delayed e-Ferfar Mutation</option>
                <option value="Incorrect Encumbrance">Incorrect Bank Encumbrance / Lien Entry</option>
                <option value="Unauthorized Pencil Entry">Unauthorized Pencil Entry (Form 6)</option>
                <option value="Typographical Spelling Error">Typographical Spelling Error in Name</option>
                <option value="Area Discrepancy">Area Discrepancy (Gat Book vs Map)</option>
                <option value="Encroachment on Boundaries">Boundary Encroachment / Mojani Issue</option>
                <option value="Portal Payment Failure">Payment Deducted but Extract Not Generated</option>
              </select>
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Select Associated Land Parcel (ULPIN)</label>
              <select
                className="ux4g-select"
                value={formParcelId}
                onChange={(e) => setFormParcelId(e.target.value)}
                required
              >
                <option value="">Select your owned parcel...</option>
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
              <label className="ux4g-label ux4g-label-required">Subject / Complaint Summary</label>
              <input
                type="text"
                className="ux4g-input"
                placeholder="e.g. Mutation pending for over 30 days without notice"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                required
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Detailed Statement of Facts</label>
              <textarea
                className="ux4g-input"
                rows={4}
                placeholder="Explain the grievance clearly with dates, application numbers, or officer names..."
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
                Submit Grievance to Collectorate →
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default GrievancesPage;
