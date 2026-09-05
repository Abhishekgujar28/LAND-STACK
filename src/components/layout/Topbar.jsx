import React, { useState } from 'react';

/**
 * Topbar - Indian National Government strip (PM GatiShakti & DoLR compliant)
 * Referenced from https://pmgatishakti.gov.in/pmgatishakti/login
 * Featuring Department of Land Resources (DoLR), Ministry of Rural Development,
 * and comprehensive accessibility controls (W3C WCAG 2.1 AA).
 */
export const Topbar = ({ className = '' }) => {
  const [fontSize, setFontSize] = useState('normal'); // 'sm' | 'normal' | 'lg'
  const [contrast, setContrast] = useState('normal'); // 'normal' | 'high'
  const [language, setLanguage] = useState('en');

  const handleFontSize = (size) => {
    setFontSize(size);
    const root = document.documentElement;
    if (size === 'sm') root.style.fontSize = '14px';
    else if (size === 'lg') root.style.fontSize = '18px';
    else root.style.fontSize = '16px';
  };

  const handleContrastToggle = () => {
    const newContrast = contrast === 'normal' ? 'high' : 'normal';
    setContrast(newContrast);
    if (newContrast === 'high') {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }
  };

  return (
    <header
      className={`ux4g-topbar ${className}`.trim()}
      role="region"
      aria-label="Government Identity and Accessibility Bar"
      style={{
        background: '#072a42',
        color: '#ffffff',
        fontSize: '0.78rem',
        borderBottom: '2px solid var(--ux4g-accent)',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Indian National Tricolor Strip (Saffron, White, Green) */}
      <div
        style={{
          height: '3px',
          width: '100%',
          background: 'linear-gradient(90deg, #ff9933 0%, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)',
        }}
      />

      <div className="ux4g-container d-flex justify-between align-center" style={{ padding: '0.35rem 1rem' }}>
        {/* Left Side: National Government & Ministry of Rural Development / DoLR Identity */}
        <div className="d-flex align-center gap-2" style={{ flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>🇮🇳</span>
            <span>भारत सरकार | Government of India</span>
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ color: '#e2e8f0' }}>ग्रामीण विकास मंत्रालय | Ministry of Rural Development</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ color: '#ff9933', fontWeight: 600 }}>
            भूमि संसाधन विभाग | Department of Land Resources (DoLR)
          </span>
        </div>

        {/* Right Side: Accessibility Controls (PM GatiShakti standard) */}
        <div className="d-flex align-center gap-3" style={{ flexWrap: 'wrap' }}>
          <a
            href="#main-content"
            className="ux4g-btn-text"
            style={{
              color: '#ffffff',
              fontSize: '0.75rem',
              textDecoration: 'none',
              padding: '0.15rem 0.4rem',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            Skip to Main Content
          </a>

          <span style={{ opacity: 0.4 }}>|</span>

          {/* Screen Reader Access */}
          <button
            type="button"
            title="Screen Reader Access"
            aria-label="Screen Reader Access"
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span>🔊</span>
            <span className="d-none d-md-inline">Screen Reader</span>
          </button>

          <span style={{ opacity: 0.4 }}>|</span>

          {/* Font Resizing Controls A- | A | A+ */}
          <div
            className="d-flex align-center gap-1"
            role="group"
            aria-label="Text size adjustment"
            style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '4px' }}
          >
            <button
              type="button"
              onClick={() => handleFontSize('sm')}
              aria-label="Decrease font size"
              title="Decrease font size"
              style={{
                background: fontSize === 'sm' ? 'var(--ux4g-primary)' : 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: fontSize === 'sm' ? 800 : 500,
                padding: '2px 5px',
                borderRadius: '2px',
              }}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => handleFontSize('normal')}
              aria-label="Default font size"
              title="Default font size"
              style={{
                background: fontSize === 'normal' ? 'var(--ux4g-primary)' : 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: fontSize === 'normal' ? 800 : 500,
                padding: '2px 5px',
                borderRadius: '2px',
              }}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => handleFontSize('lg')}
              aria-label="Increase font size"
              title="Increase font size"
              style={{
                background: fontSize === 'lg' ? 'var(--ux4g-primary)' : 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: fontSize === 'lg' ? 800 : 500,
                padding: '2px 5px',
                borderRadius: '2px',
              }}
            >
              A+
            </button>
          </div>

          <span style={{ opacity: 0.4 }}>|</span>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={handleContrastToggle}
            aria-label="Toggle High Contrast Mode"
            title="Toggle High Contrast Mode"
            style={{
              background: contrast === 'high' ? '#ffffff' : 'transparent',
              color: contrast === 'high' ? '#072a42' : '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '0.72rem',
              padding: '2px 6px',
              fontWeight: 600,
            }}
          >
            {contrast === 'high' ? 'High Contrast: ON' : 'High Contrast'}
          </button>

          <span style={{ opacity: 0.4 }}>|</span>

          {/* Bilingual Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            aria-label="Switch Language between Hindi and English"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 4px',
            }}
          >
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
