import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

/**
 * Captcha component for government login security
 */
export const Captcha = ({ value, onChange, error, className = '' }) => {
  const [captchaCode, setCaptchaCode] = useState('7K9X2');

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  return (
    <div className={`auth-captcha ${className}`.trim()} style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div
          style={{
            background: 'repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 10px, #f8fafc 10px, #f8fafc 20px)',
            padding: '0.5rem 1.25rem',
            letterSpacing: '0.3em',
            fontFamily: 'monospace',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: 'var(--ux4g-primary)',
            borderRadius: 'var(--ux4g-radius-md)',
            border: '1px solid var(--ux4g-border)',
            userSelect: 'none',
          }}
        >
          {captchaCode}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={refreshCaptcha}
          title="Refresh Captcha"
        >
          ↻
        </Button>
      </div>
      <Input
        label="Enter Captcha Code"
        value={value}
        onChange={onChange}
        placeholder="Enter characters shown above"
        error={error}
        required
      />
    </div>
  );
};

export default Captcha;
