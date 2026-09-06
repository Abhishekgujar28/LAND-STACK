import React from 'react';

/**
 * DigitalIndiaLogo - Official Digital India Flagship Emblem
 * "Digital India - Power To Empower"
 */
export const DigitalIndiaLogo = ({ size = 52, className = '' }) => {
  return (
    <div
      className={`digital-india-logo-wrapper ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size * 0.78}
        viewBox="0 0 72 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Digital India Logo"
      >
        {/* Tricolor Ribbon Loop (i shape) */}
        {/* Saffron arc */}
        <path
          d="M22 6 C32 6, 40 14, 40 24 C40 34, 32 42, 22 42 C12 42, 6 34, 6 24 C6 18, 10 12, 16 8"
          stroke="#FF9933"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* White / Blue inner arc */}
        <path
          d="M22 13 C28 13, 33 18, 33 24 C33 30, 28 35, 22 35 C16 35, 13 30, 13 24"
          stroke="#000080"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Green outer base arc */}
        <path
          d="M18 42 C26 42, 36 44, 44 49 C48 51, 52 52, 58 52"
          stroke="#138808"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cyan power dot */}
        <circle cx="22" cy="24" r="3.5" fill="#00AEEF" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span
          style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            color: '#1e293b',
            letterSpacing: '-0.01em',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Digital India
        </span>
        <span
          style={{
            fontSize: '0.58rem',
            fontWeight: 600,
            color: '#0284c7',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}
        >
          Power To Empower
        </span>
      </div>
    </div>
  );
};

export default DigitalIndiaLogo;
