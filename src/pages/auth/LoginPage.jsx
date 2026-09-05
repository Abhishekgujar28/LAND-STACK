import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-login ux4g-container" style={{ maxWidth: '800px', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏛️</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ux4g-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Government of India &bull; Digital India Land Stack
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--ux4g-primary)', margin: '0.35rem 0' }}>
          Select Authentication Portal
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
          Please select your user category to proceed to the designated Single Sign-On / OTP gateway.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Citizen Card */}
        <Card style={{ borderTop: '4px solid var(--ux4g-success)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2.2rem' }}>🌾</div>
              <Badge variant="success">PUBLIC / CITIZEN</Badge>
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
              Citizen & Landholder Portal
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              For landholders, farmers, and citizens to access 7/12 RoR records, apply for e-Ferfar mutations, track applications, and view title dossiers.
            </p>
            <div style={{ background: 'var(--ux4g-surface-muted)', padding: '0.6rem 0.85rem', borderRadius: 'var(--ux4g-radius-sm)', fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>
              Authentication: <strong>e-Pramaan Mobile OTP &bull; Aadhaar</strong>
            </div>
          </div>
          <div style={{ padding: '1rem 1.5rem', background: '#fafbfc', borderTop: '1px solid var(--ux4g-border-subtle)' }}>
            <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/login/citizen')}>
              Citizen Login (Mobile OTP) →
            </Button>
          </div>
        </Card>

        {/* Government Officer Card */}
        <Card style={{ borderTop: '4px solid var(--ux4g-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2.2rem' }}>🏛️</div>
              <Badge variant="primary">GOVERNMENT OFFICERS</Badge>
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
              Government Operations Plane
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              For authorized revenue officials, Talathis, Tehsildars, SROs, District Collectors, State PMU & National monitors.
            </p>
            <div style={{ background: 'var(--ux4g-surface-muted)', padding: '0.6rem 0.85rem', borderRadius: 'var(--ux4g-radius-sm)', fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>
              Authentication: <strong>Jan Parichay MeriPehchan SSO &bull; MFA</strong>
            </div>
          </div>
          <div style={{ padding: '1rem 1.5rem', background: '#fafbfc', borderTop: '1px solid var(--ux4g-border-subtle)' }}>
            <Button variant="outline" style={{ width: '100%' }} onClick={() => navigate('/login/government')}>
              Officer Login (Jan Parichay) →
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/login/role')}>
          View All 7 Government Roles & Citizen Plane Grid →
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
