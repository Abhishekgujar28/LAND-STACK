import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Smartphone,
  CheckCircle2,
  UserPlus,
  ArrowLeft,
  AlertCircle,
  Wrench,
  Globe,
  ChevronDown,
  RotateCw,
  Lock,
  ArrowRight,
  User,
  FileText,
  LogIn,
  FileCheck2,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import { DEFAULT_CITIZENS } from '../../context/authConstants';
import emblemSvg from '../../assets/logos/emblem.svg';

export const CitizenLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginAsCitizen, devLoginCitizen } = useAuth();

  const [mobile, setMobile] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentCaptchaCode, setCurrentCaptchaCode] = useState('XbfL3');
  const [errorMsg, setErrorMsg] = useState(null);
  const [smsNotice, setSmsNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateNewCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCurrentCaptchaCode(result);
  };

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
    <div
      style={{
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'stretch',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
        flexWrap: 'wrap',
      }}
    >
      {/* ── CARD 1: Left Brand Hero Card (Full Background citizenlogin.png) ── */}
      <div
        style={{
          flex: '0 0 295px',
          maxWidth: '300px',
          backgroundImage: `linear-gradient(180deg, rgba(6,78,59,0.48) 0%, rgba(6,78,59,0.18) 42%, rgba(6,78,59,0.6) 100%), url(/citizenlogin.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '16px',
          padding: '1.35rem 1.1rem 0.6rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px -5px rgba(6,78,59,0.35), 0 0 0 1px rgba(6,78,59,0.15)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Emblem */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.6rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            padding: '5px',
            boxSizing: 'border-box',
          }}
        >
          <img src={emblemSvg} alt="Emblem of India" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Title & Subtitles */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, textAlign: 'center', letterSpacing: '0.03em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          <span style={{ color: '#ffffff' }}>BHARAT</span>
          <span style={{ color: '#ea580c' }}>BHUMI</span>
        </h2>
        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#facc15', textAlign: 'center', marginTop: '0.15rem', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
          Citizen Landholder Portal
        </div>
        <div style={{ fontSize: '0.68rem', color: '#f1f5f9', textAlign: 'center', marginTop: '0.1rem', marginBottom: '0.9rem', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
          Dept. of Land Resources • Govt. of India
        </div>

        {/* 3 Trust / Feature Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: 'auto' }}>
          {/* Pill 1 */}
          <div
            style={{
              background: 'rgba(6,78,59,0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#fff',
              }}
            >
              <Smartphone size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>e-Pramaan &amp; DigiLocker</div>
              <div style={{ fontSize: '0.64rem', color: '#cbd5e1' }}>Aadhaar OTP mobile verification</div>
            </div>
          </div>

          {/* Pill 2 */}
          <div
            style={{
              background: 'rgba(6,78,59,0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#fff',
              }}
            >
              <FileCheck2 size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>Certified Extracts &amp; e-Ferfar</div>
              <div style={{ fontSize: '0.64rem', color: '#cbd5e1' }}>Court-admissible 7/12 &amp; 8A</div>
            </div>
          </div>

          {/* Pill 3 */}
          <div
            style={{
              background: 'rgba(6,78,59,0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#fff',
              }}
            >
              <MapPin size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>Bhu-Aadhaar ULPIN GIS</div>
              <div style={{ fontSize: '0.64rem', color: '#cbd5e1' }}>14-digit parcel boundary</div>
            </div>
          </div>
        </div>

        {/* Bottom text footer inside left card */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.18)',
            paddingTop: '0.45rem',
            paddingBottom: '0.2rem',
            marginTop: '1.2rem',
            textAlign: 'center',
            fontSize: '0.64rem',
            color: '#f1f5f9',
            letterSpacing: '0.02em',
            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          }}
        >
          Secure Access &bull; Efficient Governance &bull; Digital India
        </div>
      </div>

      {/* ── CARD 2: Center Main Login Card (White) ── */}
      <div
        style={{
          flex: '1 1 480px',
          maxWidth: '560px',
          minWidth: '320px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.4rem 1.6rem',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header Row: Stepper Badge & Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          {/* Stepper Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '999px',
                padding: '2.5px 8px 2.5px 4px',
              }}
            >
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                1
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#15803d' }}>
                Step 1 of 2: Mobile Identification
              </span>
            </div>
            <div style={{ width: '25px', height: '1px', backgroundColor: '#cbd5e1' }} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  color: '#64748b',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Aadhaar Authentication
              </span>
            </div>
          </div>

          {/* Language Selector */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '3px 8px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#475569',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <Globe size={13} />
            <span>English</span>
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Title and Subtitle */}
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.15rem' }}>
          Citizen Portal Login
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 1.15rem' }}>
          e-Pramaan Mobile &amp; Aadhaar Authentication for Landholders
        </p>

        {errorMsg && (
          <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={14} /><span>{errorMsg}</span>
          </div>
        )}

        {smsNotice && (
          <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', color: '#92400e', fontSize: '0.75rem', lineHeight: 1.4 }}>
            <strong>SMS Provider Notice:</strong> {smsNotice}
          </div>
        )}

        {/* Form Body */}
        {!otpStep ? (
          <form onSubmit={handleProceedToOtp} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Mobile Number Field */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem', display: 'block' }}>
                Registered Mobile Number <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '7px',
                  height: '40px',
                  backgroundColor: '#ffffff',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0 0.75rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <Smartphone size={16} />
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 98230 45891 or +91 98230 45891"
                  required
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    backgroundColor: 'transparent',
                    paddingRight: '0.5rem',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Must match mobile number recorded in Land Records (RoR 7/12 / 8A)
              </span>
            </div>

            {/* Captcha Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                  Security Verification <span style={{ color: '#dc2626' }}>* *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setCaptchaInput(currentCaptchaCode || 'XbfL3')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <RotateCw size={12} /> Auto-fill Captcha
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                {/* Visual Captcha Box */}
                <div
                  style={{
                    width: '115px',
                    height: '38px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: '0.25em',
                    fontFamily: 'monospace, Courier, sans-serif',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: '#1e293b',
                    position: 'relative',
                    overflow: 'hidden',
                    userSelect: 'none',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '-10%',
                      right: '-10%',
                      height: '1px',
                      backgroundColor: '#94a3b8',
                      transform: 'rotate(-4deg)',
                      pointerEvents: 'none',
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 2 }}>{currentCaptchaCode || 'XbfL3'}</span>
                </div>

                {/* Refresh button */}
                <button
                  type="button"
                  onClick={generateNewCaptcha}
                  style={{
                    width: '38px',
                    height: '38px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#475569',
                    flexShrink: 0,
                  }}
                >
                  <RotateCw size={14} />
                </button>

                {/* Input with lock */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    height: '38px',
                    backgroundColor: '#ffffff',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '0 0.55rem', color: '#64748b' }}>
                    <Lock size={14} />
                  </div>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter code"
                    maxLength={6}
                    required
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.82rem',
                      color: '#0f172a',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: '#064e3b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem',
                boxShadow: '0 3px 8px rgba(6,78,59,0.25)',
                transition: 'all 0.15s ease',
                marginTop: '0.2rem',
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#04382a')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#064e3b')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smartphone size={16} />
                <span>{loading ? 'Verifying...' : 'Generate Mobile OTP →'}</span>
              </div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowRight size={13} />
              </div>
            </button>

            {/* Account Registration Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginTop: '0.6rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#f0fdf4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16a34a',
                  }}
                >
                  <UserPlus size={15} />
                </div>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#334155' }}>
                  First time user? Don't have an account yet?
                </span>
              </div>
              <Link to="/login/register" style={{ textDecoration: 'none' }}>
                <button
                  type="button"
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: '#fff7ed',
                    border: '1.5px solid #ea580c',
                    borderRadius: '6px',
                    color: '#ea580c',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffedd5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff7ed')}
                >
                  Create Citizen Account →
                </button>
              </Link>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem 0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '7px', fontSize: '0.78rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Smartphone size={15} color="#16a34a" /><span>OTP sent to <strong>{mobile}</strong></span>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.2rem', display: 'block' }}>Enter 6-Digit OTP <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="text" value={otpValue} onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••" maxLength={6} autoFocus required
                style={{ width: '100%', height: '42px', padding: '0.35rem', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '1.2rem', letterSpacing: '0.3em', textAlign: 'center', fontWeight: 700, boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', height: '38px', backgroundColor: '#064e3b', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '0.84rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 2px 6px rgba(6,78,59,0.2)' }}>
              <CheckCircle2 size={15} /><span>{loading ? 'Verifying OTP...' : 'Verify & Enter Dashboard'}</span>
            </button>
            <button type="button" onClick={() => { setOtpStep(false); setOtpValue(''); setErrorMsg(null); }}
              style={{ background: 'none', border: 'none', color: '#064e3b', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <ArrowLeft size={12} /><span>Change Mobile Number</span>
            </button>
          </form>
        )}
      </div>

      {/* ── CARD 3: Right Test Accounts Demo Card ── */}
      <div
        style={{
          flex: '0 0 280px',
          maxWidth: '280px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.1rem',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Wrench size={15} color="#ea580c" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
              TEST ACCOUNTS
            </span>
          </div>
          <span
            style={{
              backgroundColor: '#ffedd5',
              color: '#c2410c',
              padding: '2px 7px',
              borderRadius: '4px',
              fontSize: '0.64rem',
              fontWeight: 800,
            }}
          >
            DEMO
          </span>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 0.85rem', lineHeight: 1.4 }}>
          Fill the form to quickly test the login flow. Login authenticates instantly.
        </p>

        {/* 3 Citizen Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {DEFAULT_CITIZENS.map((c, idx) => {
            const avatarColor =
              idx === 0
                ? { bg: '#dcfce7', icon: '#16a34a' }
                : idx === 1
                ? { bg: '#dbeafe', icon: '#2563eb' }
                : { bg: '#f3e8ff', icon: '#9333ea' };

            return (
              <div
                key={c.id}
                style={{
                  padding: '0.65rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                {/* User Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '7px',
                      backgroundColor: avatarColor.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: avatarColor.icon,
                      flexShrink: 0,
                    }}
                  >
                    <User size={16} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{c.mobile}</div>
                  </div>
                </div>

                {/* Buttons Row */}
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
                      flex: 1,
                      padding: '4px 0',
                      fontSize: '0.72rem',
                      borderRadius: '5px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    <FileText size={12} />
                    <span>Fill Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDevAuthenticate(c)}
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      fontSize: '0.72rem',
                      borderRadius: '5px',
                      border: '1px solid #a7f3d0',
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      cursor: 'pointer',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1fae5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ecfdf5')}
                  >
                    <LogIn size={12} />
                    <span>Login</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CitizenLoginPage;
