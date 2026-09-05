import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import governmentRolesData from '../../data/users/governmentRoles.json';
import governmentUsersData from '../../data/users/governmentUsers.json';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const GovernmentLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deptParam = searchParams.get('dept');
  const { loginAsOfficer } = useAuth();

  // Map roles data to login presets
  const rolePresets = governmentRolesData.map((r) => {
    const matchedUser = governmentUsersData.find((u) => u.role === r.role) || {};
    return {
      role: r.role,
      label: r.title.split('/')[0].trim(),
      name: matchedUser.name || r.sampleOfficer,
      email: matchedUser.email || `${r.role.toLowerCase()}@landstack.gov.in`,
      route: r.route,
    };
  });

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

  const activePreset = rolePresets[selectedRoleIndex] || rolePresets[0];

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
        <div style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>🇮🇳</div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Government of India &bull; Department of Land Resources (DoLR)
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
          {rolePresets.map((p, idx) => (
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
