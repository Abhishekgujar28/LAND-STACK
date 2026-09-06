import React from 'react';
import {
  MapPin,
  ShieldCheck,
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
 * AuthSplitCard - Two-column authenticated split layout matching official GOI standards
 * Differentiates Citizen Login from Official Login with distinct visual themes and trust points.
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

  return (
    <div
      className="auth-split-container"
      style={{
        width: '100%',
        maxWidth: '840px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: isCitizen
          ? '0 15px 35px -10px rgba(6, 78, 59, 0.18), 0 0 0 1px rgba(6, 78, 59, 0.12)'
          : '0 15px 35px -10px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(15, 23, 42, 0.14)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 40%) 1fr',
        minHeight: '490px',
        boxSizing: 'border-box',
        fontFamily: 'var(--ux4g-font-sans)',
      }}
    >
      {/* Left Side: Differentiated Trust & Identity Panel */}
      <div
        style={{
          background: isCitizen
            ? 'linear-gradient(165deg, #1b5338 0%, #064e3b 55%, #032b1f 100%)'
            : 'linear-gradient(165deg, #0f172a 0%, #1e293b 55%, #0b1e33 100%)',
          color: '#ffffff',
          padding: '1.6rem 1.35rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: isCitizen
              ? 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(234,88,12,0.14) 0%, transparent 45%)'
              : 'radial-gradient(circle at 20% 20%, rgba(250,204,21,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(56,189,248,0.12) 0%, transparent 45%)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Circular Emblem Badge */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              margin: '0 auto 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              padding: '4px',
              border: isCitizen ? '2px solid #bbf7d0' : '2px solid #fde047',
            }}
          >
            <img
              src={emblemSvg}
              alt="State Emblem of India"
              style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <div
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: '#ffffff',
              textTransform: 'uppercase',
              lineHeight: 1.15,
            }}
          >
            BHARAT<span style={{ color: isCitizen ? '#ea580c' : '#facc15' }}>BHUMI</span>
          </div>

          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: isCitizen ? '#fed7aa' : '#fde047',
              marginTop: '0.25rem',
            }}
          >
            {isCitizen ? 'Citizen Landholder Portal' : 'Jan Parichay Official SSO'}
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              color: 'rgba(255, 255, 255, 0.85)',
              marginTop: '0.1rem',
            }}
          >
            Department of Land Resources &bull; Govt of India
          </div>
        </div>

        {/* Differentiated Trust Highlights */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
            margin: '1.25rem 0 0.75rem',
          }}
        >
          {isCitizen ? (
            <>
              {/* Citizen Trust Pill 1 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff',
                  }}
                >
                  <UserCheck size={14} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                    e-Pramaan &amp; DigiLocker
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    Instant Aadhaar OTP mobile verification
                  </div>
                </div>
              </div>

              {/* Citizen Trust Pill 2 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff',
                  }}
                >
                  <FileCheck2 size={14} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                    Certified Extracts &amp; e-Ferfar
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    Court-admissible 7/12 &amp; 8A downloads
                  </div>
                </div>
              </div>

              {/* Citizen Trust Pill 3 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff',
                  }}
                >
                  <MapPin size={14} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                    Bhu-Aadhaar ULPIN GIS
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    14-digit parcel boundary visualization
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Official Trust Pill 1 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(250, 204, 21, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#facc15',
                  }}
                >
                  <Lock size={14} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                    Jan Parichay SSO Security
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Multi-factor officer authentication
                  </div>
                </div>
              </div>

              {/* Official Trust Pill 2 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#38bdf8',
                  }}
                >
                  <Landmark size={14} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                    Statutory Revenue Bench
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Tehsildar, SRO, Collector &amp; DoLR consoles
                  </div>
                </div>
              </div>

              {/* Official Trust Pill 3 */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(74, 222, 128, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#4ade80',
                  }}
                >
                  <BarChart3 size={14} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                    Real-Time Cadastral Intelligence
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Tehsil queues &amp; immutable audit trails
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer label */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            fontSize: '0.68rem',
            color: 'rgba(255, 255, 255, 0.75)',
          }}
        >
          {isCitizen ? 'Digital India Land Records' : 'NIC / DoLR Sovereign Land Mesh'}
        </div>
      </div>

      {/* Right Side: Clean White Form Area */}
      <div
        style={{
          padding: '1.5rem 1.65rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
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
            <div style={{ marginBottom: '1.15rem', textAlign: 'center' }}>
              {badge && <div style={{ marginBottom: '0.35rem' }}>{badge}</div>}
              {title && (
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: isCitizen ? 'var(--ux4g-primary, #064e3b)' : '#0f172a',
                    margin: '0 0 0.2rem',
                  }}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: '#64748b',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
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

