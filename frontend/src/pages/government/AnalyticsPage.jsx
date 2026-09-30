import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  FileText,
  Users,
  Scale,
  ChevronDown,
  MapPin,
  CheckCircle2,
  PieChart as PieIcon,
} from 'lucide-react';

export const AnalyticsPage = () => {
  const [selectedRange, setSelectedRange] = useState('Last 12 Months');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // 12 Months Trend Data matching the reference chart
  const mutationTrendData = [
    { month: 'Oct', registered: 4.8, resolved: 3.9, sla: 76 },
    { month: 'Nov', registered: 5.0, resolved: 4.1, sla: 80 },
    { month: 'Dec', registered: 5.2, resolved: 4.3, sla: 83 },
    { month: 'Jan', registered: 5.4, resolved: 4.4, sla: 84 },
    { month: 'Feb', registered: 5.6, resolved: 4.5, sla: 83 },
    { month: 'Mar', registered: 5.8, resolved: 4.7, sla: 84 },
    { month: 'Apr', registered: 6.1, resolved: 4.9, sla: 86 },
    { month: 'May', registered: 6.4, resolved: 5.1, sla: 85 },
    { month: 'Jun', registered: 6.7, resolved: 5.4, sla: 87 },
    { month: 'Jul', registered: 7.0, resolved: 5.6, sla: 89 },
    { month: 'Aug', registered: 7.3, resolved: 5.9, sla: 90 },
    { month: 'Sep', registered: 7.9, resolved: 6.4, sla: 92 },
  ];

  // Cadastral BhuNaksha division vectorization
  const divisionData = [
    { division: 'Pune Division', rate: 98.6, count: '7,120 / 7,220' },
    { division: 'Konkan Division', rate: 97.4, count: '5,840 / 6,000' },
    { division: 'Nashik Division', rate: 96.8, count: '6,920 / 7,150' },
    { division: 'Nagpur Division', rate: 95.1, count: '7,800 / 8,200' },
    { division: 'Aurangabad Division', rate: 94.3, count: '6,540 / 6,930' },
  ];

  // Land use breakdown
  const landUseData = [
    { label: 'Agriculture', pct: 62.4, color: '#047857' },
    { label: 'Forest', pct: 15.8, color: '#064e3b' },
    { label: 'Settlement', pct: 8.6, color: '#f59e0b' },
    { label: 'Water Bodies', pct: 4.2, color: '#3b82f6' },
    { label: 'Others', pct: 9.0, color: '#94a3b8' },
  ];

  // Monthly snapshot table
  const snapshotData = [
    { month: 'Sep 2026', registered: '4,210', resolved: '3,950', sla: '93.8%' },
    { month: 'Aug 2026', registered: '4,050', resolved: '3,820', sla: '94.3%' },
    { month: 'Jul 2026', registered: '3,890', resolved: '3,610', sla: '92.8%' },
    { month: 'Jun 2026', registered: '3,720', resolved: '3,480', sla: '91.8%' },
    { month: 'May 2026', registered: '3,650', resolved: '3,420', sla: '91.5%' },
  ];

  // SLA legend
  const slaLegend = [
    { label: '≥ 95%', count: '31 Districts', color: '#16a34a' },
    { label: '85% – 95%', count: '8 Districts', color: '#84cc16' },
    { label: '70% – 85%', count: '3 Districts', color: '#f97316' },
    { label: '< 70%', count: '1 District', color: '#ef4444' },
  ];

  // SVG Chart Dimensions
  const chartWidth = 620;
  const chartHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 25;
  const paddingBottom = 30;
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const maxMutations = 8; // 8K
  const minSla = 60;
  const maxSla = 100;

  // Compute points for the SLA Line
  const stepX = innerWidth / mutationTrendData.length;
  const slaPoints = mutationTrendData.map((d, i) => {
    const x = paddingLeft + i * stepX + stepX / 2;
    const y = paddingTop + innerHeight - ((d.sla - minSla) / (maxSla - minSla)) * innerHeight;
    return { x, y, val: d.sla, month: d.month };
  });

  const lineD = slaPoints.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    return `${acc} C ${cpX1},${prev.y} ${cpX2},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. Header Banner with Rich Farmland Background Overlay */}
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(90deg, rgba(4, 47, 36, 0.94) 0%, rgba(6, 78, 59, 0.88) 55%, rgba(4, 47, 36, 0.92) 100%), url("/images/hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          boxShadow: '0 4px 20px rgba(6, 78, 59, 0.25)',
          padding: '1.4rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(6, 78, 59, 0.7)',
              border: '1px solid rgba(134, 239, 172, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#86efac',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.35rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              Land Governance MIS & Operational Analytics
            </h1>
            <p style={{ margin: '3px 0 0', fontSize: '0.86rem', color: '#a7f3d0', fontWeight: 400 }}>
              Multi-echelon spatial analytics, SLA adherence telemetry, and mutation velocity metrics.
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', zIndex: 1 }}>
          {/* Date Selector */}
          <button
            onClick={() => {}}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(2, 44, 34, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Calendar size={14} />
            <span>{selectedRange}</span>
          </button>

          {/* Download Excel MIS */}
          <button
            onClick={() => {}}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(2, 44, 34, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Download size={14} />
            <span>Download Excel MIS</span>
          </button>

          {/* Generate Executive PDF */}
          <button
            onClick={() => {}}
            style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              border: 'none',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(234, 88, 12, 0.4)',
            }}
          >
            Generate Executive PDF
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* KPI 1: AVG MUTATION TURNAROUND */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              flexShrink: 0,
            }}
          >
            <FileText size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              AVG MUTATION TURNAROUND
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '4px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                16.4 Days
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#16a34a',
                  backgroundColor: '#dcfce7',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                ↓ 21%
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Target: 21 Days (NLRMP Standard)
            </div>
          </div>
        </div>

        {/* KPI 2: CADASTRAL COVERAGE RATE */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              flexShrink: 0,
            }}
          >
            <Layers size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              CADASTRAL COVERAGE RATE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '4px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                98.2%
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#16a34a',
                  backgroundColor: '#dcfce7',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                ↑ 2.1%
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              43,210 of 44,000 villages vectorized
            </div>
          </div>
        </div>

        {/* KPI 3: CITIZEN SATISFACTION INDEX */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
              flexShrink: 0,
            }}
          >
            <Users size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              CITIZEN SATISFACTION INDEX
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '4px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                4.6 / 5.0
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#16a34a',
                  backgroundColor: '#dcfce7',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                ↑ 0.3
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Based on 124,000 post-mutation ratings
            </div>
          </div>
        </div>

        {/* KPI 4: ACTIVE REVENUE COURT CASES */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#fff7ed',
              border: '1px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ea580c',
              flexShrink: 0,
            }}
          >
            <Scale size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              ACTIVE REVENUE COURT CASES
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '4px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                1,420
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#16a34a',
                  backgroundColor: '#dcfce7',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                ↓ 12%
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Across 358 Tehsil Executive Courts
            </div>
          </div>
        </div>
      </div>

      {/* 3. Row 2: 12-Month Mutation Trends (Left) & Cadastral Vectorization (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)',
          gap: '1.25rem',
        }}
      >
        {/* Left: Mutation Trends (Last 12 Months) Dual-Axis Chart */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.4rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Card Header + Legend */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="#059669" />
              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                Mutation Trends <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.85rem' }}>(Last 12 Months)</span>
              </span>
            </div>

            {/* Chart Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#a7f3d0', borderRadius: '2px', display: 'inline-block' }} />
                <span>Registered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#065f46', borderRadius: '2px', display: 'inline-block' }} />
                <span>Resolved</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '14px', height: '2px', backgroundColor: '#ea580c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#ea580c', borderRadius: '50%' }} />
                </span>
                <span>SLA %</span>
              </div>
            </div>
          </div>

          {/* Dual Axis SVG Chart */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              {/* Horizontal Gridlines */}
              {[0, 2, 4, 6, 8].map((val) => {
                const y = paddingTop + innerHeight - (val / maxMutations) * innerHeight;
                const slaVal = Math.round(minSla + (val / maxMutations) * (maxSla - minSla));
                return (
                  <g key={val}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray={val === 0 ? 'none' : '3 3'}
                    />
                    {/* Left Y Axis Labels */}
                    <text
                      x={paddingLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="Inter, sans-serif"
                    >
                      {val === 0 ? '0' : `${val}K`}
                    </text>
                    {/* Right Y Axis Labels */}
                    <text
                      x={chartWidth - paddingRight + 8}
                      y={y + 3}
                      textAnchor="start"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="Inter, sans-serif"
                    >
                      {slaVal}%
                    </text>
                  </g>
                );
              })}

              {/* Vertical axis titles */}
              <text
                x={12}
                y={paddingTop + innerHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90 12 ${paddingTop + innerHeight / 2})`}
                fill="#94a3b8"
                fontSize="8.5"
                fontFamily="Inter, sans-serif"
              >
                No. of Mutations
              </text>

              {/* Bars for Each Month */}
              {mutationTrendData.map((d, i) => {
                const groupX = paddingLeft + i * stepX;
                const barWidth = 9;
                const gap = 3;
                const totalBarGroupWidth = barWidth * 2 + gap;
                const startX = groupX + (stepX - totalBarGroupWidth) / 2;

                const regHeight = (d.registered / maxMutations) * innerHeight;
                const regY = paddingTop + innerHeight - regHeight;

                const resHeight = (d.resolved / maxMutations) * innerHeight;
                const resY = paddingTop + innerHeight - resHeight;

                const isHovered = hoveredMonth === i;

                return (
                  <g
                    key={d.month}
                    onMouseEnter={() => setHoveredMonth(i)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Hover column background highlight */}
                    {isHovered && (
                      <rect
                        x={groupX + 2}
                        y={paddingTop}
                        width={stepX - 4}
                        height={innerHeight}
                        fill="rgba(6, 78, 59, 0.04)"
                        rx="4"
                      />
                    )}

                    {/* Registered Bar (Light Mint) */}
                    <rect
                      x={startX}
                      y={regY}
                      width={barWidth}
                      height={regHeight}
                      fill="#a7f3d0"
                      rx="2"
                    />

                    {/* Resolved Bar (Dark Green) */}
                    <rect
                      x={startX + barWidth + gap}
                      y={resY}
                      width={barWidth}
                      height={resHeight}
                      fill="#065f46"
                      rx="2"
                    />

                    {/* X-Axis Month Label */}
                    <text
                      x={groupX + stepX / 2}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9.5"
                      fontWeight={isHovered ? '700' : '500'}
                      fontFamily="Inter, sans-serif"
                    >
                      {d.month}
                    </text>
                  </g>
                );
              })}

              {/* SLA Trend Line */}
              <path
                d={lineD}
                fill="none"
                stroke="#ea580c"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* SLA Data Points */}
              {slaPoints.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredMonth === i ? 4.5 : 3.2}
                    fill="#ea580c"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {hoveredMonth === i && (
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      fill="#ea580c"
                      fontSize="9.5"
                      fontWeight="700"
                    >
                      {pt.val}%
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Cadastral BhuNaksha Vectorization by Division */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.4rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#059669" />
              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                Cadastral BhuNaksha Vectorization by Division
              </span>
            </div>
            <button
              onClick={() => {}}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              View All
            </button>
          </div>

          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.3fr 0.9fr 1.3fr 1fr',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#64748b',
              paddingBottom: '0.6rem',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '0.75rem',
            }}
          >
            <div>Division</div>
            <div>Coverage Rate</div>
            <div style={{ paddingLeft: '4px' }}>Progress</div>
            <div style={{ textAlign: 'right' }}>Vectorized / Total</div>
          </div>

          {/* Division Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', flex: 1, justifyContent: 'space-between' }}>
            {divisionData.map((d) => (
              <div
                key={d.division}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.3fr 0.9fr 1.3fr 1fr',
                  alignItems: 'center',
                  fontSize: '0.84rem',
                }}
              >
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{d.division}</div>
                <div style={{ fontWeight: 800, color: '#16a34a' }}>{d.rate}%</div>
                <div style={{ paddingRight: '12px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '7px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${d.rate}%`,
                        height: '100%',
                        backgroundColor: '#065f46',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
                <div style={{ textAlign: 'right', color: '#475569', fontWeight: 500, fontSize: '0.82rem' }}>
                  {d.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Row 3: District-wise SLA + Land Use Distribution + Monthly Performance Snapshot */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Panel 1: District-wise Mutation Resolution (SLA Compliance) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.35rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header with State Selector */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#059669" />
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                District-wise Mutation Resolution <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>(SLA Compliance)</span>
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.75rem',
                color: '#334155',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <span>{selectedState}</span>
              <ChevronDown size={13} color="#64748b" />
            </div>
          </div>

          {/* Map + Legend Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
            {/* High-Resolution Maharashtra District Choropleth Map */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.35rem',
                borderRadius: '10px',
                background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              <img
                src="/images/maharashtra-map.png"
                alt="Maharashtra District-wise SLA Compliance Map"
                style={{
                  width: '100%',
                  maxHeight: '165px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
            </div>

            {/* SLA Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '2px' }}>
                SLA Compliance
              </div>
              {slaLegend.map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                    <span style={{ color: '#475569', fontWeight: 600 }}>{item.label}</span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Land Use Distribution (Maharashtra) Donut Chart */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.35rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <PieIcon size={18} color="#059669" />
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
              Land Use Distribution <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>(Maharashtra)</span>
            </span>
          </div>

          {/* Donut Chart + Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            {/* SVG Donut */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {/* Slices calculated with stroke-dasharray and stroke-dashoffset */}
                  {/* Agriculture 62.4% -> 196 / 314 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#047857"
                    strokeWidth="14"
                    strokeDasharray="149 239"
                    strokeDashoffset="0"
                  />
                  {/* Forest 15.8% -> 37.7 / 239 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#064e3b"
                    strokeWidth="14"
                    strokeDasharray="37.7 239"
                    strokeDashoffset="-149"
                  />
                  {/* Settlement 8.6% -> 20.5 / 239 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="14"
                    strokeDasharray="20.5 239"
                    strokeDashoffset="-186.7"
                  />
                  {/* Water Bodies 4.2% -> 10.0 / 239 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="14"
                    strokeDasharray="10 239"
                    strokeDashoffset="-207.2"
                  />
                  {/* Others 9.0% -> 21.5 / 239 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#94a3b8"
                    strokeWidth="14"
                    strokeDasharray="21.5 239"
                    strokeDashoffset="-217.2"
                  />
                </svg>

                {/* Donut Center Label */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    30.8L
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                    Hectares
                  </div>
                </div>
              </div>
            </div>

            {/* Donut Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {landUseData.map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                    <span style={{ color: '#475569', fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#1e293b' }}>{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 3: Monthly Performance Snapshot Table */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.35rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#059669" />
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                Monthly Performance Snapshot
              </span>
            </div>
            <button
              onClick={() => {}}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              View All
            </button>
          </div>

          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#64748b',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '0.5rem',
            }}
          >
            <div>Month</div>
            <div style={{ textAlign: 'right' }}>Registered</div>
            <div style={{ textAlign: 'right' }}>Resolved</div>
            <div style={{ textAlign: 'right' }}>SLA %</div>
          </div>

          {/* Table Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1, justifyContent: 'space-between' }}>
            {snapshotData.map((row) => (
              <div
                key={row.month}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  fontSize: '0.82rem',
                  padding: '2px 0',
                }}
              >
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{row.month}</div>
                <div style={{ textAlign: 'right', color: '#475569' }}>{row.registered}</div>
                <div style={{ textAlign: 'right', color: '#475569' }}>{row.resolved}</div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '10px',
                      display: 'inline-block',
                    }}
                  >
                    {row.sla}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPage;
