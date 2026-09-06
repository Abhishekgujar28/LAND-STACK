import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Smartphone, CheckCircle2, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthSplitCard from '../../components/auth/AuthSplitCard';
import SecurityCaptcha from '../../components/auth/SecurityCaptcha';
import citizensData from '../../data/users/citizens.json';

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
    return 0;
  });

  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('123456');
  const [captchaInput, setCaptchaInput] = useState('XbfL3');

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
    <AuthSplitCard
      mode="citizen"
      title="Citizen Portal Login"
      subtitle="e-Pramaan Mobile & Aadhaar Authentication for Landholders"
      badge={
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '3px 9px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#15803d',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
          {!otpStep ? 'Step 1 of 2: Mobile Identification' : 'Step 2 of 2: OTP Verification'}
        </span>
      }
    >
      {!otpStep ? (
        <form onSubmit={handleProceedToOtp} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
              Select Registered Citizen <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={selectedCitizenIndex}
              onChange={(e) => setSelectedCitizenIndex(Number(e.target.value))}
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
              {citizensData.slice(0, 8).map((c, idx) => (
                <option key={c.id} value={idx}>
                  {c.name} ({c.localName}) — {c.stateCode} ({c.mobile})
                </option>
              ))}
            </select>
          </div>

          {/* Registered Mobile Number */}
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
              value={activeCitizen.mobile}
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

          {/* Aadhaar VID Reference */}
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
              Aadhaar Token Reference
            </label>
            <input
              type="text"
              value={activeCitizen.aadhaarHash}
              readOnly
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
              }}
            />
          </div>

          {/* Security Verification Captcha */}
          <SecurityCaptcha value={captchaInput} onChange={setCaptchaInput} />

          {/* Submit */}
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
            <Smartphone size={16} />
            <span>Generate Mobile OTP &rarr;</span>
          </button>

          {/* Link to Create Account */}
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
              First time user? Don't have an account yet?
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
              <span>Create Citizen Account &rarr;</span>
            </Link>
          </div>
        </form>
      ) : (
        /* OTP Step */
        <form onSubmit={handleVerifyLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Smartphone size={16} color="#16a34a" />
            <span>
              6-Digit OTP challenge sent to registered mobile <strong>{activeCitizen.mobile}</strong>.
            </span>
          </div>

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
              Enter 6-Digit OTP <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              maxLength={6}
              style={{
                width: '100%',
                height: '42px',
                padding: '0.35rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '1.2rem',
                letterSpacing: '0.3em',
                textAlign: 'center',
                fontWeight: 700,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem', textAlign: 'center' }}>
              Demo testing pre-filled with <strong>123456</strong>
            </div>
          </div>

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
            }}
          >
            <CheckCircle2 size={16} />
            <span>Verify & Enter Citizen Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setOtpStep(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ux4g-primary, #064e3b)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
            }}
          >
            <ArrowLeft size={13} />
            <span>Change Selected Profile / Mobile</span>
          </button>
        </form>
      )}
    </AuthSplitCard>
  );
};

export default CitizenLoginPage;
