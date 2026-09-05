import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const ROLE_PRESETS = [
  { role: ROLES.TALATHI, label: 'Talathi (Field)', name: 'Prakash Shinde', email: 'prakash.shinde@maharashtra.gov.in', route: '/government/talathi' },
  { role: ROLES.TEHSILDAR, label: 'Tehsildar (Statutory)', name: 'Sanjay Deshmukh', email: 'sanjay.deshmukh@maharashtra.gov.in', route: '/government/tehsildar' },
  { role: ROLES.SRO, label: 'Sub-Registrar (SRO)', name: 'Rekha Joshi', email: 'rekha.joshi@igrmaharashtra.gov.in', route: '/government/registration' },
  { role: ROLES.COLLECTOR, label: 'District Collector', name: 'Dr. Suhas Diwase, IAS', email: 'collector.pune@maharashtra.gov.in', route: '/government/district' },
  { role: ROLES.STATE_PMU, label: 'State PMU Head', name: 'Anil Verma', email: 'anil.verma@pmu.landrecords.gov.in', route: '/government/state' },
  { role: ROLES.NATIONAL_MONITOR, label: 'DoLR National Monitor', name: 'Meera Sengupta', email: 'meera.sengupta@dolr.gov.in', route: '/government/national' },
  { role: ROLES.ADMIN, label: 'System Admin', name: 'Manoj Tiwari', email: 'admin.landstack@nic.in', route: '/government/admin' },
];

export const GovernmentLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deptParam = searchParams.get('dept');
  const { loginAsOfficer } = useAuth();

  const [selectedRoleIndex, setSelectedRoleIndex] = useState(() => {
    if (deptParam === 'registration') return 2;
    if (deptParam === 'district') return 3;
    if (deptParam === 'state') return 4;
    if (deptParam === 'national') return 5;
    if (deptParam === 'admin') return 6;
    return 0; // default to Talathi
  });

  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('123456');

  const activePreset = ROLE_PRESETS[selectedRoleIndex];

  const handleProceedToOtp = (e) => {
    e.preventDefault();
    setOtpStep(true);
  };

  const handleVerifyLogin = (e) => {
    e.preventDefault();
    loginAsOfficer(activePreset.role);
    navigate(activePreset.route);
  };

  return (
    <div className="page-government-login ux4g-container" style={{ maxWidth: '640px', margin: '2rem auto' }}>
      {/* Gov Emblem & Title Strip */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🇮🇳</div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Government of India / State Revenue Department
        </div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: '0.25rem 0' }}>
          Jan Parichay — MeriPehchan SSO
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-muted)', margin: 0 }}>
          Single Sign-On Service for Authorized Government Revenue & Cadastral Officers
        </p>
      </div>

      <Card>
        {/* Role Quick Selector Tabs */}
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
          {ROLE_PRESETS.map((p, idx) => (
            <button
              key={p.role}
              type="button"
              onClick={() => {
                setSelectedRoleIndex(idx);
                setOtpStep(false);
              }}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--ux4g-radius-md)',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: 'none',
                background: selectedRoleIndex === idx ? 'var(--ux4g-primary)' : 'transparent',
                color: selectedRoleIndex === idx ? '#ffffff' : 'var(--ux4g-text)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {p.label}
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
                <div><strong>Selected Officer:</strong> {activePreset.name}</div>
                <div><strong>Official Email:</strong> {activePreset.email}</div>
                <div><strong>Target Workspace:</strong> <code>{activePreset.route}</code></div>
              </div>

              <div className="ux4g-form-group">
                <label className="ux4g-label ux4g-label-required">Government Identity (Jan Parichay ID / Email)</label>
                <input
                  type="text"
                  className="ux4g-input"
                  value={activePreset.email}
                  readOnly
                />
              </div>

              <div className="ux4g-form-group">
                <label className="ux4g-label ux4g-label-required">Password / DSC PIN</label>
                <input
                  type="password"
                  className="ux4g-input"
                  value="••••••••••••"
                  readOnly
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                Authenticate via Jan Parichay MFA →
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyLogin}>
              <Alert variant="info" style={{ marginBottom: '1.25rem' }}>
                TOTP / SMS Challenge sent to registered officer mobile for <strong>{activePreset.name}</strong>.
              </Alert>

              <div className="ux4g-form-group">
                <label className="ux4g-label ux4g-label-required">Enter 6-Digit Government MFA OTP</label>
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
                Verify & Enter {activePreset.label} Workspace
              </Button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--ux4g-border-subtle)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
              Need to see all roles?{' '}
              <a href="/login/role" style={{ fontWeight: 600 }}>
                View 7-Role Comparison Grid
              </a>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GovernmentLoginPage;
