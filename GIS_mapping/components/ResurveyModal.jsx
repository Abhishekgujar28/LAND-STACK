/**
 * GIS_mapping/components/ResurveyModal.jsx
 *
 * 4-step "Apply for Resurvey" workflow modal.
 * Step 1: Property confirm → Step 2: Reason → Step 3: Supporting info → Step 4: Success
 * Generates a synthetic application number: RES-2026-XXXXX
 */
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, MapPin, FileText, Upload, Phone } from 'lucide-react';

const REASONS = [
  'Boundary does not match ground reality',
  'Area appears incorrect',
  'Boundary markers are missing',
  'Map / record discrepancy',
  'Other',
];

let _resurveyCounter = 1;
function generateApplicationId() {
  const n = String(_resurveyCounter++).padStart(5, '0');
  return `RES-2026-${n}`;
}

const ResurveyModal = ({ isOpen, onClose, parcel }) => {
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [applicationId, setApplicationId] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setSelectedReason('');
    setDescription('');
    setContact('');
    setApplicationId('');
    onClose();
  };

  const handleSubmit = () => {
    const id = generateApplicationId();
    setApplicationId(id);
    setStep(4);
  };

  const p = parcel?.properties || parcel || {};

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resurvey-modal-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal-sheet resurvey-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-eyebrow">Citizen Service</div>
            <h2 id="resurvey-modal-title" className="modal-title">Apply for Resurvey</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="modal-steps" aria-label="Application progress">
            {['Property', 'Reason', 'Details', 'Submit'].map((label, idx) => (
              <React.Fragment key={label}>
                <div className={`modal-step${step === idx + 1 ? ' active' : step > idx + 1 ? ' done' : ''}`}>
                  <div className="modal-step-dot">{step > idx + 1 ? '✓' : idx + 1}</div>
                  <span>{label}</span>
                </div>
                {idx < 3 && <div className={`modal-step-line${step > idx + 1 ? ' done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Step 1 — Property */}
        {step === 1 && (
          <div className="modal-body">
            <p className="modal-body-intro">Confirm the selected property for the resurvey request:</p>
            <div className="resurvey-property-card">
              <div className="resurvey-prop-row">
                <span className="resurvey-prop-label">ULPIN</span>
                <span className="resurvey-prop-value">{p.ulpin || 'ULPIN-MH-PUN-000001'}</span>
              </div>
              <div className="resurvey-prop-row">
                <span className="resurvey-prop-label">Survey No.</span>
                <span className="resurvey-prop-value">{p.survey_number || p.surveyNumber || '104'}</span>
              </div>
              <div className="resurvey-prop-row">
                <span className="resurvey-prop-label">Gat No.</span>
                <span className="resurvey-prop-value">{p.gat_number || p.gatNumber || '42'}</span>
              </div>
              <div className="resurvey-prop-row">
                <span className="resurvey-prop-label">Village</span>
                <span className="resurvey-prop-value">{p.village_name || p.village || 'Wagholi'}</span>
              </div>
              <div className="resurvey-prop-row">
                <span className="resurvey-prop-label">Tehsil / District</span>
                <span className="resurvey-prop-value">{p.tehsil || 'Haveli'}, {p.district || 'Pune'}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={handleClose}>Cancel</button>
              <button type="button" className="btn-primary" onClick={() => setStep(2)}>
                Confirm Property <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Reason */}
        {step === 2 && (
          <div className="modal-body">
            <p className="modal-body-intro">Select the reason for resurvey request:</p>
            <div className="resurvey-reasons" role="radiogroup" aria-label="Resurvey reason">
              {REASONS.map((reason) => (
                <label key={reason} className={`resurvey-reason-item${selectedReason === reason ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="resurvey-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                <ChevronLeft size={15} /> Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStep(3)}
                disabled={!selectedReason}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Supporting Info */}
        {step === 3 && (
          <div className="modal-body">
            <p className="modal-body-intro">Provide additional details to support your request:</p>
            <div className="form-group">
              <label htmlFor="resurvey-desc" className="form-label">
                <FileText size={13} /> Description
              </label>
              <textarea
                id="resurvey-desc"
                className="form-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail (optional)"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Upload size={13} /> Supporting Document / Photo
              </label>
              <div className="upload-area" role="button" tabIndex={0} aria-label="Upload supporting documents">
                <Upload size={20} />
                <span>Click to upload or drag files here</span>
                <span className="upload-hint">PDF, JPG, PNG — Max 5 MB (Prototype: not stored)</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="resurvey-contact" className="form-label">
                <Phone size={13} /> Preferred Contact Number
              </label>
              <input
                id="resurvey-contact"
                type="tel"
                className="form-input"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                <ChevronLeft size={15} /> Back
              </button>
              <button type="button" className="btn-warning" onClick={handleSubmit}>
                Submit Application
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === 4 && (
          <div className="modal-body modal-success">
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} color="#16a34a" />
            </div>
            <h3 className="success-title">Resurvey Request Submitted</h3>
            <p className="success-subtitle">Your application has been registered successfully.</p>
            <div className="success-id-box">
              <div className="success-id-label">Application Number</div>
              <div className="success-id-value">{applicationId}</div>
            </div>
            <p className="success-note">
              Please save this application number for future reference.
              A confirmation will be sent to your registered contact details.
            </p>
            <p className="success-disclaimer">
              ⚠ This is a prototype submission. No real government application has been filed.
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

export default ResurveyModal;
