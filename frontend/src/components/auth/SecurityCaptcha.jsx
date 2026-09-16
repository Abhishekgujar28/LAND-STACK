import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

/**
 * SecurityCaptcha - Compact Official-style Security Verification Captcha
 */
export const SecurityCaptcha = ({ value, onChange, onVerifyChange, onCaptchaCodeChange }) => {
  const [captchaText, setCaptchaText] = useState('XbfL3');

  const generateNewCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    if (onVerifyChange) {
      onVerifyChange(false);
    }
  };

  useEffect(() => {
    if (onCaptchaCodeChange) {
      onCaptchaCodeChange(captchaText);
    }
  }, [captchaText, onCaptchaCodeChange]);

  useEffect(() => {
    if (onVerifyChange) {
      onVerifyChange(value.trim().toLowerCase() === captchaText.toLowerCase());
    }
  }, [value, captchaText, onVerifyChange]);

  return (
    <div className="ux4g-form-group" style={{ marginBottom: '0.75rem' }}>
      <label
        className="ux4g-label ux4g-label-required"
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#334155',
          marginBottom: '0.25rem',
          display: 'block',
        }}
      >
        Security Verification <span style={{ color: '#dc2626' }}>*</span>
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Captcha Visual Display Box */}
        <div
          style={{
            position: 'relative',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '0.3rem 0.65rem',
            letterSpacing: '0.25em',
            fontFamily: 'monospace, Courier, sans-serif',
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#1e293b',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '95px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
          title="Security verification code"
        >
          {/* Noise line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '-10%',
              right: '-10%',
              height: '1.2px',
              backgroundColor: '#94a3b8',
              transform: 'rotate(-4deg)',
              pointerEvents: 'none',
            }}
          />
          <span style={{ position: 'relative', zIndex: 2 }}>{captchaText}</span>
        </div>

        {/* Reload Button */}
        <button
          type="button"
          onClick={generateNewCaptcha}
          aria-label="Refresh security code"
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          <RotateCw size={14} />
        </button>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter code"
          maxLength={6}
          style={{
            flex: 1,
            height: '36px',
            padding: '0.35rem 0.65rem',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '0.825rem',
            outline: 'none',
          }}
          required
        />
      </div>
    </div>
  );
};

export default SecurityCaptcha;
