import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GOVERNMENT_ROLE_PRESETS } from '../../config/roles';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

import { DEFAULT_CITIZENS, DEFAULT_OFFICERS } from '../../context/authConstants';

export const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { loginAsOfficer, loginAsCitizen } = useAuth();

  const handleSelectGovRole = async (item) => {
    try {
      const officer = DEFAULT_OFFICERS[item.role];
      if (officer?.email) {
        await loginAsOfficer(officer.email, officer.password || 'Password123!');
      }
      navigate(item.route);
    } catch (err) {
      console.error('Failed to authenticate as officer:', err);
      navigate('/login/government');
    }
  };

  const handleSelectCitizen = async () => {
    try {
      const citizen = DEFAULT_CITIZENS[0];
      await loginAsCitizen(citizen.mobile, '123456');
      navigate('/citizen/dashboard');
    } catch (err) {
      console.error('Failed to authenticate as citizen:', err);
      navigate('/login/citizen');
    }
  };

  return (
    <div className="page-role-selection ux4g-container" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ux4g-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Government of India / Department of Land Resources (DoLR)
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
          Select Authorized Portal Role
        </h1>
        <p style={{ color: 'var(--ux4g-text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '0.95rem' }}>
          Land Stack implements strict role-based access control (RBAC) across the Citizen Plane and the 7 Government Department Administrative Planes.
        </p>
      </div>

      {/* Citizen Plane Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--ux4g-radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2.2rem', background: '#ffffff', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--ux4g-shadow-sm)' }}>
            🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ux4g-primary)' }}>
                Citizen / Landholder Plane
              </h2>
              <Badge variant="success">PUBLIC / CITIZEN</Badge>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.2rem' }}>
              Access personal land parcels, certified 7/12 RoR extracts, apply for e-Ferfar mutation, track applications & due diligence.
            </div>
          </div>
        </div>

        <Button variant="primary" size="md" onClick={handleSelectCitizen}>
          Login as Citizen (Abhishek Gujar) →
        </Button>
      </div>

      {/* Government Plane Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--ux4g-primary)' }}>
            🏛️ Government Operations Plane (7 Roles)
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
            Task-first administrative workspaces tailored to official statutory competence and geographic jurisdiction
          </div>
        </div>
        <Badge variant="warning">7 Authorized Workspaces</Badge>
      </div>

      {/* 7 Government Roles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {GOVERNMENT_ROLE_PRESETS.map((item) => (
          <Card
            key={item.role}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `4px solid ${item.color}`,
              transition: 'transform var(--ux4g-transition-fast), box-shadow var(--ux4g-transition-fast)',
            }}
          >
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `${item.color}15`,
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--ux4g-primary)' }}>
                      {item.title}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                      {item.vernacular} • {item.designation}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <Badge variant="primary" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>
                  {item.badgeText}
                </Badge>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginBottom: '1rem', minHeight: '52px', lineHeight: 1.5 }}>
                {item.description}
              </p>

              <div
                style={{
                  background: 'var(--ux4g-surface-muted)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--ux4g-radius-sm)',
                  fontSize: '0.78rem',
                  color: 'var(--ux4g-text)',
                  marginBottom: '1rem',
                }}
              >
                <div><strong>Sample Officer:</strong> {item.sampleOfficer}</div>
                <div><strong>Jurisdiction:</strong> {item.jurisdiction}</div>
              </div>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--ux4g-border-subtle)', background: '#fafbfc' }}>
              <Button
                variant="primary"
                size="sm"
                style={{ width: '100%', background: item.color, borderColor: item.color }}
                onClick={() => handleSelectGovRole(item)}
              >
                Login as {(item.title || item.role || 'Officer').split('/')[0]} →
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleSelectionPage;
