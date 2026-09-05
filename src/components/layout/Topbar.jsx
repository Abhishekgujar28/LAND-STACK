import React, { useState } from 'react';

/**
 * Topbar - Indian National Government strip (PM GatiShakti & DoLR compliant)
 * Sleek, compact accessibility bar with DoLR identity in orange
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
      className={`site-topbar ${className}`.trim()}
      role="region"
      aria-label="Government Identity and Accessibility Bar"
      style={{
        background: 'var(--primary-dark, #022319)',
        color: '#ffffff',
        fontSize: '0.72rem',
        borderBottom: '1px solid var(--secondary, #ea580c)',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Indian National Tricolor Strip (Saffron, White, Green) */}
      <div
        style={{
          height: '2px',
          width: '100%',
          background: 'linear-gradient(90deg, #ff9933 0%, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)',
        }}
      />

      <div
        className="ux4g-container d-flex justify-between align-center"
        style={{ padding: '0.18rem 1rem', minHeight: '26px' }}
      >
        {/* Left Side: National Government & Ministry of Rural Development / DoLR Identity */}
        <div className="d-flex align-center gap-2" style={{ flexWrap: 'wrap', lineHeight: 1.2 }}>
          <span style={{ fontWeight: 700, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>🇮🇳</span>
            <span>भारत सरकार | Government of India</span>
          </span>
          <span style={{ opacity: 0.35 }}>|</span>
          <span style={{ color: '#cbd5e1' }}>ग्रामीण विकास मंत्रालय | Ministry of Rural Development</span>
          <span style={{ opacity: 0.35 }}>|</span>
          <span style={{ color: 'var(--secondary, #ea580c)', fontWeight: 700, letterSpacing: '0.01em' }}>
            भूमि संसाधन विभाग | Department of Land Resources (DoLR)
          </span>
        </div>

        {/* Right Side: Accessibility Controls (PM GatiShakti standard) */}
        <div className="d-flex align-center gap-2" style={{ flexWrap: 'wrap', lineHeight: 1.2 }}>
          <a
            href="#main-content"
            className="ux4g-btn-text"
            style={{
              color: '#ffffff',
              fontSize: '0.68rem',
              textDecoration: 'none',
              padding: '0.1rem 0.35rem',
              borderRadius: '2px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            Skip to Main Content
          </a>

          <span style={{ opacity: 0.35 }}>|</span>

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
              fontSize: '0.68rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              padding: '0.1rem 0.2rem',
            }}
          >
            <span>🔊</span>
            <span className="d-none d-md-inline">Screen Reader</span>
          </button>

          <span style={{ opacity: 0.35 }}>|</span>

          {/* Font Resizing Controls A- | A | A+ */}
          <div
            className="d-flex align-center gap-1"
            role="group"
            aria-label="Text size adjustment"
            style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 3px', borderRadius: '3px' }}
          >
            <button
              type="button"
              onClick={() => handleFontSize('sm')}
              aria-label="Decrease font size"
              title="Decrease font size"
              style={{
                background: fontSize === 'sm' ? 'var(--secondary, #ea580c)' : 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.66rem',
                fontWeight: fontSize === 'sm' ? 800 : 500,
                padding: '1px 4px',
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
                background: fontSize === 'normal' ? 'var(--secondary, #ea580c)' : 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.68rem',
                fontWeight: fontSize === 'normal' ? 800 : 500,
                padding: '1px 4px',
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
                background: fontSize === 'lg' ? 'var(--secondary, #ea580c)' : 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: fontSize === 'lg' ? 800 : 500,
                padding: '1px 4px',
                borderRadius: '2px',
              }}
            >
              A+
            </button>
          </div>

          <span style={{ opacity: 0.35 }}>|</span>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={handleContrastToggle}
            aria-label="Toggle High Contrast Mode"
            title="Toggle High Contrast Mode"
            style={{
              background: contrast === 'high' ? '#ffffff' : 'transparent',
              color: contrast === 'high' ? '#000000' : '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '0.68rem',
              padding: '1px 5px',
              fontWeight: 600,
            }}
          >
            {contrast === 'high' ? 'Contrast: ON' : 'High Contrast'}
          </button>

          <span style={{ opacity: 0.35 }}>|</span>

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
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '1px 4px',
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
