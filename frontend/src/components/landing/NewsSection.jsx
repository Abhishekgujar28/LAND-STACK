import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ArrowRight,
  Bell,
  CheckCircle2,
  Sparkles,
  Gavel,
  Scale,
  Plane,
  ShieldCheck,
  Layers,
  MapPin,
} from 'lucide-react';

/**
 * NewsSection - Official Government Gazette & Circular Roadmap
 * Displays the 4-5 latest official circulars in an alternating roadmap layout
 * with curved connectors and accompanying visual illustration preview cards on the opposite side.
 */
export const NewsSection = ({ news = [], className = '' }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All Gazette Notices' },
    { id: 'DILRMP', label: 'DILRMP Policy' },
    { id: 'Legal Technology', label: 'Legal Tech & Judiciary' },
    { id: 'Survey & Mapping', label: 'Cadastral & Drone Survey' },
  ];

  const filteredNews =
    activeFilter === 'ALL'
      ? news
      : news.filter((n) => n.category === activeFilter);

  // Show only 4-5 items in roadmap order
  const roadmapItems = filteredNews.slice(0, 5);

  // Parse date helper: returns { day, month, year }
  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: months[d.getMonth()],
      year: d.getFullYear(),
    };
  };

  // Render accompanying visual illustration preview card on opposite side
  const renderVisualPreview = (item, idx) => {
    if (item.category === 'DILRMP' || idx === 0) {
      return (
        <div className="roadmap-visual-card visual-gis">
          <div className="visual-card-badge">
            <span className="live-pulse-dot"></span>
            <span>Bhu-Aadhaar Geo-Coding</span>
          </div>
          <div className="visual-graphic-area">
            <div className="visual-gis-map-mockup">
              <svg viewBox="0 0 160 85" className="gis-svg-mockup">
                <polygon points="15,20 65,10 80,45 25,55" className="parcel-poly poly-1" />
                <polygon points="65,10 135,15 145,55 80,45" className="parcel-poly poly-2" />
                <polygon points="25,55 80,45 95,80 20,75" className="parcel-poly poly-3" />
                <polygon points="80,45 145,55 140,80 95,80" className="parcel-poly poly-4" />
                <circle cx="80" cy="45" r="4" className="geo-pin-center" />
                <circle cx="80" cy="45" r="9" className="geo-pin-ripple" />
              </svg>
              <span className="visual-overlay-pill">14-Digit Standard ULPIN</span>
            </div>
          </div>
          <div className="visual-card-footer-info">
            <span className="visual-stat-highlight">13.5 Cr</span>
            <span className="visual-stat-desc">Parcels Digitally Geo-Tagged</span>
          </div>
        </div>
      );
    }

    if (item.category === 'Legal Technology' || idx === 1) {
      return (
        <div className="roadmap-visual-card visual-legal">
          <div className="visual-card-badge">
            <span className="live-pulse-dot saffron"></span>
            <span>NJDG Judicial Integration</span>
          </div>
          <div className="visual-graphic-area">
            <div className="visual-legal-mockup">
              <div className="legal-sync-flow">
                <div className="legal-entity-box">
                  <Gavel size={18} className="text-saffron" />
                  <span>e-Courts</span>
                </div>
                <div className="legal-sync-arrows">
                  <span className="sync-line"></span>
                  <span className="sync-time">&lt;24h Sync</span>
                </div>
                <div className="legal-entity-box">
                  <Scale size={18} className="text-forest" />
                  <span>RoR Record</span>
                </div>
              </div>
            </div>
          </div>
          <div className="visual-card-footer-info">
            <span className="visual-stat-highlight text-saffron">18 States</span>
            <span className="visual-stat-desc">Automatic Stay Order Reflection</span>
          </div>
        </div>
      );
    }

    if (item.category === 'Survey & Mapping' || idx === 2) {
      return (
        <div className="roadmap-visual-card visual-drone">
          <div className="visual-card-badge">
            <span className="live-pulse-dot"></span>
            <span>SVAMITVA Drone Re-Survey</span>
          </div>
          <div className="visual-graphic-area">
            <div className="visual-drone-mockup">
              <div className="drone-graphic-center">
                <Plane size={24} className="drone-fly-icon" />
                <div className="drone-scan-beam"></div>
              </div>
              <span className="visual-overlay-pill">5cm LiDAR Resolution</span>
            </div>
          </div>
          <div className="visual-card-footer-info">
            <span className="visual-stat-highlight">6 Districts</span>
            <span className="visual-stat-desc">High-Res Ortho-Mapping Done</span>
          </div>
        </div>
      );
    }

    if (item.category === 'Banking & Security' || idx === 3) {
      return (
        <div className="roadmap-visual-card visual-banking">
          <div className="visual-card-badge">
            <span className="live-pulse-dot"></span>
            <span>CERSAI Mortgage Registry</span>
          </div>
          <div className="visual-graphic-area">
            <div className="visual-shield-mockup">
              <ShieldCheck size={26} className="text-emerald" />
              <div className="shield-info-text">
                <strong>Double-Mortgage Lock</strong>
                <span>Zero Duplicate Loans</span>
              </div>
            </div>
          </div>
          <div className="visual-card-footer-info">
            <span className="visual-stat-highlight text-emerald">-62%</span>
            <span className="visual-stat-desc">Land Loan Fraud Drop</span>
          </div>
        </div>
      );
    }

    return (
      <div className="roadmap-visual-card visual-mutation">
        <div className="visual-card-badge">
          <span className="live-pulse-dot"></span>
          <span>100% e-Ferfar Statewide</span>
        </div>
        <div className="visual-graphic-area">
          <div className="visual-paperless-mockup">
            <CheckCircle2 size={26} className="text-forest" />
            <div className="paperless-info">
              <strong>15-Day Guaranteed TAT</strong>
              <span>Right to Public Service Act</span>
            </div>
          </div>
        </div>
        <div className="visual-card-footer-info">
          <span className="visual-stat-highlight">100% Digital</span>
          <span className="visual-stat-desc">Paperless Citizen Workflow</span>
        </div>
      </div>
    );
  };

  return (
    <section className={`landing-gazette-section ${className}`.trim()}>
      <div className="ux4g-container">
        {/* Section Header */}
        <div className="section-header-compact">
          <div className="section-eyebrow-pill">
            <span className="pill-dot"></span>
            <span>अधिसूचना एवं गजट रोडमॅप | Gazette Roadmap Timeline</span>
          </div>
          <h2 className="section-main-heading">
            Government Gazette &amp; <span className="heading-saffron">Policy Roadmap</span>
          </h2>
          <p className="section-sub-heading">
            Chronological milestone track of policy directives, legal integrations, and cadastral survey orders issued by the Department of Land Resources.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="gazette-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              className={`gazette-tab-btn ${activeFilter === cat.id ? 'tab-active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Alternating Curved Roadmap Timeline */}
        <div className="gazette-roadmap-container">
          <div className="roadmap-flow-wrapper">
            {roadmapItems.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              const { day, month, year } = parseDate(item.date);
              const gazetteRef = `DoLR/NOTIF/2025-${(idx + 1).toString().padStart(3, '0')}`;
              const stepNumber = (idx + 1).toString().padStart(2, '0');
              const isLast = idx === roadmapItems.length - 1;

              return (
                <React.Fragment key={item.id || idx}>
                  {/* Row Containing Card on one side and Mini-Illustration Preview on the other side */}
                  <div className={`roadmap-flow-row ${isLeft ? 'align-left' : 'align-right'}`}>
                    {/* Left Column Item */}
                    {isLeft ? (
                      <div className="roadmap-flow-card">
                        {/* Top Step Badge */}
                        <div className="flow-card-step-badge">
                          <span>{stepNumber}</span>
                        </div>

                        {/* Card Content Header */}
                        <div className="roadmap-card-header">
                          <div className="roadmap-date-chip">
                            <span className="chip-day">{day}</span>
                            <span className="chip-my">{month} {year}</span>
                          </div>
                          <div className="roadmap-meta-wrap">
                            <span className="roadmap-ref-id">{gazetteRef}</span>
                            <span className="roadmap-cat-badge">{item.category}</span>
                          </div>
                        </div>

                        <h3 className="roadmap-card-title">{item.title}</h3>
                        <p className="roadmap-card-summary">{item.summary}</p>

                        <div className="roadmap-card-footer">
                          <button
                            type="button"
                            className="gazette-pdf-btn"
                            title="Download Official Gazette Notification (PDF)"
                            onClick={() => alert(`Downloading Gazette Document: ${item.title}`)}
                          >
                            <FileText size={14} strokeWidth={2.2} />
                            <span>Gazette PDF</span>
                            <span className="pdf-size-pill">180 KB</span>
                          </button>

                          <Link to="/resources" className="gazette-view-link">
                            <span>Read Order</span>
                            <ArrowRight size={13} strokeWidth={2.5} />
                          </Link>
                        </div>

                        {/* Bottom Anchor Node */}
                        {!isLast && <div className="flow-card-anchor-bottom"></div>}
                      </div>
                    ) : (
                      <div className="roadmap-preview-wrapper preview-left-slot">
                        {renderVisualPreview(item, idx)}
                      </div>
                    )}

                    {/* Right Column Item */}
                    {!isLeft ? (
                      <div className="roadmap-flow-card">
                        {/* Top Step Badge */}
                        <div className="flow-card-step-badge">
                          <span>{stepNumber}</span>
                        </div>

                        {/* Card Content Header */}
                        <div className="roadmap-card-header">
                          <div className="roadmap-date-chip">
                            <span className="chip-day">{day}</span>
                            <span className="chip-my">{month} {year}</span>
                          </div>
                          <div className="roadmap-meta-wrap">
                            <span className="roadmap-ref-id">{gazetteRef}</span>
                            <span className="roadmap-cat-badge">{item.category}</span>
                          </div>
                        </div>

                        <h3 className="roadmap-card-title">{item.title}</h3>
                        <p className="roadmap-card-summary">{item.summary}</p>

                        <div className="roadmap-card-footer">
                          <button
                            type="button"
                            className="gazette-pdf-btn"
                            title="Download Official Gazette Notification (PDF)"
                            onClick={() => alert(`Downloading Gazette Document: ${item.title}`)}
                          >
                            <FileText size={14} strokeWidth={2.2} />
                            <span>Gazette PDF</span>
                            <span className="pdf-size-pill">180 KB</span>
                          </button>

                          <Link to="/resources" className="gazette-view-link">
                            <span>Read Order</span>
                            <ArrowRight size={13} strokeWidth={2.5} />
                          </Link>
                        </div>

                        {/* Bottom Anchor Node */}
                        {!isLast && <div className="flow-card-anchor-bottom"></div>}
                      </div>
                    ) : (
                      <div className="roadmap-preview-wrapper preview-right-slot">
                        {renderVisualPreview(item, idx)}
                      </div>
                    )}
                  </div>

                  {/* S-Curve Connector Bridge (from bottom center of this box to top center of next box) */}
                  {!isLast && (
                    <div className={`roadmap-curve-bridge ${isLeft ? 'bridge-left-to-right' : 'bridge-right-to-left'}`}>
                      <svg
                        viewBox="0 0 1000 90"
                        className="bridge-curve-svg"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id={`curve-grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={isLeft ? "#1b4d3e" : "#e65100"} />
                            <stop offset="50%" stopColor="#0d9488" />
                            <stop offset="100%" stopColor={isLeft ? "#e65100" : "#1b4d3e"} />
                          </linearGradient>
                        </defs>

                        {isLeft ? (
                          /* Curve from Left Box Bottom Center (X: 250) to Right Box Top Center (X: 750) */
                          <g>
                            <path
                              d="M 250 0 C 250 55, 750 35, 750 90"
                              fill="none"
                              stroke={`url(#curve-grad-${idx})`}
                              strokeWidth="3.5"
                              strokeDasharray="6 4"
                              className="flowing-roadmap-path"
                            />
                            <circle cx="250" cy="4" r="5" fill="#1b4d3e" />
                            <circle cx="750" cy="86" r="5" fill="#e65100" />
                          </g>
                        ) : (
                          /* Curve from Right Box Bottom Center (X: 750) to Left Box Top Center (X: 250) */
                          <g>
                            <path
                              d="M 750 0 C 750 55, 250 35, 250 90"
                              fill="none"
                              stroke={`url(#curve-grad-${idx})`}
                              strokeWidth="3.5"
                              strokeDasharray="6 4"
                              className="flowing-roadmap-path"
                            />
                            <circle cx="750" cy="4" r="5" fill="#e65100" />
                            <circle cx="250" cy="86" r="5" fill="#1b4d3e" />
                          </g>
                        )}
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Bulletin Footer Banner */}
          <div className="gazette-footer-banner">
            <div className="banner-left">
              <Bell size={18} strokeWidth={2.2} className="text-saffron" />
              <span>Subscribe to National Land Portal Gazette Notification RSS feed</span>
            </div>
            <div className="banner-right">
              <Link to="/resources" className="gazette-archive-link">
                <span>View Complete Gazette Archive (2018–2025) &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
