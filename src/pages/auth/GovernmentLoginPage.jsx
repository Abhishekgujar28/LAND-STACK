import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthSplitCard from '../../components/auth/AuthSplitCard';
import SecurityCaptcha from '../../components/auth/SecurityCaptcha';
import governmentRolesData from '../../data/users/governmentRoles.json';
import governmentUsersData from '../../data/users/governmentUsers.json';

export const GovernmentLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deptParam = searchParams.get('dept');
  const { loginAsOfficer } = useAuth();

  const rolePresets = governmentRolesData.map((r) => {
    const matchedUser = governmentUsersData.find((u) => u.role === r.role) || {};
    return {
      role: r.role,
      label: r.title,
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
    return 0;
  });

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('GovPass@2026');
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('XbfL3');

  const activeRole = rolePresets[selectedRoleIndex] || rolePresets[0];

  const handleOfficialLogin = (e) => {
    e.preventDefault();
    loginAsOfficer(activeRole.role);
    navigate(activeRole.route);
  };

  return (
    <AuthSplitCard
      title="Official Portal Login"
      subtitle="Jan Parichay SSO for Revenue & Cadastral Officers"
    >
      <form onSubmit={handleOfficialLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Official Role */}
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

        {/* Remember me */}
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
            to="/login/role"
            style={{ fontSize: '0.78rem', color: 'var(--ux4g-primary, #064e3b)', textDecoration: 'none', fontWeight: 600 }}
          >
            Role Matrix &rarr;
          </Link>
        </div>

        {/* Submit button */}
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

        <div style={{ textAlign: 'center', marginTop: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}>
          Are you a landholder or citizen?{' '}
          <Link
            to="/login/citizen"
            style={{ color: 'var(--ux4g-secondary, #ea580c)', fontWeight: 700, textDecoration: 'underline' }}
          >
            Citizen Login &rarr;
          </Link>
        </div>
      </form>
    </AuthSplitCard>
  );
};

export default GovernmentLoginPage;
