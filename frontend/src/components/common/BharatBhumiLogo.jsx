import React from 'react';

/**
 * BharatBhumiLogo - Official-style National Land Portal Emblem
 * Featuring Indian Tricolor elements, cadastral grid mesh, and Bhu sprout
 */
export const BharatBhumiLogo = ({ size = 52, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
      role="img"
      aria-label="Bharat Bhumi National Portal Logo"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="bb-tricolor-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--secondary, #ea580c)" />
          <stop offset="48%" stopColor="#FFFFFF" />
          <stop offset="52%" stopColor="var(--primary, #064e3b)" />
          <stop offset="100%" stopColor="#138808" />
        </linearGradient>

        <linearGradient id="bb-disc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary, #064e3b)" />
          <stop offset="60%" stopColor="var(--primary-dark, #022319)" />
          <stop offset="100%" stopColor="#01140e" />
        </linearGradient>

        <linearGradient id="bb-saffron-arc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--secondary, #ea580c)" />
          <stop offset="100%" stopColor="#fba759" />
        </linearGradient>

        <linearGradient id="bb-green-arc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#138808" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>

        <linearGradient id="bb-gold-leaf" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#FDE047" />
        </linearGradient>

        <filter id="bb-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer shadow / rim */}
      <circle cx="32" cy="32" r="30" fill="url(#bb-tricolor-ring)" filter="url(#bb-glow)" />

      {/* Inner background disc */}
      <circle cx="32" cy="32" r="27.5" fill="url(#bb-disc-bg)" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.8" />

      {/* Cadastral Polygon Grid Mesh */}
      <g stroke="#38BDF8" strokeWidth="0.75" strokeOpacity="0.35" fill="none">
        <polygon points="32,10 48,20 44,36 32,32" fill="#38BDF8" fillOpacity="0.08" />
        <polygon points="32,10 16,20 20,36 32,32" fill="#0EA5E9" fillOpacity="0.06" />
        <polygon points="16,20 20,36 12,46 8,30" />
        <polygon points="48,20 44,36 52,46 56,30" />
        <polygon points="20,36 32,32 32,50 18,52" fill="#138808" fillOpacity="0.1" />
        <polygon points="44,36 32,32 32,50 46,52" fill="#FF9933" fillOpacity="0.1" />
      </g>

      {/* Dynamic Tricolor Swoop Horizontally (Representing Mother Land & Nation) */}
      <path
        d="M10 33 C18 28, 26 26, 32 30 C38 34, 46 36, 54 31"
        stroke="url(#bb-saffron-arc)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M11 36 C19 31, 27 29, 32 33 C37 37, 45 39, 53 34"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.9"
      />
      <path
        d="M12 39 C20 34, 28 32, 32 36 C36 40, 44 42, 52 37"
        stroke="url(#bb-green-arc)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bhu Sprout (Mother Earth growth / Fertile Land & Prosperity) */}
      <path
        d="M32 44 C32 34, 25 29, 21 27 C24 33, 27 38, 32 44 Z"
        fill="url(#bb-green-arc)"
      />
      <path
        d="M32 44 C32 32, 40 26, 44 24 C41 31, 38 37, 32 44 Z"
        fill="url(#bb-gold-leaf)"
      />

      {/* Cadastral Geo Marker / Pin (Digital India Bhu-Aadhaar) */}
      <g transform="translate(32, 22)">
        {/* Geo-pin head */}
        <circle cx="0" cy="0" r="5" fill="#FF9933" stroke="#FFFFFF" strokeWidth="1.2" />
        {/* Center Ashoka Blue core */}
        <circle cx="0" cy="0" r="2.2" fill="#072A42" />
        {/* Pin stem */}
        <path d="M-2.2 4 L0 7.5 L2.2 4 Z" fill="#FF9933" />
      </g>

      {/* Outer subtle ticks / compass ring */}
      <circle cx="32" cy="32" r="28.8" stroke="#FF9933" strokeWidth="0.5" strokeDasharray="1.5 3" strokeOpacity="0.6" />
    </svg>
  );
};

export default BharatBhumiLogo;
