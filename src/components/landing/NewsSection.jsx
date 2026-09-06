import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Tag,
  Bell,
  ArrowRight,
  Shield,
  Clock,
} from 'lucide-react';

/**
 * NewsSection - Official Government Gazette & Circular Bulletin Timeline
 * Restyled from generic cards into an authentic GIGW 3.0 Government Gazette /
 * circular bulletin timeline with official date badges, Gazette reference IDs, and PDF indicators.
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

  // Format date helper: returns { day, month, year }
  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: months[d.getMonth()],
      year: d.getFullYear(),
    };
  };

  return (
    <section className={`landing-gazette-section ${className}`.trim()}>
      <div className="ux4g-container">
        {/* Government Section Header */}
        <div className="section-header-compact">
          <div className="section-eyebrow-pill">
            <span className="pill-dot"></span>
            <span>अधिसूचना एवं गजट बुलेटिन | Official Gazette &amp; Notifications</span>
          </div>
          <h2 className="section-main-heading">
            Government Gazette &amp; <span className="heading-saffron">Circular Bulletin</span>
          </h2>
          <p className="section-sub-heading">
            Official policy directives, cadastral reforms, and legal integration circulars issued by the Department of Land Resources.
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

        {/* Gazette Timeline Bulletin List */}
        <div className="gazette-timeline-container">
          <div className="gazette-timeline-list">
            {filteredNews.map((item, idx) => {
              const { day, month, year } = parseDate(item.date);
              const gazetteRef = `DoLR/NOTIF/2025-${(idx + 1).toString().padStart(3, '0')}`;

              return (
                <div key={item.id} className="gazette-bulletin-row">
                  {/* Date Badge Column */}
                  <div className="gazette-date-badge">
                    <span className="date-day">{day}</span>
                    <span className="date-month-year">{month} {year}</span>
                    <span className="date-dept">DoLR / MoRD</span>
                  </div>

                  {/* Main Content Column */}
                  <div className="gazette-content-col">
                    <div className="gazette-meta-line">
                      <span className="gazette-ref-id">{gazetteRef}</span>
                      <span className="gazette-category-chip">{item.category}</span>
                      <span className="gazette-status-tag">Official Circular</span>
                    </div>

                    <h3 className="gazette-title">{item.title}</h3>
                    <p className="gazette-summary">{item.summary}</p>
                  </div>

                  {/* PDF Download & View Action Column */}
                  <div className="gazette-actions-col">
                    <button
                      type="button"
                      className="gazette-pdf-btn"
                      title="Download Official Gazette Notification (PDF)"
                      onClick={() => alert(`Downloading Gazette Document: ${item.title}`)}
                    >
                      <FileText size={15} strokeWidth={2.2} />
                      <span>Gazette PDF</span>
                      <span className="pdf-size-pill">180 KB</span>
                    </button>

                    <Link
                      to="/resources"
                      className="gazette-view-link"
                    >
                      <span>Read Order</span>
                      <ArrowRight size={13} strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
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
