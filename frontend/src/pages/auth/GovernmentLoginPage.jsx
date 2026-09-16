import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Wrench } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthSplitCard from '../../components/auth/AuthSplitCard';
import SecurityCaptcha from '../../components/auth/SecurityCaptcha';
import { GOVERNMENT_ROLE_PRESETS } from '../../config/roles';
import { DEFAULT_OFFICERS } from '../../context/authConstants';

export const GovernmentLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginAsOfficer } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentCaptchaCode, setCurrentCaptchaCode] = useState('XbfL3');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTargetRouteForRole = (officerRole) => {
    switch (officerRole) {
      case 'ULB_OFFICER':
        return '/government/ulb';
      case 'SURVEY_GIS':
      case 'SURVEY_OFFICER':
        return '/government/survey';
      case 'TALATHI':
      case 'PATWARI':
        return '/government/talathi';
      case 'TEHSILDAR':
      case 'CRO':
        return '/government/tehsildar';
      case 'SRO':
        return '/government/registration';
      case 'COLLECTOR':
        return '/government/district';
      case 'STATE_PMU':
        return '/government/state';
      case 'NATIONAL_MONITOR':
        return '/government/national';
      case 'ADMIN':
        return '/government/admin';
      default: {
        const matchedPreset = GOVERNMENT_ROLE_PRESETS.find((p) => p.role === officerRole);
        return matchedPreset?.route || '/government/dashboard';
      }
    }
  };

  // If redirected with a specific department in DEV mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      const deptParam = searchParams.get('dept');
      if (deptParam) {
        const roleKey = deptParam.toUpperCase();
        const found = DEFAULT_OFFICERS[roleKey];
        if (found) {
          setEmail(found.email);
          setPassword('Password123!');
          setCaptchaInput(currentCaptchaCode || 'XbfL3');
        }
      }
    }
  }, [searchParams, currentCaptchaCode]);

  const handleOfficialLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your official government email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const officer = await loginAsOfficer(cleanEmail, password);
      const targetRoute = getTargetRouteForRole(officer?.role);
      navigate(targetRoute);
    } catch (err) {
      console.error('Official login failed:', err);
      setErrorMsg(err.message || 'Official authentication failed. Please verify your credentials and active jurisdiction.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevAutoFill = (officer) => {
    setEmail(officer.email);
    setPassword('Password123!');
    setCaptchaInput(currentCaptchaCode || 'XbfL3');
    setErrorMsg(null);
  };

  const handleDevUseAccount = async (officer) => {
    setLoading(true);
    setErrorMsg(null);
    setEmail(officer.email);
    setPassword('Password123!');
    setCaptchaInput(currentCaptchaCode || 'XbfL3');

    try {
      const authUser = await loginAsOfficer(officer.email, 'Password123!');
      const targetRoute = getTargetRouteForRole(authUser?.role || officer.role);
      navigate(targetRoute);
    } catch (err) {
      console.error('[GovernmentLogin] Direct login failed:', err);
      setErrorMsg(err.message || 'Official authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitCard
      mode="official"
      title="Official Portal Login"
      subtitle="Jan Parichay SSO for Revenue & Cadastral Officers"
      badge={
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '3px 9px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#334155',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0f172a' }}></span>
          Revenue &amp; Cadastral Officer Gateway
        </span>
      }
    >
      <form onSubmit={handleOfficialLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {errorMsg && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#b91c1c',
              fontSize: '0.8rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email Address */}
        <div className="ux4g-form-group">
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.25rem',
              display: 'block',
            }}
          >
            Official Email Address <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. officer@maharashtra.gov.in"
            required
            style={{
              width: '100%',
              height: '38px',
              padding: '0.35rem 0.65rem',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.825rem',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        {/* Password */}
        <div className="ux4g-form-group">
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.25rem',
              display: 'block',
            }}
          >
            Password <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter official portal password"
              required
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 2.25rem 0.35rem 0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Security Verification Captcha */}
        <div style={{ position: 'relative' }}>
          <SecurityCaptcha
            value={captchaInput}
            onChange={setCaptchaInput}
            onCaptchaCodeChange={setCurrentCaptchaCode}
          />
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => setCaptchaInput(currentCaptchaCode || 'XbfL3')}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              title="Auto-fill verification captcha"
            >
              Auto-fill Captcha
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            height: '40px',
            backgroundColor: 'var(--ux4g-primary, #064e3b)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            boxShadow: '0 3px 8px rgba(6, 78, 59, 0.2)',
            transition: 'all 0.15s ease',
            marginTop: '0.25rem',
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#04382a')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--ux4g-primary, #064e3b)')}
        >
          <LogIn size={16} />
          <span>{loading ? 'Authenticating Official...' : 'Authenticate with Jan Parichay SSO \u2192'}</span>
        </button>
      </form>

      {/* Development-Only Account Selector (Strictly Gated to Development Mode) */}
      {import.meta.env.DEV && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.85rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '0.5rem',
              color: '#475569',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Wrench size={13} color="#ea580c" />
            <span>Official Test Account Tooling</span>
            <span
              style={{
                backgroundColor: '#fed7aa',
                color: '#9a3412',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '0.65rem',
                fontWeight: 800,
              }}
            >
              DEV ONLY
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.65rem' }}>
            Clicking <em>Use this account</em> logs in instantly with auto-filled captcha into the assigned workspace. Clicking <em>Fill</em> populates credentials and security captcha.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '280px', overflowY: 'auto' }}>
            {Array.from(new Map(Object.values(DEFAULT_OFFICERS).map((o) => [o.email, o])).values()).map((officer) => (
              <div
                key={officer.id + officer.role + officer.email}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.65rem',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  gap: '0.5rem',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{officer.name}</span>
                    {officer.localName && (
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>({officer.localName})</span>
                    )}
                    <span
                      style={{
                        padding: '1px 5px',
                        borderRadius: '3px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor:
                          officer.role === 'ULB_OFFICER'
                            ? '#dbeafe'
                            : officer.role === 'SURVEY_GIS'
                            ? '#ccfbf1'
                            : officer.role === 'TEHSILDAR'
                            ? '#fee2e2'
                            : officer.role === 'TALATHI'
                            ? '#dcfce7'
                            : '#f1f5f9',
                        color:
                          officer.role === 'ULB_OFFICER'
                            ? '#1e40af'
                            : officer.role === 'SURVEY_GIS'
                            ? '#0f766e'
                            : officer.role === 'TEHSILDAR'
                            ? '#b91c1c'
                            : officer.role === 'TALATHI'
                            ? '#15803d'
                            : '#475569',
                      }}
                    >
                      {officer.role}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {officer.designation || officer.email}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleDevAutoFill(officer)}
                    disabled={loading}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#f8fafc',
                      color: '#334155',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Fill
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDevUseAccount(officer)}
                    disabled={loading}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      border: '1px solid #10b981',
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    Use this account
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AuthSplitCard>
  );
};

export default GovernmentLoginPage;
