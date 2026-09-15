import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthSplitCard from '../../components/auth/AuthSplitCard';
import SecurityCaptcha from '../../components/auth/SecurityCaptcha';
import { DEFAULT_CITIZENS, DEFAULT_OFFICERS } from '../../context/authConstants';
import { GOVERNMENT_ROLE_PRESETS } from '../../config/roles';
import authService from '../../services/authService';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'citizen' ? 'citizen' : 'official';

  const [activeTab, setActiveTab] = useState(initialMode);
  const { loginAsOfficer, loginAsCitizen } = useAuth();

  const [citizens, setCitizens] = useState(DEFAULT_CITIZENS);

  // Government Officer State
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('GovPass@2026');
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('XbfL3');

  // Citizen State
  const [selectedCitizenIndex, setSelectedCitizenIndex] = useState(0);
  const [citizenMobile, setCitizenMobile] = useState(DEFAULT_CITIZENS[0].mobile);
  const [citizenOtp, setCitizenOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    authService.getUsersByRole('CITIZEN').then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCitizens(data);
        setCitizenMobile(data[0].mobile || '');
      }
    }).catch(() => {});
  }, []);

  const rolePresets = GOVERNMENT_ROLE_PRESETS.map((r) => {
    const officer = DEFAULT_OFFICERS[r.role] || {};
    return {
      role: r.role,
      label: r.title,
      name: officer.name || r.sampleOfficer,
      email: officer.email || `${r.role.toLowerCase()}@landstack.gov.in`,
      route: r.route,
    };
  });

  const activeRole = rolePresets[selectedRoleIndex] || rolePresets[0];
  const activeCitizen = citizens[selectedCitizenIndex] || citizens[0] || DEFAULT_CITIZENS[0];

  const [error, setError] = useState('');

  const handleOfficialLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginAsOfficer(activeRole.email, password);
      navigate(activeRole.route);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  const handleCitizenLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginAsCitizen(citizenMobile, citizenOtp);
      navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    }
  };

  return (
    <AuthSplitCard
      mode={activeTab}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={activeTab === 'official' ? 'Official Portal Login' : 'Citizen Portal Login'}
      subtitle={
        activeTab === 'official'
          ? 'Single Sign-On access for Revenue & Cadastral Officers'
          : 'Access 7/12 RoR, 8A extracts, e-Ferfar & cadastral maps'
      }
    >
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
      {activeTab === 'official' ? (
        /* ======== OFFICIAL PORTAL LOGIN FORM ======== */
        <form onSubmit={handleOfficialLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Official Role Select */}
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
              Official Role <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={selectedRoleIndex}
              onChange={(e) => setSelectedRoleIndex(Number(e.target.value))}
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                outline: 'none',
              }}
            >
              {rolePresets.map((p, idx) => (
                <option key={p.role} value={idx}>
                  {p.label} — {p.name}
                </option>
              ))}
            </select>
          </div>

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
              Email Address <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="email"
              value={activeRole.email}
              readOnly
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                backgroundColor: '#f8fafc',
                color: '#334155',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password with Eye Visibility Toggle */}
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
                required
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
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Security Verification Captcha */}
          <SecurityCaptcha value={captchaInput} onChange={setCaptchaInput} />

          {/* Remember Me Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--ux4g-primary, #064e3b)', width: '15px', height: '15px' }}
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/login/forgot-password"
              style={{ fontSize: '0.78rem', color: 'var(--ux4g-primary, #064e3b)', textDecoration: 'none', fontWeight: 600 }}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In to Portal Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              height: '40px',
              backgroundColor: 'var(--ux4g-primary, #064e3b)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: '0 3px 8px rgba(6, 78, 59, 0.2)',
              transition: 'all 0.15s ease',
              marginTop: '0.2rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#04382a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--ux4g-primary, #064e3b)')}
          >
            <LogIn size={16} />
            <span>Sign In to Portal</span>
          </button>
        </form>
      ) : (
        /* ======== CITIZEN PORTAL LOGIN FORM ======== */
        <form onSubmit={handleCitizenLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Quick Citizen Profile Selector */}
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
              Registered Citizen Profile <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={selectedCitizenIndex}
              onChange={(e) => {
                const idx = Number(e.target.value);
                setSelectedCitizenIndex(idx);
                setCitizenMobile(citizens[idx]?.mobile || '');
              }}
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                outline: 'none',
              }}
            >
              {citizens.slice(0, 8).map((c, idx) => (
                <option key={c.id} value={idx}>
                  {c.name} ({c.localName}) — {c.stateCode || 'MH'} ({c.mobile})
                </option>
              ))}
            </select>
          </div>

          {/* Registered Mobile / Aadhaar */}
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
              Registered Mobile Number <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value={citizenMobile}
              onChange={(e) => setCitizenMobile(e.target.value)}
              placeholder="+91 98230 00000"
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                backgroundColor: '#f8fafc',
                color: '#334155',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* OTP / Security Challenge */}
          <div className="ux4g-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                One-Time Passcode (OTP)
              </label>
              {!otpSent ? (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(true);
                    setCitizenOtp('123456');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--ux4g-secondary, #ea580c)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Send OTP via SMS
                </button>
              ) : (
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                  OTP Sent (Demo: 123456)
                </span>
              )}
            </div>
            <input
              type="text"
              value={citizenOtp}
              onChange={(e) => setCitizenOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.9rem',
                letterSpacing: citizenOtp ? '0.2em' : 'normal',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Security Verification Captcha */}
          <SecurityCaptcha value={captchaInput} onChange={setCaptchaInput} />

          {/* Citizen Sign In Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              height: '40px',
              backgroundColor: 'var(--ux4g-primary, #064e3b)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: '0 3px 8px rgba(6, 78, 59, 0.2)',
              transition: 'all 0.15s ease',
              marginTop: '0.15rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#04382a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--ux4g-primary, #064e3b)')}
          >
            <CheckCircle2 size={16} />
            <span>Verify &amp; Enter Citizen Portal</span>
          </button>

          {/* Link to Create Account Page */}
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.65rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.2rem' }}>
              Don't have a registered citizen account yet?
            </div>
            <Link
              to="/login/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.825rem',
                fontWeight: 700,
                color: 'var(--ux4g-secondary, #ea580c)',
                textDecoration: 'none',
              }}
            >
              <UserPlus size={14} />
              <span>Create New Citizen Account &rarr;</span>
            </Link>
          </div>
        </form>
      )}
    </AuthSplitCard>
  );
};

export default LoginPage;
