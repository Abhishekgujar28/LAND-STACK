import React, { useState } from 'react';

/**
 * Common LanguageSwitcher component
 */
export const LanguageSwitcher = ({ className = '' }) => {
  const [lang, setLang] = useState('en');

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
  ];

  return (
    <div className={`common-lang-switcher ${className}`.trim()} style={{ display: 'inline-flex', gap: '0.25rem' }}>
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          style={{
            background: lang === l.code ? 'var(--ux4g-primary-light)' : 'transparent',
            color: lang === l.code ? 'var(--ux4g-primary)' : 'var(--ux4g-text-secondary)',
            fontWeight: lang === l.code ? 700 : 500,
            border: '1px solid',
            borderColor: lang === l.code ? 'var(--ux4g-primary)' : 'transparent',
            borderRadius: 'var(--ux4g-radius-sm)',
            padding: '0.2rem 0.5rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
