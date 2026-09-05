import React from 'react';
import { Link } from 'react-router-dom';
import BharatBhumiLogo from '../common/BharatBhumiLogo';

/**
 * BharatBhumiBrand - National Land Portal branding block
 * Displayed on the right side of the government header
 */
export const BharatBhumiBrand = ({ className = '', size = 'sm' }) => {
  const isSmall = size === 'sm';
  const logoSize = isSmall ? 44 : 52;

  return (
    <Link
      to="/"
      title="Bharat Bhumi - National Land Governance Portal"
      className={`bharatbhumi-brand ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isSmall ? '0.65rem' : '0.85rem',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'right',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span
            style={{
              fontSize: isSmall ? '0.82rem' : '0.95rem',
              fontWeight: 800,
              color: 'var(--secondary, #ea580c)',
              lineHeight: 1.15,
              letterSpacing: '0.02em',
              fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
            }}
          >
            भारत भूमि
          </span>
          <span
            style={{
              fontSize: '0.58rem',
              fontWeight: 700,
              background: 'var(--secondary-subtle, #ffedd5)',
              color: 'var(--secondary-dark, #9a3412)',
              border: '1px solid rgba(234, 88, 12, 0.25)',
              borderRadius: '3px',
              padding: '0.5px 4px',
              letterSpacing: '0.02em',
            }}
          >
            पोर्टल
          </span>
        </div>

        <div
          style={{
            fontSize: isSmall ? '1.12rem' : '1.3rem',
            fontWeight: 900,
            color: 'var(--primary, #064e3b)',
            letterSpacing: '0.03em',
            lineHeight: 1.1,
            margin: '1px 0',
          }}
        >
          BHARAT<span style={{ color: 'var(--secondary, #ea580c)' }}>BHUMI</span>
        </div>

        <div
          style={{
            fontSize: isSmall ? '0.64rem' : '0.72rem',
            fontWeight: 600,
            color: '#64748b',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span>National Land Portal</span>
          <span style={{ color: '#cbd5e1' }}>&bull;</span>
          <span style={{ color: 'var(--primary, #064e3b)', fontWeight: 700 }}>Digital India</span>
        </div>
      </div>

      <BharatBhumiLogo size={logoSize} />
    </Link>
  );
};

export default BharatBhumiBrand;
