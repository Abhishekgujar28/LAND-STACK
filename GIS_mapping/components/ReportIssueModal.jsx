/**
 * GIS_mapping/components/ReportIssueModal.jsx
 *
 * "Report Issue" modal for citizen GIS dashboard.
 * Issue type selection → description → submit → synthetic grievance ID (GRV-2026-XXXXX)
 */
import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle } from 'lucide-react';

const ISSUE_TYPES = [
  'Incorrect parcel location',
  'Incorrect boundary',
  'Incorrect land information',
  'Missing parcel',
  'Other',
];

let _grievanceCounter = 1;
function generateGrievanceId() {
  const n = String(_grievanceCounter++).padStart(5, '0');
  return `GRV-2026-${n}`;
}

const ReportIssueModal = ({ isOpen, onClose, parcel }) => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [grievanceId, setGrievanceId] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setIssueType('');
    setDescription('');
    setSubmitted(false);
    setGrievanceId('');
    onClose();
  };

  const handleSubmit = () => {
    const id = generateGrievanceId();
    setGrievanceId(id);
    setSubmitted(true);
  };

  const p = parcel?.properties || parcel || {};

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="issue-modal-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal-sheet">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-eyebrow">Citizen Service</div>
            <h2 id="issue-modal-title" className="modal-title">Report a Map / Record Issue</h2>
          </div>
          <button type="button" onClick={handleClose} className="modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {!submitted ? (
          <div className="modal-body">
            {/* Property context */}
            <div className="resurvey-property-card" style={{ marginBottom: '1.25rem' }}>
              <div className="resurvey-prop-row">
                <span className="resurvey-prop-label">Parcel</span>
                <span className="resurvey-prop-value">
                  {p.ulpin || 'ULPIN-MH-PUN-000001'} — Gat {p.gat_number || p.gatNumber || '42'}
                </span>
              </div>
            </div>

            {/* Issue type */}
            <div className="form-group">
              <label htmlFor="issue-type" className="form-label">
                Issue Type <span aria-hidden="true">*</span>
              </label>
              <select
                id="issue-type"
                className="form-select"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="">— Select issue type —</option>
                {ISSUE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="issue-desc" className="form-label">
                Description <span style={{ fontWeight: 400, color: 'var(--ux4g-text-muted)' }}>(optional)</span>
              </label>
              <textarea
                id="issue-desc"
                className="form-textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail so our team can investigate..."
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={handleClose}>Cancel</button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleSubmit}
                disabled={!issueType}
              >
                <AlertTriangle size={14} /> Submit Issue Report
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-body modal-success">
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} color="#16a34a" />
            </div>
            <h3 className="success-title">Issue Reported</h3>
            <p className="success-subtitle">Your grievance has been registered successfully.</p>
            <div className="success-id-box">
              <div className="success-id-label">Grievance ID</div>
              <div className="success-id-value">{grievanceId}</div>
            </div>
            <p className="success-note">
              Our team will review this within 7 working days.
              Please use this Grievance ID to track your complaint.
            </p>
            <p className="success-disclaimer">
              ⚠ Prototype submission only. No real grievance has been filed.
            </p>
            <button type="button" className="btn-primary" onClick={handleClose} style={{ marginTop: '1rem' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportIssueModal;
