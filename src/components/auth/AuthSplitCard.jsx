import React from 'react';
import {
  MapPin,
  ShieldCheck,
  BarChart3,
  Globe,
  ChevronDown,
} from 'lucide-react';
import emblemSvg from '../../assets/logos/emblem.svg';

/**
 * AuthSplitCard - Compact split-panel layout matching the official modern GOI portal design
 * Optimized with smaller dimensions to seamlessly fit beneath the Landing Page Navbar.
 */
export const AuthSplitCard = ({
  children,
  activeTab = null,
  onTabChange = null,
  title = null,
  subtitle = null,
  badge = null,
}) => {
  return (
    <div
      className="auth-split-container"
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 15px 35px -10px rgba(6, 78, 59, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'minmax(270px, 38%) 1fr',
        minHeight: '480px',
        boxSizing: 'border-box',
        fontFamily: 'var(--ux4g-font-sans)',
      }}
    >
      {/* Left Side: Compact Imperial Cadastral Green Branding */}
      <div
        style={{
          background: 'linear-gradient(165deg, #1b5338 0%, #064e3b 55%, #032b1f 100%)',
          color: '#ffffff',
          padding: '1.5rem 1.25rem',
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
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(234,88,12,0.12) 0%, transparent 45%)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* White Circular Emblem Badge */}
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
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
              padding: '4px',
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
            BHARATBHUMI
          </div>

          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#fef08a',
              marginTop: '0.25rem',
            }}
          >
            Department of Land Resources
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              color: 'rgba(255, 255, 255, 0.85)',
              marginTop: '0.1rem',
            }}
          >
            Ministry of Rural Development &bull; Govt of India
          </div>
        </div>

        {/* 3 Compact Feature Pills */}
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
          {/* Pill 1 */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
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
                Interactive GIS Mapping
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Precise land boundary visualization
              </div>
            </div>
          </div>

          {/* Pill 2 */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
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
              <ShieldCheck size={14} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                Secure Digital Platform
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Role-based access & Bhu-Aadhaar RoR
              </div>
            </div>
          </div>

          {/* Pill 3 */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
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
              <BarChart3 size={14} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                Real-time Analytics
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Comprehensive data insights & tracking
              </div>
            </div>
          </div>
        </div>

        {/* Footer label */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            fontSize: '0.68rem',
            color: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          DILRMP &bull; Land Governance DPI
        </div>
      </div>

      {/* Right Side: Clean White Compact Form Area */}
      <div
        style={{
          padding: '1.5rem 1.6rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
        }}
      >
        <div>
          {/* Top Bar: Portal Tabs + Language */}
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
                    backgroundColor: activeTab === 'official' ? 'var(--ux4g-primary, #064e3b)' : 'transparent',
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
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              {badge && <div style={{ marginBottom: '0.25rem' }}>{badge}</div>}
              {title && (
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--ux4g-primary, #064e3b)',
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
                    lineHeight: 1.35,
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
