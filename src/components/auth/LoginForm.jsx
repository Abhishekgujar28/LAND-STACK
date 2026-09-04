import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Captcha from './Captcha';

/**
 * LoginForm component
 */
export const LoginForm = ({ onSubmit, defaultIdentifier = '', type = 'citizen', className = '' }) => {
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ identifier, password, captcha, type });
  };

  return (
    <form onSubmit={handleSubmit} className={`auth-login-form ${className}`.trim()}>
      <Input
        label={type === 'citizen' ? 'Mobile Number / Aadhaar / Email' : 'Government Employee ID / Email'}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder={type === 'citizen' ? 'Enter 10-digit mobile number' : 'e.g. EMP-MH-PUN-01'}
        required
      />
      <Input
        label="Password / MPIN"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />
      <Captcha value={captcha} onChange={(e) => setCaptcha(e.target.value)} />
      <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }}>
        Sign In to Portal
      </Button>
    </form>
  );
};

export default LoginForm;
