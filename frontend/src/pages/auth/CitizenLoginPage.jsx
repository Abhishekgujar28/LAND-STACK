import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Smartphone, CheckCircle2, UserPlus, ArrowLeft, AlertCircle, Wrench } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthSplitCard from '../../components/auth/AuthSplitCard';
import SecurityCaptcha from '../../components/auth/SecurityCaptcha';
import authService from '../../services/authService';

import { DEFAULT_CITIZENS } from '../../context/authConstants';

export const CitizenLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginAsCitizen, devLoginCitizen } = useAuth();

  const [mobile, setMobile] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentCaptchaCode, setCurrentCaptchaCode] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [smsNotice, setSmsNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  // If redirected with an explicit citizen ID
  useEffect(() => {
    const citizenParam = searchParams.get('id');
    if (citizenParam) {
      const found = DEFAULT_CITIZENS.find((c) => c.id === citizenParam);
      if (found) {
        setMobile(found.mobile);
        setCaptchaInput(currentCaptchaCode || 'XbfL3');
      }
    }
  }, [searchParams, currentCaptchaCode]);

  const handleProceedToOtp = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSmsNotice(null);

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.requestCitizenOtp(mobile);
      if (res?.smsProviderStatus === 'PROVIDER_DISABLED') {
        setSmsNotice(
          "Phone OTP authentication is currently unavailable. Please configure the project's Supabase phone provider."
        );
        return;
      }
      setOtpStep(true);
    } catch (err) {
      console.warn('Citizen OTP request notice:', err.message);
      setErrorMsg(err.message || 'Mobile number is not registered with any citizen record.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!otpValue || otpValue.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      await loginAsCitizen(mobile, otpValue.trim());
      navigate('/citizen/dashboard');
    } catch (err) {
      console.error('Citizen login error:', err);
      setErrorMsg(err.message || 'OTP verification failed. Please check the OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevAuthenticate = async (citizen) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await devLoginCitizen(citizen.id);
      navigate('/citizen/dashboard');
    } catch (err) {
      console.error('Dev citizen login failed:', err);
      setErrorMsg(err.message || 'Development authentication failed.');
    } finally {
      setLoading(false);
    }
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
      {errorMsg && (
        <div
          style={{
            marginBottom: '0.75rem',
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

      {smsNotice && (
        <div
          style={{
            marginBottom: '0.75rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '6px',
            color: '#92400e',
            fontSize: '0.78rem',
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          <strong>SMS Provider Notice:</strong> {smsNotice}
        </div>
      )}

      {!otpStep ? (
        <form onSubmit={handleProceedToOtp} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Registered Mobile Number Input */}
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
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 98230 45891 or +91 98230 45891"
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
            <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
              Must match mobile number recorded in Land Records (RoR 7/12 / 8A)
            </span>
          </div>

          {/* Security Verification Captcha */}
          <div style={{ position: 'relative' }}>
            <SecurityCaptcha
              value={captchaInput}
              onChange={setCaptchaInput}
              onCaptchaCodeChange={setCurrentCaptchaCode}
            />
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
              marginTop: '0.15rem',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#04382a')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--ux4g-primary, #064e3b)')}
          >
            <Smartphone size={16} />
            <span>{loading ? 'Verifying Mobile...' : 'Generate Mobile OTP \u2192'}</span>
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
              6-Digit OTP challenge sent to registered mobile <strong>{mobile}</strong>.
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
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••••"
              maxLength={6}
              autoFocus
              required
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
          </div>

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
            }}
          >
            <CheckCircle2 size={16} />
            <span>{loading ? 'Verifying OTP...' : 'Verify & Enter Citizen Dashboard'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOtpStep(false);
              setOtpValue('');
              setErrorMsg(null);
            }}
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
            <span>Change Mobile Number</span>
          </button>
        </form>
      )}

      {/* Development / Test Account Tooling (Enabled for Production Demo) */}
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
          <span>Development / Test Account Tooling</span>
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
            TEST / DEMO
          </span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.5rem' }}>
          Clicking <em>Use test account</em> executes real Supabase authentication via the dev endpoint. Clicking <em>Fill</em> populates the mobile input and captcha.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {DEFAULT_CITIZENS.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.4rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>
                  {c.name} <span style={{ color: '#64748b', fontWeight: 400 }}>({c.localName})</span>
                </div>
                <code style={{ fontSize: '0.7rem', color: '#475569' }}>{c.mobile}</code>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMobile(c.mobile);
                    setCaptchaInput(currentCaptchaCode || 'XbfL3');
                    setOtpStep(false);
                    setErrorMsg(null);
                  }}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.7rem',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Fill
                </button>
                <button
                  type="button"
                  onClick={() => handleDevAuthenticate(c)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.7rem',
                    borderRadius: '4px',
                    border: '1px solid #10b981',
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Use test account
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthSplitCard>
  );
};

export default CitizenLoginPage;
