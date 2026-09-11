import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DepartmentPortals - Grid of clickable department login/dashboard tiles
 * Structured per UX4G & GIGW standards, modeled after PM GatiShakti administrative planes
 */
export const DepartmentPortals = ({ departments = [], className = '' }) => {
  return (
    <section
      className={`department-portals ${className}`.trim()}
      style={{
        padding: '3.5rem 0',
        background: '#ffffff',
        borderTop: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
      }}
    >
      <div className="ux4g-container">
        {/* Government Section Header (GIGW / PM GatiShakti style) */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--primary-light, #ecfdf5)',
              color: 'var(--primary, #064e3b)',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.76rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              border: '1px solid var(--primary-subtle, #d1fae5)',
            }}
          >
            <span>🏛️</span>
            <span>विभागीय पोर्टल एवं अधिकारी डैशबोर्ड | Administrative Planes</span>
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary, #064e3b)', margin: '0.2rem 0 0.4rem' }}>
            Government Department Portals
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary, #475569)', maxWidth: '720px', margin: '0 auto' }}>
            Role-based authenticated portals for Revenue Officers, Sub-Registrars, District Collectors, and State PMU teams.
          </p>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--secondary, #ea580c)',
              margin: '0.75rem auto 0',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Department Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {departments.map((dept) => (
            <Link
              key={dept.id}
              to={dept.dashboardRoute}
              style={{
                background: '#ffffff',
                border: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
                borderTop: `3px solid ${dept.color || 'var(--primary, #064e3b)'}`,
                borderRadius: '8px',
                padding: '1.25rem',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: dept.color ? `${dept.color}15` : 'var(--primary-light, #ecfdf5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0,
                    border: `1px solid ${dept.color ? `${dept.color}30` : 'var(--primary-subtle)'}`,
                  }}
                >
                  {dept.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--ux4g-text, #0f172a)',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {dept.name}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {dept.shortName} Portal
                  </span>
                </div>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--ux4g-text-secondary, #475569)',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.45,
                  flex: 1,
                }}
              >
                {dept.description}
              </p>

              {/* Roles & Launch Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {dept.roles.map((role) => (
                    <span
                      key={role}
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 600,
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {role.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: dept.color || 'var(--primary, #064e3b)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span>Launch Cockpit</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentPortals;
