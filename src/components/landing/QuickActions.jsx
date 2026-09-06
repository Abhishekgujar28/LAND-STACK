import React from 'react';
import { Link } from 'react-router-dom';

/**
 * QuickActions - Core Citizen Land Record Access Matrix
 * Semantic color hierarchy:
 * - Green: Static Land Records, Spatial GIS & National Identifiers (RoR, Bhu-Naksha, ULPIN)
 * - Orange: Time-Sensitive Workflows, Risk Due Diligence & Grievance Redressal (Mutation, Encumbrance, Appeal)
 */
export const QuickActions = ({ className = '' }) => {
  const actions = [
    {
      title: 'Record of Rights (7/12 & 8A)',
      subtitle: 'Instant digitally signed RoR extracts with QR verification and official seals',
      icon: '📜',
      badge: 'Certified Extract',
      theme: 'green',
      to: '/services',
    },
    {
      title: 'Check Mutation Status (e-Ferfar)',
      subtitle: 'Real-time tracking of pencil entries, notices, objections & Talathi approvals',
      icon: '⚡',
      badge: 'Live Workflow',
      theme: 'orange',
      to: '/citizen/mutations',
    },
    {
      title: 'GIS Cadastral Map (Bhu-Naksha)',
      subtitle: 'Geo-referenced parcel boundaries, survey numbers & spatial buffer overlays',
      icon: '🗺️',
      badge: 'Spatial GIS',
      theme: 'green',
      to: '/citizen/search',
    },
    {
      title: 'Due Diligence & Encumbrance',
      subtitle: 'Instant check across CERSAI mortgage, litigation registers & revenue dues',
      icon: '🛡️',
      badge: 'Risk Verification',
      theme: 'orange',
      to: '/citizen/due-diligence',
    },
    {
      title: 'ULPIN (Bhu-Aadhaar) Lookup',
      subtitle: 'Validate unique 14-digit national land identifier, ownership & geotag',
      icon: '📍',
      badge: '14-Digit PIN',
      theme: 'green',
      to: '/citizen/search',
    },
    {
      title: 'Lodge Grievance / Appeal',
      subtitle: 'Time-bound revenue tribunal tracking & grievance redressal portal',
      icon: '⚖️',
      badge: 'CPGRAMS Sync',
      theme: 'orange',
      to: '/contact',
    },
  ];

  return (
    <div
      className={`landing-quick-actions ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {actions.map((act, index) => (
        <Link
          key={index}
          to={act.to}
          className={`quick-action-card card-theme-${act.theme}`}
        >
          {/* Icon Badge */}
          <div className="action-icon-wrapper">
            <span className="action-icon">{act.icon}</span>
          </div>

          {/* Text Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
              <h3 className="action-title">
                {act.title}
              </h3>
              <span className="action-badge">
                {act.badge}
              </span>
            </div>
            <p className="action-subtitle">
              {act.subtitle}
            </p>
          </div>

          {/* Action Arrow */}
          <span className="action-arrow">
            &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
