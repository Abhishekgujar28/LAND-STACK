import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-forgot-password ux4g-container" style={{ maxWidth: '480px', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🔑</div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: '0.25rem 0' }}>
          Reset Credentials
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-muted)', margin: 0 }}>
          Recover your Citizen or Government portal account access
        </p>
      </div>

      <Card style={{ padding: '1.5rem' }}>
        {submitted ? (
          <div>
            <Alert variant="success" style={{ marginBottom: '1.25rem' }}>
              A security verification link has been dispatched to your registered communication channel.
            </Alert>
            <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/login')}>
              Return to Login Gateway →
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Registered Mobile Number / Official Email</label>
              <input
                type="text"
                className="ux4g-input"
                placeholder="e.g. +91 98230 45891 or official@landstack.gov.in"
                value={mobileOrEmail}
                onChange={(e) => setMobileOrEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginTop: '0.75rem' }}>
              Send Verification Link →
            </Button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{ background: 'none', border: 'none', color: 'var(--ux4g-primary)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
