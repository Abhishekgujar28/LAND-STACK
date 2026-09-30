import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Wrench,
  RotateCw,
  Lock,
  Mail,
  Shield,
  Users,
  BarChart3,
  Search,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { GOVERNMENT_ROLE_PRESETS } from '../../config/roles';
import emblemSvg from '../../assets/logos/emblem.svg';

const DEMO_OFFICERS = [
  {
    name: 'Sayali Wadhai',
    role: 'TALATHI',
    designation: 'Talathi (Circle Wagholi)',
    email: 'sayali.wadhai@maharashtra.gov.in',
    badge: { label: 'TALATHI', bg: '#dcfce7', color: '#15803d' },
  },
  {
    name: 'Prakash Shinde',
    role: 'TALATHI',
    designation: 'Village Revenue Officer',
    email: 'prakash.shinde@maharashtra.gov.in',
    badge: { label: 'TALATHI', bg: '#dcfce7', color: '#15803d' },
  },
  {
    name: 'Sanjay Deshmukh',
    role: 'TEHSILDAR',
    designation: 'Tehsildar & Magistrate',
    email: 'sanjay.deshmukh@maharashtra.gov.in',
    badge: { label: 'TEHSILDAR', bg: '#fee2e2', color: '#b91c1c' },
  },
  {
    name: 'Rekha Joshi',
    role: 'SRO',
    designation: 'Sub-Registrar Haveli',
    email: 'rekha.joshi@igrmaharashtra.gov.in',
    badge: { label: 'SRO', bg: '#dbeafe', color: '#1e40af' },
  },
  {
    name: 'Dr. Suhas Diwase',
    role: 'COLLECTOR',
    designation: 'District Collector & DM',
    email: 'collector.pune@maharashtra.gov.in',
    badge: { label: 'COLLECTOR', bg: '#f3e8ff', color: '#7e22ce' },
  },
  {
    name: 'Anita Bhosale',
    role: 'ULB_OFFICER',
    designation: 'Urban Land Officer (PMC)',
    email: 'anita.bhosale@pmc.gov.in',
    badge: { label: 'ULB OFFICER', bg: '#e0f2fe', color: '#0369a1' },
  },
  {
    name: 'Vikram Patole',
    role: 'SURVEY_GIS',
    designation: 'Cadastral GIS Cartographer',
    email: 'vikram.patole@maharashtra.gov.in',
    badge: { label: 'SURVEY GIS', bg: '#ccfbf1', color: '#0f766e' },
  },
  {
    name: 'Anil Verma',
    role: 'STATE_PMU',
    designation: 'State PMU Project Lead',
    email: 'anil.verma@pmu.landrecords.gov.in',
    badge: { label: 'STATE PMU', bg: '#ede9fe', color: '#6d28d9' },
  },
  {
    name: 'Meera Sengupta',
    role: 'NATIONAL_MONITOR',
    designation: 'National MIS Lead (DoLR)',
    email: 'meera.sengupta@dolr.gov.in',
    badge: { label: 'NATIONAL MONITOR', bg: '#fef3c7', color: '#b45309' },
  },
  {
    name: 'Manoj Tiwari',
    role: 'ADMIN',
    designation: 'Platform Administrator',
    email: 'admin.landstack@nic.in',
    badge: { label: 'ADMIN', bg: '#f1f5f9', color: '#334155' },
  },
];

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
  const [searchQuery, setSearchQuery] = useState('');

  const generateNewCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCurrentCaptchaCode(result);
  };

  const getTargetRouteForRole = (officerRole) => {
    switch (officerRole) {
      case 'ULB_OFFICER':
      case 'ULC OFFICER':
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
      case 'DY. COLLECTOR':
        return '/government/district';
      case 'STATE_PMU':
      case 'LAND RECORDS':
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

  // If redirected with a specific department
  useEffect(() => {
    const deptParam = searchParams.get('dept');
    if (deptParam) {
      const found = DEMO_OFFICERS.find((o) => o.role.toUpperCase() === deptParam.toUpperCase());
      if (found) {
        setEmail(found.email);
        setPassword('Gov@1234');
        setCaptchaInput(currentCaptchaCode || 'XbfL3');
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
      const authUser = await loginAsOfficer(cleanEmail, password);
      const targetRoute = getTargetRouteForRole(authUser?.role);
      navigate(targetRoute);
    } catch (err) {
      console.error('[GovernmentLogin] Error:', err);
      setErrorMsg(err.message || 'Official login failed. Please check credentials or contact State PMU.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAccount = (officer) => {
    setEmail(officer.email);
    setPassword('Gov@1234');
    setCaptchaInput(currentCaptchaCode || 'XbfL3');
    setErrorMsg(null);
  };

  const handleDevUseAccount = async (officer) => {
    setLoading(true);
    setErrorMsg(null);
    setEmail(officer.email);
    setPassword('Gov@1234');
    setCaptchaInput(currentCaptchaCode || 'XbfL3');

    try {
      const authUser = await loginAsOfficer(officer.email, 'Gov@1234');
      const targetRoute = getTargetRouteForRole(authUser?.role || officer.role);
      navigate(targetRoute);
    } catch (err) {
      console.error('[GovernmentLogin] Direct login failed:', err);
      setErrorMsg(err.message || 'Official authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOfficers = DEMO_OFFICERS.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.badge.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'stretch',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1320px',
        margin: '0 auto',
        flexWrap: 'wrap',
      }}
    >
      {/* ── CARD 1: Left Brand Hero Card (Full Background officaillogin.png) ── */}
      <div
        style={{
          flex: '0 0 295px',
          maxWidth: '300px',
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.42) 0%, rgba(15,23,42,0.18) 42%, rgba(15,23,42,0.55) 100%), url(/officaillogin.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '16px',
          padding: '1.35rem 1.1rem 0.6rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Emblem Badge */}
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
          Jan Parichay Official SSO
        </div>
        <div style={{ fontSize: '0.68rem', color: '#f1f5f9', textAlign: 'center', marginTop: '0.1rem', marginBottom: '0.9rem', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
          Dept. of Land Resources • Govt. Of India
        </div>

        {/* 3 Trust / Feature Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: 'auto' }}>
          {/* Feature 1 */}
          <div
            style={{
              background: 'rgba(15,23,42,0.65)',
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
                backgroundColor: '#eab308',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#0f172a',
              }}
            >
              <Lock size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>Jan Parichay SSO Security</div>
              <div style={{ fontSize: '0.64rem', color: '#cbd5e1' }}>Multi-factor officer authentication</div>
            </div>
          </div>

          {/* Feature 2 */}
          <div
            style={{
              background: 'rgba(15,23,42,0.65)',
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
                color: '#ffffff',
              }}
            >
              <Users size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>Statutory Revenue Bench</div>
              <div style={{ fontSize: '0.64rem', color: '#cbd5e1' }}>Tehsildar, SRO &amp; Collector</div>
            </div>
          </div>

          {/* Feature 3 */}
          <div
            style={{
              background: 'rgba(15,23,42,0.65)',
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
                color: '#ffffff',
              }}
            >
              <BarChart3 size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>Cadastral Intelligence</div>
              <div style={{ fontSize: '0.64rem', color: '#cbd5e1' }}>Tehsil queues &amp; audit trails</div>
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
          flex: '1 1 380px',
          maxWidth: '430px',
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
        {/* Gateway Status Badge at top center */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '3px 12px',
              backgroundColor: '#e0f2fe',
              border: '1px solid #bae6fd',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#0369a1',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span>
            Revenue &amp; Cadastral Officer Gateway
          </span>
        </div>

        {/* Title and Subtitle */}
        <h1 style={{ fontSize: '1.48rem', fontWeight: 800, color: '#0f172a', textAlign: 'center', margin: '0 0 0.15rem' }}>
          Official Portal Login
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', margin: '0 0 1.25rem' }}>
          Jan Parichay SSO for Revenue &amp; Cadastral Officers
        </p>

        {errorMsg && (
          <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={14} /><span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleOfficialLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Official Email Address */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem', display: 'block' }}>
              Official Email Address <span style={{ color: '#dc2626' }}>*</span>
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
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. officer@maharashtra.gov.in"
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
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem', display: 'block' }}>
              Password <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: '7px',
                height: '40px',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div style={{ padding: '0 0.75rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter official portal password"
                required
                style={{
                  flex: 1,
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.82rem',
                  color: '#0f172a',
                  paddingRight: '2.5rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Captcha */}
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
              {/* Captcha Box */}
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

              {/* Refresh Button */}
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

              {/* Input */}
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
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: '0 3px 8px rgba(6,78,59,0.25)',
              transition: 'all 0.15s ease',
              marginTop: '0.2rem',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#04382a')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#064e3b')}
          >
            <LogIn size={15} />
            <span>{loading ? 'Authenticating...' : 'Authenticate with Jan Parichay SSO →'}</span>
          </button>
        </form>
      </div>

      {/* ── CARD 3: Right Officer Accounts Demo Card ── */}
      <div
        style={{
          flex: '1.2 1 450px',
          maxWidth: '490px',
          minWidth: '320px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.15rem',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Wrench size={15} color="#ea580c" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
              OFFICER ACCOUNTS
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

        <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 0.6rem', lineHeight: 1.4 }}>
          Click <em>Login</em> to authenticate with officer demo credentials.
        </p>

        {/* Search Officer Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            height: '32px',
            backgroundColor: '#ffffff',
            padding: '0 0.6rem',
            marginBottom: '0.6rem',
          }}
        >
          <Search size={13} color="#94a3b8" style={{ marginRight: '0.4rem', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search officer name or designation..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.75rem',
              color: '#0f172a',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        {/* Grid of 10 Officer Cards with Scroll (Shows 6 cards at once) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
            maxHeight: '318px',
            overflowY: 'auto',
            paddingRight: '0.3rem',
          }}
        >
          {filteredOfficers.map((officer) => (
            <div
              key={officer.email + officer.role}
              style={{
                padding: '0.5rem 0.6rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.35rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem', marginBottom: '0.15rem' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 750,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={officer.name}
                  >
                    {officer.name}
                  </span>
                  <span
                    style={{
                      padding: '1px 5px',
                      borderRadius: '3px',
                      fontSize: '0.52rem',
                      fontWeight: 800,
                      backgroundColor: officer.badge.bg,
                      color: officer.badge.color,
                      flexShrink: 0,
                    }}
                  >
                    {officer.badge.label}
                  </span>
                </div>

                {officer.designation && (
                  <div
                    style={{
                      fontSize: '0.62rem',
                      color: '#475569',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '2px',
                    }}
                  >
                    {officer.designation}
                  </div>
                )}

                <code
                  style={{
                    fontSize: '0.58rem',
                    color: '#64748b',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={officer.email}
                >
                  {officer.email}
                </code>
              </div>

              {/* Action Buttons: Fill & Use this account */}
              <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', marginTop: '0.15rem' }}>
                <button
                  type="button"
                  onClick={() => handleFillAccount(officer)}
                  disabled={loading}
                  title="Auto-fill login form with this account"
                  style={{
                    padding: '3px 7px',
                    fontSize: '0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                >
                  Fill
                </button>

                <button
                  type="button"
                  onClick={() => handleDevUseAccount(officer)}
                  disabled={loading}
                  title="Directly authenticate with Jan Parichay"
                  style={{
                    flex: 1,
                    padding: '3px 6px',
                    fontSize: '0.66rem',
                    borderRadius: '4px',
                    border: '1px solid #a7f3d0',
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 750,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.2rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#d1fae5')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#ecfdf5')}
                >
                  <LogIn size={10} />
                  <span>Use this account</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovernmentLoginPage;
