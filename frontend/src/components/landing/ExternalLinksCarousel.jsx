import React, { useState, useEffect, useRef } from 'react';

/**
 * External Links Carousel
 * Authentic Government of India portal logos in sleek horizontal banner cards,
 * automatically scrolling with floating left/right navigation controls.
 */
const externalLinks = [
  {
    id: 'mygov',
    title: 'MyGov India',
    url: 'https://www.mygov.in',
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', fontWeight: 900, fontSize: '1.45rem', lineHeight: 1, fontFamily: 'system-ui, sans-serif' }}>
            <span style={{ color: '#4CAF50' }}>my</span>
            <span style={{ color: '#0284C7', marginLeft: '1px' }}>G</span>
            <span style={{ color: '#E65100' }}>O</span>
            <span style={{ color: '#E65100' }}>V</span>
          </div>
          <span style={{ fontSize: '0.62rem', color: '#0284C7', fontWeight: 700, marginTop: '2px', letterSpacing: '0.02em' }}>
            Citizen Portal
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'data-gov-in',
    title: 'Data.gov.in',
    url: 'https://data.gov.in',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E3A8A', letterSpacing: '-0.02em' }}>data.gov.</span>
          <span style={{ background: '#F59E0B', color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem', padding: '1px 5px', borderRadius: '999px' }}>in</span>
        </div>
        <span style={{ fontSize: '0.52rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.01em', marginTop: '2px' }}>
          Open Government Data (OGD) Platform India
        </span>
      </div>
    ),
  },
  {
    id: 'dolr',
    title: 'Department of Land Resources',
    url: 'https://dolr.gov.in',
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Emblem */}
        <svg width="34" height="38" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2L26 8V12H14V8L20 2Z" fill="#334155" />
          <path d="M12 14H28V24H12V14Z" stroke="#334155" strokeWidth="1.5" fill="#F8FAFC" />
          <circle cx="20" cy="19" r="3" stroke="#334155" strokeWidth="1.2" />
          <path d="M10 26H30V30C30 36 20 40 20 40C20 40 10 36 10 30V26Z" stroke="#334155" strokeWidth="1.5" fill="#F8FAFC" />
          <path d="M16 43H24M14 46H26" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
            GOVT. OF INDIA
          </span>
          <span style={{ fontSize: '0.56rem', fontWeight: 700, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px' }}>
            DEPARTMENT OF
          </span>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
            LAND RESOURCES
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'india-gov-in',
    title: 'National Portal of India (india.gov.in)',
    url: 'https://www.india.gov.in',
    content: (
      <div style={{ background: '#0F172A', borderRadius: '6px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '100%', boxSizing: 'border-box', justifyContent: 'center' }}>
        <svg width="22" height="26" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 2L20 6V9H10V6L15 2Z" fill="#E2E8F0" />
          <rect x="8" y="11" width="14" height="8" rx="1" stroke="#E2E8F0" strokeWidth="1.2" fill="none" />
          <circle cx="15" cy="15" r="2.2" stroke="#E2E8F0" strokeWidth="1" />
          <path d="M7 21H23V24C23 28 15 31 15 31C15 31 7 28 7 24V21Z" stroke="#E2E8F0" strokeWidth="1.2" fill="none" />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>india.gov.in</span>
            <span style={{ fontSize: '0.45rem', fontWeight: 800, background: '#F59E0B', color: '#0F172A', padding: '1px 3px', borderRadius: '2px' }}>BETA</span>
          </div>
          <span style={{ fontSize: '0.52rem', color: '#94A3B8', fontWeight: 600 }}>National Portal of India</span>
        </div>
      </div>
    ),
  },
  {
    id: 'digital-india',
    title: 'Digital India',
    url: 'https://www.digitalindia.gov.in',
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '13px', fontWeight: 900 }}>
          🇮🇳
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0284C7', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Digital India
          </span>
          <span style={{ fontSize: '0.55rem', color: '#E65100', fontWeight: 700, letterSpacing: '0.03em' }}>
            Power To Empower
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'gort',
    title: 'Glossary of Revenue Terms (GORT)',
    url: 'https://dolr.gov.in',
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#ECFDF5', border: '1.5px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065F46', fontWeight: 900, fontSize: '0.72rem' }}>
          GORT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065F46', lineHeight: 1.15 }}>
            Glossary of Revenue Terms
          </span>
          <span style={{ fontSize: '0.62rem', color: '#047857', fontWeight: 700 }}>
            National Revenue Lexicon
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'cooperation-dept',
    title: 'Cooperative Department',
    url: 'https://cooperation.maharashtra.gov.in',
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#FAF5FF', border: '1.5px solid #A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7E22CE', fontSize: '16px' }}>
          🏛️
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6B21A8', lineHeight: 1.15 }}>
            Cooperative Department
          </span>
          <span style={{ fontSize: '0.58rem', color: '#7E22CE', fontWeight: 600 }}>
            State Registry
          </span>
        </div>
      </div>
    ),
  },
];

export const ExternalLinksCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const timerRef = useRef(null);

  // Responsive items count (Desktop: 4, Tablet: 3, Mobile: 1)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, externalLinks.length - visibleCount);

  // Automatic slide every 2.5 seconds
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 2800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [maxIndex, visibleCount]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section
      className="landing-external-links-section"
      aria-label="External Government Portals"
      style={{
        backgroundColor: '#F0FAF8',
        padding: '2.5rem 0 2.75rem',
        borderTop: '1px solid #D1EAE4',
        borderBottom: '1px solid #D1EAE4',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="ux4g-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>


          {/* Subtle horizontal accent line */}
          <div
            style={{
              width: '56px',
              height: '2.5px',
              background: 'linear-gradient(90deg, #1B4D3E 0%, #E65100 100%)',
              margin: '0 auto',
              borderRadius: '999px',
            }}
          />
        </div>

        {/* Outer Border Box Container (matching reference image) */}
        <div
          style={{
            position: 'relative',
            background: '#E9F5F2',
            border: '1.5px solid #94A3B8',
            borderRadius: '12px',
            padding: '12px 14px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
          }}
          onMouseEnter={() => {
            if (timerRef.current) clearInterval(timerRef.current);
          }}
          onMouseLeave={() => {
            timerRef.current = setInterval(() => {
              setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
            }, 2800);
          }}
        >
          {/* Left Arrow Button (floating pill) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous portal"
            style={{
              position: 'absolute',
              left: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '32px',
              height: '42px',
              borderRadius: '0 20px 20px 0',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid #CBD5E1',
              borderLeft: 'none',
              boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
              fontSize: '1.15rem',
              fontWeight: 900,
              paddingRight: '4px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#1B4D3E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
              e.currentTarget.style.color = '#0F172A';
            }}
          >
            ❮
          </button>

          {/* Carousel Track Viewport */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'transform',
              }}
            >
              {externalLinks.map((item) => (
                <div
                  key={item.id}
                  style={{
                    flex: `0 0 ${100 / visibleCount}%`,
                    padding: '0 6px',
                    boxSizing: 'border-box',
                  }}
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.title}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      height: '84px',
                      padding: '8px 16px',
                      textDecoration: 'none',
                      color: 'inherit',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.borderColor = '#94A3B8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                  >
                    {item.content}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Button (floating pill) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next portal"
            style={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '32px',
              height: '42px',
              borderRadius: '20px 0 0 20px',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid #CBD5E1',
              borderRight: 'none',
              boxShadow: '-2px 2px 8px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
              fontSize: '1.15rem',
              fontWeight: 900,
              paddingLeft: '4px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#1B4D3E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
              e.currentTarget.style.color = '#0F172A';
            }}
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExternalLinksCarousel;
