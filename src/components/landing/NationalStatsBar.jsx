import React, { useState, useEffect, useRef } from 'react';

/**
 * NationalStatsBar - Animated counter bar showing national Land Stack metrics
 */
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start * 10) / 10);
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
    if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString('en-IN');
  };

  return (
    <span ref={ref} className="stat-counter">
      {prefix}{typeof end === 'number' && end > 1000 ? formatNumber(count) : count}{suffix}
    </span>
  );
};

export const NationalStatsBar = ({ stats = {}, className = '' }) => {
  const metrics = [
    {
      label: 'Total Parcels Mapped',
      value: stats.totalParcels || 142050000,
      icon: '🗺️',
      suffix: '',
    },
    {
      label: 'ULPIN Coverage',
      value: stats.ulpinCoveragePercent || 95.0,
      icon: '📍',
      suffix: '%',
    },
    {
      label: 'States & UTs Active',
      value: (stats.activeStatesCount || 28) + (stats.activeUTsCount || 8),
      icon: '🇮🇳',
      suffix: '',
    },
    {
      label: 'Avg Mutation TAT',
      value: stats.averageMutationTATDays || 14.2,
      icon: '⚡',
      suffix: ' Days',
    },
    {
      label: 'SROs Integrated',
      value: stats.sroIntegratedCount || 5120,
      icon: '🏛️',
      suffix: '',
    },
  ];

  return (
    <section
      className={`national-stats-bar ${className}`.trim()}
    >
      <div className="ux4g-container">
        <div className="stats-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="stat-item">
              <span className="stat-icon">{metric.icon}</span>
              <div className="stat-content">
                <div className="stat-value">
                  <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                </div>
                <div className="stat-label">{metric.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NationalStatsBar;
