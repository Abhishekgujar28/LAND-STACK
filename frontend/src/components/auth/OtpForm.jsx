import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

/**
 * OtpForm component
 */
export const OtpForm = ({ onSubmit, mobileNumber = '******4589', onResend, className = '' }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(otp);
  };

  return (
    <form onSubmit={handleSubmit} className={`auth-otp-form ${className}`.trim()}>
      <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', marginBottom: '1rem' }}>
        Please enter the 6-digit verification code sent to your registered mobile ending in <strong>{mobileNumber}</strong>.
      </p>
      <Input
        label="6-Digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        maxLength={6}
        required
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>Valid for 10 minutes</span>
        <button
          type="button"
          onClick={onResend}
          style={{ background: 'none', border: 'none', color: 'var(--ux4g-primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >
          Resend OTP
        </button>
      </div>
      <Button type="submit" variant="primary" style={{ width: '100%' }}>
        Verify & Continue
      </Button>
    </form>
  );
};

export default OtpForm;
