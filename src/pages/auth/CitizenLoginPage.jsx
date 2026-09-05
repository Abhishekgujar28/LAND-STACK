import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import citizensData from '../../data/users/citizens.json';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';

export const CitizenLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const citizenParam = searchParams.get('id');
  const { loginAsCitizen } = useAuth();

  const [selectedCitizenIndex, setSelectedCitizenIndex] = useState(() => {
    if (citizenParam) {
      const idx = citizensData.findIndex((c) => c.id === citizenParam);
      if (idx !== -1) return idx;
    }
    return 0; // Default to CIT-001 (Aarav Patil)
  });

  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('123456');

  const activeCitizen = citizensData[selectedCitizenIndex] || citizensData[0];

  const handleProceedToOtp = (e) => {
    e.preventDefault();
    setOtpStep(true);
  };

  const handleVerifyLogin = (e) => {
    e.preventDefault();
    loginAsCitizen(activeCitizen.id);
    navigate('/citizen/dashboard');
  };

  return (
    <div className="page-citizen-login ux4g-container" style={{ maxWidth: '640px', margin: '2rem auto' }}>
      {/* Gov Emblem & Title Strip */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>🇮🇳</div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Government of India &bull; Digital India Land Records (DILRMP)
        </div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: '0.25rem 0' }}>
          e-Pramaan / MeriPehchan Citizen Login
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-muted)', margin: 0 }}>
          Direct Aadhaar & Mobile OTP Authentication for Landholders and Citizens
        </p>
      </div>

      <Card>
        {/* Citizen Quick Selector Tabs */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            background: 'var(--ux4g-surface-muted)',
            padding: '0.5rem',
            gap: '0.35rem',
            borderBottom: '1px solid var(--ux4g-border-subtle)',
          }}
        >
          {citizensData.slice(0, 6).map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedCitizenIndex(idx);
                setOtpStep(false);
              }}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--ux4g-radius-md)',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: 'none',
                background: selectedCitizenIndex === idx ? 'var(--ux4g-primary)' : 'transparent',
                color: selectedCitizenIndex === idx ? '#ffffff' : 'var(--ux4g-text)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {c.name.split(' ')[0]} ({c.stateCode})
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem' }}>
          {!otpStep ? (
            <form onSubmit={handleProceedToOtp}>
              <div
                style={{
                  background: 'var(--ux4g-primary-light)',
                  padding: '0.85rem',
                  borderRadius: 'var(--ux4g-radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  border: '1px solid rgba(11, 60, 93, 0.15)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <div><strong>Selected Landholder:</strong> {activeCitizen.name} ({activeCitizen.localName})</div>
                  <Badge variant="success">KYC VERIFIED</Badge>
                </div>
                <div><strong>Aadhaar Hash:</strong> <code>{activeCitizen.aadhaarHash}</code></div>
                <div><strong>Registered Mobile:</strong> {activeCitizen.mobile}</div>
                <div><strong>Holding Address:</strong> {activeCitizen.address}</div>
              </div>

              <div className="ux4g-form-group">
                <label className="ux4g-label ux4g-label-required">Registered Mobile Number / Aadhaar VID</label>
                <input
                  type="text"
                  className="ux4g-input"
                  value={activeCitizen.mobile}
                  readOnly
                />
              </div>

              <div className="ux4g-form-group">
                <label className="ux4g-label ux4g-label-required">Aadhaar Linked Identity</label>
                <input
                  type="text"
                  className="ux4g-input"
                  value={activeCitizen.aadhaarHash}
                  readOnly
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                Send 6-Digit OTP via SMS / DigiLocker →
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyLogin}>
              <Alert variant="info" style={{ marginBottom: '1.25rem' }}>
                6-Digit OTP challenge sent to registered mobile <strong>{activeCitizen.mobile}</strong> for <strong>{activeCitizen.name}</strong>.
              </Alert>

              <div className="ux4g-form-group">
                <label className="ux4g-label ux4g-label-required">Enter 6-Digit Citizen OTP</label>
                <input
                  type="text"
                  className="ux4g-input"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  style={{ fontSize: '1.2rem', letterSpacing: '0.3em', textAlign: 'center' }}
                  maxLength={6}
                />
                <span className="ux4g-form-helper">Demo pre-filled with 123456</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                Verify & Enter Citizen Dashboard
              </Button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--ux4g-primary)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ← Change Selected Citizen / Mobile
                </button>
              </div>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--ux4g-border-subtle)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
              Are you a government revenue officer?{' '}
              <a href="/login/government" style={{ fontWeight: 600 }}>
                Jan Parichay SSO Login
              </a>
              {' '}&bull;{' '}
              <a href="/login/role" style={{ fontWeight: 600 }}>
                Role Comparison Grid
              </a>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CitizenLoginPage;
