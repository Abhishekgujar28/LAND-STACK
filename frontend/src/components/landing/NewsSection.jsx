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
  Download,
  Calendar,
  Building,
  ExternalLink,
} from 'lucide-react';
import { defaultNews } from '../../data/landingData';

/**
 * NewsSection - Official Government Gazette & Policy Circulars
 * Displays updates in an organized chronological timeline and card layout
 * with official document download badges, filter tabs, and GIGW metadata.
 */
export const NewsSection = ({ news = [], className = '' }) => {
  const activeNewsList = news && news.length > 0 ? news : defaultNews;
  const [activeFilter, setActiveFilter] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All Gazette Notices' },
    { id: 'DILRMP', label: 'DILRMP Policy & Guidelines' },
    { id: 'Legal Technology', label: 'Legal Tech & Judiciary (NJDG)' },
    { id: 'Survey & Mapping', label: 'Cadastral & Drone Survey' },
    { id: 'Banking & Security', label: 'Banking & CERSAI Security' },
  ];

  const filteredNews =
    activeFilter === 'ALL'
      ? activeNewsList
      : activeNewsList.filter((n) => n.category === activeFilter);

  // Parse date helper: returns { day, month, year, fullDate }
  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: months[d.getMonth()],
      year: d.getFullYear(),
      fullDate: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'DILRMP': return 'emerald';
      case 'Legal Technology': return 'saffron';
      case 'Survey & Mapping': return 'blue';
      case 'Banking & Security': return 'purple';
      default: return 'emerald';
    }
  };

  return (
    <section className={`landing-gazette-section ${className}`.trim()}>
      <div className="ux4g-container">
        {/* Section Header */}
        <div className="section-header-compact">
          <div className="section-eyebrow-pill">
            <span className="pill-dot"></span>
            <span>आधिकारिक राजपत्र एवं अधिसूचनाएं | Gazette Circulars &amp; Updates</span>
          </div>
          <h2 className="section-main-heading">
            Government Gazette &amp; <span className="heading-saffron">Policy Updates</span>
          </h2>
          <p className="section-sub-heading">
            Chronological directives, legal notifications, and cadastral survey orders issued by the Department of Land Resources.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="gazette-filter-bar" role="tablist" aria-label="Filter gazette notices">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`gazette-tab-btn ${activeFilter === cat.id ? 'tab-active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Chronological Card Grid */}
        <div className="gazette-cards-grid">
          {filteredNews.map((item, idx) => {
            const { day, month, year, fullDate } = parseDate(item.date);
            const tagColor = getCategoryColor(item.category);

            return (
              <div key={item.id || idx} className="gazette-chronological-card">
                {/* Top Meta Bar */}
                <div className="gazette-card-topbar">
                  <div className="gazette-date-badge">
                    <Calendar size={13} strokeWidth={2.4} className="text-slate-600" />
                    <span>{fullDate}</span>
                  </div>
                  <span className={`gazette-category-tag tag-${tagColor}`}>
                    {item.category}
                  </span>
                </div>

                {/* Reference ID */}
                <div className="gazette-ref-id-row">
                  <span className="ref-label">Order Ref:</span>
                  <span className="ref-code">{item.refId || `DoLR/NOTIF/2026-${(idx + 1).toString().padStart(3, '0')}`}</span>
                </div>

                {/* Title and Summary */}
                <h3 className="gazette-card-title">{item.title}</h3>
                <p className="gazette-card-summary">{item.summary}</p>

                {/* Issuing Authority */}
                <div className="gazette-authority-tag">
                  <Building size={13} strokeWidth={2.2} className="text-slate-500" />
                  <span>{item.publishedBy || 'Department of Land Resources (DoLR)'}</span>
                </div>

                {/* Download and Read CTA Buttons */}
                <div className="gazette-card-actions">
                  <button
                    type="button"
                    className="gazette-download-badge"
                    title={`Download Gazette PDF: ${item.title}`}
                    onClick={() => alert(`Downloading Official Notification: ${item.title} (${item.fileSize || '210 KB'})`)}
                  >
                    <Download size={13} strokeWidth={2.4} />
                    <span>Download PDF</span>
                    <span className="badge-filesize">{item.fileSize || '210 KB'}</span>
                  </button>

                  <Link to="/resources" className="gazette-read-link">
                    <span>Read Full Order</span>
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gazette Subscription Footer Strip */}
        <div className="gazette-footer-banner">
          <div className="banner-left">
            <Bell size={18} strokeWidth={2.2} className="text-saffron" />
            <span>Subscribe to National Land Portal Gazette Notification RSS feed for instant legal updates.</span>
          </div>
          <div className="banner-right">
            <Link to="/resources" className="gazette-archive-link">
              <span>View Complete Gazette Archive (2018–2026) &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
