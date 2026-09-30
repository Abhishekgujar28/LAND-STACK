import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, KeyRound, Lock, UserCheck, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import { defaultDepartments } from '../../data/landingData';

/**
 * DepartmentPortals - Informational Multi-Tier Administrative Architecture
 * Explains government roles and operational boundaries across revenue, survey, and registration planes,
 * without providing unauthenticated bypass access to official cockpits.
 */
export const DepartmentPortals = ({ departments = [], className = '' }) => {
  const activeDepartments = departments && departments.length > 0 ? departments : defaultDepartments;

  return (
    <section
      className={`department-portals-section ${className}`.trim()}
      style={{
        padding: '3.5rem 0',
        background: '#ffffff',
        borderTop: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
      }}
    >
      <div className="ux4g-container">
        {/* Government Section Header */}
        <div className="section-header-compact">
          <div className="section-eyebrow-pill">
            <span className="pill-dot"></span>
            <span>Multi-Tier Administrative Architecture &bull; Department Cockpits</span>
          </div>
          <h2 className="section-main-heading">
            Institutional Planes &amp; <span className="heading-saffron">Department Cockpits</span>
          </h2>
          <p className="section-sub-heading">
            Role-based operational architecture governing revenue adjudication, deed registration, spatial cartography, and district-level cadastral intelligence.
          </p>
        </div>

        {/* Department Architecture Grid */}
        <div className="dept-arch-grid">
          {activeDepartments.map((dept) => (
            <div
              key={dept.id}
              className="dept-arch-card"
              style={{
                borderTop: `3.5px solid ${dept.color || '#064e3b'}`,
              }}
            >
              {/* Header */}
              <div className="dept-arch-header">
                <div
                  className="dept-arch-icon-box"
                  style={{
                    background: dept.color ? `${dept.color}15` : '#ecfdf5',
                    border: `1px solid ${dept.color ? `${dept.color}30` : '#d1fae5'}`,
                  }}
                >
                  {dept.icon}
                </div>
                <div>
                  <h3 className="dept-arch-title">{dept.name}</h3>
                  <span className="dept-arch-subtitle">{dept.shortName} Directorate</span>
                </div>
              </div>

              {/* Description */}
              <p className="dept-arch-desc">{dept.description}</p>

              {/* Authorized Designations & Access Security */}
              <div className="dept-arch-footer">
                <div className="dept-roles-wrap">
                  <span className="roles-label">Authorized Roles:</span>
                  <div className="roles-pill-group">
                    {dept.roles.map((role) => (
                      <span key={role} className="role-pill">
                        {role.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="dept-access-lock">
                  <Lock size={12} strokeWidth={2.4} />
                  <span>2FA / PKI Token Required</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secure Government Official Gateway Callout */}
        <div className="official-auth-banner">
          <div className="official-auth-left">
            <div className="official-shield-icon">
              <Shield size={26} className="text-forest" />
            </div>
            <div>
              <h4 className="official-banner-title">Government Personnel &amp; Revenue Officer Access</h4>
              <p className="official-banner-desc">
                Revenue Officers, Sub-Registrars, and PMU staff must authenticate through the Government SSO Gateway using government credentials, Jan Parichay, or hardware e-Tokens.
              </p>
            </div>
          </div>
          <div className="official-auth-right">
            <Link to="/login/government" className="official-login-btn">
              <KeyRound size={15} />
              <span>Official SSO Login</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentPortals;
