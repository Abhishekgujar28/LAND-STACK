import React, { useState } from 'react';
import { Star, Volume2, VolumeX } from 'lucide-react';

/**
 * Topbar - Official Government of India Utility Strip & Accessibility Toolbar
 * Fully functional across all pages: font-size scaling, high contrast toggle,
 * screen reader audio synthesis, and Hindi/English localization toggle.
 */
export const Topbar = ({ className = '' }) => {
  const [fontSize, setFontSize] = useState('normal'); // 'sm' | 'normal' | 'lg'
  const [contrast, setContrast] = useState('normal'); // 'normal' | 'high'
  const [language, setLanguage] = useState('en');
  const [isReading, setIsReading] = useState(false);

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

  const handleScreenReader = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      } else {
        const pageTitle = document.title || 'BharatBhumi National Land Governance Portal';
        const mainContent = document.getElementById('main-content')?.innerText?.slice(0, 400) || '';
        const textToRead = `${pageTitle}. ${mainContent}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95;
        utterance.onend = () => setIsReading(false);
        utterance.onerror = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
      }
    } else {
      alert('Screen reader text-to-speech is not supported in this browser.');
    }
  };

  return (
    <div
      className={`site-topbar ${className}`.trim()}
      role="region"
      aria-label="Government Identity and Accessibility Ribbon"
      style={{
        background: '#075037',
        color: '#ffffff',
        fontSize: '0.74rem',
        padding: '0.3rem 0',
        position: 'relative',
        zIndex: 100,
      }}
    >
      <div
        className="ux4g-container d-flex justify-between align-center"
        style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem', flexWrap: 'wrap', gap: '0.5rem', minHeight: '26px' }}
      >
        {/* Left Side: National Government & Ministry of Rural Development */}
        <div className="d-flex align-center gap-2" style={{ flexWrap: 'wrap', lineHeight: 1.2 }}>
          <span style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Star size={13} style={{ color: '#fed7aa', fill: '#fed7aa' }} />
            <span>Government of India</span>
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ color: '#e2e8f0', fontWeight: 500 }}>
            Ministry of Rural Development
          </span>
        </div>

        {/* Right Side: Accessibility Controls */}
        <div className="d-flex align-center gap-2" style={{ flexWrap: 'wrap', lineHeight: 1.2 }}>
          <a
            href="#main-content"
            style={{
              color: '#ffffff',
              fontSize: '0.7rem',
              textDecoration: 'none',
              padding: '0.15rem 0.55rem',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(0, 0, 0, 0.25)',
              fontWeight: 500,
            }}
          >
            Skip to Main Content
          </a>

          {/* Screen Reader Access */}
          <button
            type="button"
            onClick={handleScreenReader}
            title={isReading ? 'Stop Reading' : 'Screen Reader Access'}
            aria-label={isReading ? 'Stop Reading' : 'Screen Reader Access'}
            style={{
              background: isReading ? '#ea580c' : 'none',
              border: isReading ? '1px solid #ea580c' : 'none',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.7rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.15rem 0.45rem',
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
          >
            {isReading ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <span>{isReading ? 'Stop Audio' : 'Screen Reader'}</span>
          </button>

          {/* Font Resizing Controls A- | A | A+ */}
          <div
            className="d-flex align-center gap-1"
            role="group"
            aria-label="Text size adjustment"
          >
            <button
              type="button"
              onClick={() => handleFontSize('sm')}
              aria-label="Decrease font size"
              title="Decrease font size"
              style={{
                background: fontSize === 'sm' ? '#1b7d5a' : 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.66rem',
                fontWeight: 600,
                padding: '0.1rem 0.35rem',
                borderRadius: '3px',
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
                background: fontSize === 'normal' ? '#1b7d5a' : 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '0.1rem 0.35rem',
                borderRadius: '3px',
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
                background: fontSize === 'lg' ? '#1b7d5a' : 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.1rem 0.35rem',
                borderRadius: '3px',
              }}
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={handleContrastToggle}
            aria-label="Toggle High Contrast Mode"
            title="Toggle High Contrast Mode"
            style={{
              background: contrast === 'high' ? '#ffffff' : 'rgba(0,0,0,0.25)',
              color: contrast === 'high' ? '#000000' : '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              padding: '0.15rem 0.5rem',
              fontWeight: 600,
            }}
          >
            High Contrast
          </button>

          <span style={{ opacity: 0.4 }}>|</span>

          {/* Language Switcher */}
          <div className="d-flex align-center gap-1" style={{ fontSize: '0.72rem', fontWeight: 600 }}>

            <span style={{ opacity: 0.4 }}>|</span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-label="Switch to English"
              style={{
                background: 'none',
                border: 'none',
                color: language === 'en' ? '#fed7aa' : '#ffffff',
                cursor: 'pointer',
                padding: 0,
                fontWeight: language === 'en' ? 800 : 500,
                textDecoration: language === 'en' ? 'underline' : 'none',
              }}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
