import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const OtpPage = () => {
  const navigate = useNavigate();
  const { loginAsCitizen } = useAuth();
  const [otp, setOtp] = useState('123456');

  const handleVerify = (e) => {
    e.preventDefault();
    loginAsCitizen('CIT-001');
    navigate('/citizen/dashboard');
  };

  return (
    <div className="page-otp ux4g-container" style={{ maxWidth: '480px', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🔐</div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: '0.25rem 0' }}>
          OTP Verification
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-muted)', margin: 0 }}>
          Enter the 6-digit security code sent to your registered mobile number
        </p>
      </div>

      <Card style={{ padding: '1.5rem' }}>
        <Alert variant="info" style={{ marginBottom: '1.25rem' }}>
          One-Time Password (OTP) sent to <strong>+91 98230 45891</strong>.
        </Alert>

        <form onSubmit={handleVerify}>
          <div className="ux4g-form-group">
            <label className="ux4g-label ux4g-label-required">6-Digit One-Time Password</label>
            <input
              type="text"
              className="ux4g-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ fontSize: '1.25rem', letterSpacing: '0.35em', textAlign: 'center' }}
              maxLength={6}
              required
            />
            <span className="ux4g-form-helper">Demo mock OTP pre-filled with 123456</span>
          </div>

          <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginTop: '0.75rem' }}>
            Verify & Proceed →
          </Button>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => navigate('/login/citizen')}
              style={{ background: 'none', border: 'none', color: 'var(--ux4g-primary)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ← Back to Citizen Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default OtpPage;
