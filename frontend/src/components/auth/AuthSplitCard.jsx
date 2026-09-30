import React from 'react';
import {
  MapPin,
  BarChart3,
  Globe,
  ChevronDown,
  UserCheck,
  Lock,
  Landmark,
  FileCheck2,
} from 'lucide-react';
import emblemSvg from '../../assets/logos/emblem.svg';

/**
 * AuthSplitCard - Two-column GOI auth layout.
 * Compact single-view layout — no internal scroll. Both columns stretch to full card height.
 */
export const AuthSplitCard = ({
  children,
  activeTab = null,
  onTabChange = null,
  title = null,
  subtitle = null,
  badge = null,
  mode = 'official', // 'citizen' | 'official'
}) => {
  const isCitizen = mode === 'citizen' || activeTab === 'citizen';

  const pillStyle = (alpha = 0.12, border = 0.2) => ({
    backgroundColor: `rgba(255,255,255,${alpha})`,
    backdropFilter: 'blur(6px)',
    border: `1px solid rgba(255,255,255,${border})`,
    borderRadius: '8px',
    padding: '0.38rem 0.55rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  });

  const iconBox = (bg, color) => ({
    width: '24px', height: '24px', borderRadius: '5px',
    backgroundColor: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, color,
  });

  return (
    <div
      className="auth-split-container"
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        boxShadow: isCitizen
          ? '0 20px 50px -12px rgba(6,78,59,0.2), 0 0 0 1px rgba(6,78,59,0.1)'
          : '0 20px 50px -12px rgba(15,23,42,0.25), 0 0 0 1px rgba(15,23,42,0.12)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 34%) 1fr',
        alignItems: 'stretch',
        boxSizing: 'border-box',
        fontFamily: 'var(--ux4g-font-sans)',
      }}
    >
      {/* ── LEFT: Trust & Identity Panel ── */}
      <div
        style={{
          background: isCitizen
            ? 'linear-gradient(165deg,#1b5338 0%,#064e3b 55%,#032b1f 100%)'
            : 'linear-gradient(165deg,#0f172a 0%,#1e293b 55%,#0b1e33 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: isCitizen
              ? 'radial-gradient(circle at 20% 20%,rgba(255,255,255,0.07) 0%,transparent 40%),radial-gradient(circle at 80% 80%,rgba(234,88,12,0.12) 0%,transparent 45%)'
              : 'radial-gradient(circle at 20% 20%,rgba(250,204,21,0.07) 0%,transparent 40%),radial-gradient(circle at 80% 80%,rgba(56,189,248,0.1) 0%,transparent 45%)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Emblem */}
          <div
            style={{
              width: '46px', height: '46px', borderRadius: '50%',
              backgroundColor: '#ffffff',
              margin: '0 auto 0.55rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(0,0,0,0.22)',
              padding: '3px',
              border: isCitizen ? '2px solid #bbf7d0' : '2px solid #fde047',
            }}
          >
            <img src={emblemSvg} alt="State Emblem of India" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.05em', color: '#ffffff', textTransform: 'uppercase', lineHeight: 1.15 }}>
            BHARAT<span style={{ color: isCitizen ? '#ea580c' : '#facc15' }}>BHUMI</span>
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isCitizen ? '#fed7aa' : '#fde047', marginTop: '0.18rem' }}>
            {isCitizen ? 'Citizen Landholder Portal' : 'Jan Parichay Official SSO'}
          </div>
          <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.06rem' }}>
            Dept. of Land Resources &bull; Govt of India
          </div>
        </div>

        {/* Trust Pills */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.85rem 0 0.5rem' }}>
          {isCitizen ? (
            <>
              <div style={pillStyle()}>
                <div style={iconBox('rgba(255,255,255,0.2)', '#ffffff')}><UserCheck size={13} strokeWidth={2.2} /></div>
                <div>
                  <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>e-Pramaan &amp; DigiLocker</div>
                  <div style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.82)' }}>Aadhaar OTP mobile verification</div>
                </div>
              </div>
              <div style={pillStyle()}>
                <div style={iconBox('rgba(255,255,255,0.2)', '#ffffff')}><FileCheck2 size={13} strokeWidth={2.2} /></div>
                <div>
                  <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>Certified Extracts &amp; e-Ferfar</div>
                  <div style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.82)' }}>Court-admissible 7/12 &amp; 8A</div>
                </div>
              </div>
              <div style={pillStyle()}>
                <div style={iconBox('rgba(255,255,255,0.2)', '#ffffff')}><MapPin size={13} strokeWidth={2.2} /></div>
                <div>
                  <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>Bhu-Aadhaar ULPIN GIS</div>
                  <div style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.82)' }}>14-digit parcel boundary</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={pillStyle(0.08, 0.15)}>
                <div style={iconBox('rgba(250,204,21,0.18)', '#facc15')}><Lock size={13} strokeWidth={2.2} /></div>
                <div>
                  <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>Jan Parichay SSO Security</div>
                  <div style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.78)' }}>Multi-factor officer authentication</div>
                </div>
              </div>
              <div style={pillStyle(0.08, 0.15)}>
                <div style={iconBox('rgba(56,189,248,0.18)', '#38bdf8')}><Landmark size={13} strokeWidth={2.2} /></div>
                <div>
                  <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>Statutory Revenue Bench</div>
                  <div style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.78)' }}>Tehsildar, SRO &amp; Collector</div>
                </div>
              </div>
              <div style={pillStyle(0.08, 0.15)}>
                <div style={iconBox('rgba(74,222,128,0.18)', '#4ade80')}><BarChart3 size={13} strokeWidth={2.2} /></div>
                <div>
                  <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>Cadastral Intelligence</div>
                  <div style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.78)' }}>Tehsil queues &amp; audit trails</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer label */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', fontSize: '0.63rem', color: 'rgba(255,255,255,0.65)' }}>
          {isCitizen ? 'Digital India Land Records' : 'NIC / DoLR Sovereign Land Mesh'}
        </div>
      </div>

      {/* Right Side: Clean White Form Area */}
      <div
        style={{
          padding: '1.35rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
        }}
      >
        <div>
          {/* Top Bar: Portal Mode Toggle + Language */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #f1f5f9',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            {onTabChange && (
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '6px',
                  padding: '2px',
                  gap: '2px',
                }}
              >
                <button
                  type="button"
                  onClick={() => onTabChange('official')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '5px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: activeTab === 'official' ? '#0f172a' : 'transparent',
                    color: activeTab === 'official' ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Official Portal
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange('citizen')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '5px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: activeTab === 'citizen' ? 'var(--ux4g-primary, #064e3b)' : 'transparent',
                    color: activeTab === 'citizen' ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Citizen Portal
                </button>
              </div>
            )}

            {/* Language Selector */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem',
                color: '#475569',
                cursor: 'pointer',
                marginLeft: 'auto',
                padding: '0.25rem 0.5rem',
                borderRadius: '5px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Globe size={13} color="#64748b" />
              <span>English</span>
              <ChevronDown size={12} color="#94a3b8" />
            </div>
          </div>

          {/* Title & Subtitle */}
          {(title || subtitle) && (
            <div style={{ marginBottom: '0.7rem', textAlign: 'center' }}>
              {badge && <div style={{ marginBottom: '0.25rem' }}>{badge}</div>}
              {title && (
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: isCitizen ? 'var(--ux4g-primary, #064e3b)' : '#0f172a', margin: '0 0 0.15rem' }}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, lineHeight: 1.35 }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Children Form */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthSplitCard;

