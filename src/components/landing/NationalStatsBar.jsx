import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter - smoothly counts up to end value
 */
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '', decimals = 1 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const isFloat = end % 1 !== 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(isFloat ? Math.floor(start * 10) / 10 : Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  const formatNumber = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(decimals) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(decimals) + ' L';
    if (num >= 1000) return (num / 1000).toFixed(decimals) + 'K';
    return num.toLocaleString('en-IN');
  };

  return (
    <span ref={ref} className="stat-counter">
      {prefix}{typeof end === 'number' && end >= 1000 ? formatNumber(count) : count}{suffix}
    </span>
  );
};

/**
 * NationalStatsBar - Seamless horizontal ribbon bar matching reference UI
 */
export const NationalStatsBar = ({ stats = {}, className = '' }) => {
  const metrics = [
    {
      id: 'parcels',
      label: 'TOTAL PARCELS MAPPED',
      value: 142000000,
      suffix: '',
      decimals: 1,
      icon: (
        <div className="stats-icon-badge">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="#0D6E4F">
            <path d="M12 4C10 6 7 9 8 13C9 17 6 20 7 24C8 28 12 28 14 26C16 24 19 26 21 24C23 22 24 17 22 14C20 11 22 8 19 6C16 4 14 2 12 4Z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'ulpin',
      label: 'ULPIN COVERAGE',
      value: stats.ulpinCoveragePercent || 95,
      suffix: '%',
      decimals: 0,
      icon: (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="#0D6E4F">
          <circle cx="16" cy="10" r="4" />
          <path d="M10 24C10 20.7 12.7 18 16 18C19.3 18 22 20.7 22 24H10Z" />
          <circle cx="8" cy="12" r="3" />
          <path d="M3 24C3 21.5 5 19.5 7.5 19.5C8.2 19.5 8.9 19.7 9.5 20C8.6 21.1 8 22.5 8 24H3Z" />
          <circle cx="24" cy="12" r="3" />
          <path d="M29 24C29 21.5 27 19.5 24.5 19.5C23.8 19.5 23.1 19.7 22.5 20C23.4 21.1 24 22.5 24 24H29Z" />
        </svg>
      ),
    },
    {
      id: 'states',
      label: 'STATES & UTs ACTIVE',
      value: (stats.activeStatesCount || 28) + (stats.activeUTsCount || 8),
      suffix: '',
      decimals: 0,
      icon: (
        <svg width="22" height="26" viewBox="0 0 24 32" fill="#0D6E4F">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 19.5 12 30 12 30C12 30 22 19.5 22 12C22 6.48 17.52 2 12 2ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" />
        </svg>
      ),
    },
    {
      id: 'tat',
      label: 'AVG MUTATION TAT',
      value: stats.averageMutationTATDays || 14.2,
      suffix: ' Days',
      decimals: 1,
      icon: (
        <svg width="20" height="26" viewBox="0 0 24 32" fill="#EA580C">
          <path d="M14 2L3 17H12L10 30L21 15H12L14 2Z" />
        </svg>
      ),
    },
    {
      id: 'sro',
      label: 'SROs INTEGRATED',
      value: stats.sroIntegratedCount || 5100,
      suffix: '',
      decimals: 1,
      icon: (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="#0D6E4F">
          <path d="M16 3L3 10V13H29V10L16 3Z" />
          <rect x="5" y="15" width="4" height="10" />
          <rect x="11" y="15" width="4" height="10" />
          <rect x="17" y="15" width="4" height="10" />
          <rect x="23" y="15" width="4" height="10" />
          <path d="M3 27H29V30H3V27Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className={`national-stats-bar ${className}`.trim()}>
      <div className="ux4g-container">
        <div className="stats-ribbon-row">
          {metrics.map((metric, index) => (
            <React.Fragment key={metric.id}>
              <div className="stats-ribbon-item">
                <div className="stats-icon-holder">
                  {metric.icon}
                </div>
                <div className="stats-text-holder">
                  <div className="stats-metric-value">
                    <AnimatedCounter
                      end={metric.value}
                      suffix={metric.suffix}
                      decimals={metric.decimals}
                    />
                  </div>
                  <div className="stats-metric-label">
                    {metric.label}
                  </div>
                </div>
              </div>
              {index < metrics.length - 1 && (
                <div className="stats-ribbon-divider" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NationalStatsBar;
