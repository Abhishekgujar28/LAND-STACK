import React from 'react';
import { Link } from 'react-router-dom';

/**
 * QuickActions - Core Citizen Land Record Access Matrix
 * Conforms to UX4G / GIGW standards, modeled after PM GatiShakti service tiles
 */
export const QuickActions = ({ className = '' }) => {
  const actions = [
    {
      title: 'Record of Rights (7/12 & 8A)',
      subtitle: 'Instant digitally signed RoR extracts with QR verification',
      icon: '📜',
      badge: 'Certified Extract',
      to: '/services',
    },
    {
      title: 'Check Mutation Status (e-Ferfar)',
      subtitle: 'Real-time tracking of pencil entries, notices & Talathi approvals',
      icon: '⚡',
      badge: 'Live Status',
      to: '/citizen/mutations',
    },
    {
      title: 'GIS Cadastral Map (Bhu-Naksha)',
      subtitle: 'Geo-referenced parcel boundaries, survey numbers & buffer zones',
      icon: '🗺️',
      badge: 'Spatial GIS',
      to: '/citizen/search',
    },
    {
      title: 'Due Diligence & Encumbrance',
      subtitle: 'Instant check across CERSAI mortgage, litigation & Akar dues',
      icon: '🛡️',
      badge: 'Risk Score',
      to: '/citizen/due-diligence',
    },
    {
      title: 'ULPIN (Bhu-Aadhaar) Lookup',
      subtitle: 'Validate unique 14-digit national land identifier & geotag',
      icon: '📍',
      badge: '14-Digit PIN',
      to: '/citizen/search',
    },
    {
      title: 'Lodge Grievance / Appeal',
      subtitle: 'Time-bound grievance redressal & revenue tribunal tracking',
      icon: '⚖️',
      badge: 'CPGRAMS Sync',
      to: '/contact',
    },
  ];

  return (
    <div
      className={`landing-quick-actions ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {actions.map((act, index) => (
        <Link
          key={index}
          to={act.to}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1.25rem',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
            borderLeft: '4px solid var(--primary, #064e3b)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderLeftColor = 'var(--secondary, #ea580c)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
            e.currentTarget.style.borderLeftColor = 'var(--primary, #064e3b)';
          }}
        >
          {/* Icon Badge */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: 'var(--primary-light, #ecfdf5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              flexShrink: 0,
              border: '1px solid var(--primary-subtle, #d1fae5)',
            }}
          >
            {act.icon}
          </div>

          {/* Text Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <h3
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  color: 'var(--primary, #064e3b)',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {act.title}
              </h3>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  background: 'var(--secondary-light, #fff7ed)',
                  color: 'var(--secondary-dark, #9a3412)',
                  border: '1px solid var(--secondary-subtle, #ffedd5)',
                  borderRadius: '3px',
                  padding: '1px 5px',
                }}
              >
                {act.badge}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--ux4g-text-secondary, #475569)',
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              {act.subtitle}
            </p>
          </div>

          {/* Action Arrow */}
          <span
            style={{
              fontSize: '1rem',
              color: 'var(--secondary, #ea580c)',
              fontWeight: 700,
              alignSelf: 'center',
              flexShrink: 0,
            }}
          >
            &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
