import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Fingerprint,
  Map,
  ArrowLeftRight,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

/**
 * QuickActions - GIGW-Compliant Modern Citizen Quick Access Cards
 * Features clean rounded white cards, light ambient shadows, clear category badges,
 * rich SVG illustrations, and high-contrast typography.
 */
export const QuickActions = ({ className = '' }) => {
  const actions = [
    {
      id: 'ror',
      title: 'View Record of Rights',
      subtitle: '7/12, 8A, Jamabandi & Patta extracts',
      categoryTag: 'CERTIFIED EXTRACT',
      tagColor: 'green',
      icon: <FileText size={24} color="#0D6E4F" strokeWidth={2.2} />,
      to: '/services',
      actionText: 'Get RoR',
      svgIllustration: (
        <svg viewBox="0 0 80 60" className="quick-action-svg" aria-hidden="true">
          <rect x="15" y="8" width="50" height="44" rx="4" fill="#E8F5E9" stroke="#0D6E4F" strokeWidth="1.5" />
          <line x1="23" y1="18" x2="57" y2="18" stroke="#0D6E4F" strokeWidth="2" strokeLinecap="round" />
          <line x1="23" y1="26" x2="48" y2="26" stroke="#81C784" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="23" y1="33" x2="53" y2="33" stroke="#81C784" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="50" cy="40" r="7" fill="#0D6E4F" />
          <path d="M47 40 L49 42 L53 38" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'ulpin',
      title: 'Search by Bhu-Aadhaar',
      subtitle: '14-Digit standard ULPIN geo-identifier',
      categoryTag: 'BHU-AADHAAR',
      tagColor: 'orange',
      icon: <Fingerprint size={24} color="#E65100" strokeWidth={2.2} />,
      to: '/citizen/search',
      actionText: 'Search Parcel',
      svgIllustration: (
        <svg viewBox="0 0 80 60" className="quick-action-svg" aria-hidden="true">
          <rect x="12" y="10" width="56" height="40" rx="6" fill="#FFF3E0" stroke="#E65100" strokeWidth="1.5" />
          <path d="M40 18 C33 18 28 23 28 30 C28 37 33 42 40 42 C47 42 52 37 52 30" fill="none" stroke="#E65100" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M40 24 C36 24 33 27 33 31 C33 35 36 38 40 38 C44 38 47 35 47 31" fill="none" stroke="#FB8C00" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="40" cy="31" r="2" fill="#E65100" />
        </svg>
      ),
    },
    {
      id: 'naksha',
      title: 'Cadastral Bhu-Naksha',
      subtitle: 'Interactive GIS vector village maps',
      categoryTag: 'SPATIAL GIS',
      tagColor: 'blue',
      icon: <Map size={24} color="#0284C7" strokeWidth={2.2} />,
      to: '/citizen/search',
      actionText: 'View Map',
      svgIllustration: (
        <svg viewBox="0 0 80 60" className="quick-action-svg" aria-hidden="true">
          <rect x="10" y="8" width="60" height="44" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <polygon points="18,18 42,14 48,34 22,38" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.2" />
          <polygon points="42,14 62,18 58,40 48,34" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1.2" />
          <polygon points="22,38 48,34 44,48 16,44" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
          <circle cx="45" cy="24" r="3.5" fill="#E65100" />
        </svg>
      ),
    },
    {
      id: 'mutation',
      title: 'Online Mutation (e-Ferfar)',
      subtitle: 'Track or file title transfer applications',
      categoryTag: 'REVENUE FLOW',
      tagColor: 'amber',
      icon: <ArrowLeftRight size={24} color="#D97706" strokeWidth={2.2} />,
      to: '/citizen/mutations',
      actionText: 'Apply e-Ferfar',
      svgIllustration: (
        <svg viewBox="0 0 80 60" className="quick-action-svg" aria-hidden="true">
          <rect x="12" y="10" width="56" height="40" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          <path d="M24 24 L42 24 M36 18 L42 24 L36 30" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M56 36 L38 36 M44 30 L38 36 L44 42" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'verify',
      title: 'Due Diligence 360°',
      subtitle: 'Disputes, mortgages & title audit',
      categoryTag: 'LEGAL DILIGENCE',
      tagColor: 'teal',
      icon: <ShieldCheck size={24} color="#0D9488" strokeWidth={2.2} />,
      to: '/citizen/due-diligence',
      actionText: 'Run Diligence',
      svgIllustration: (
        <svg viewBox="0 0 80 60" className="quick-action-svg" aria-hidden="true">
          <rect x="12" y="10" width="56" height="40" rx="6" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
          <path d="M40 18 L52 23 V33 C52 40 40 45 40 45 C40 45 28 40 28 33 V23 Z" fill="#99F6E4" stroke="#0D9488" strokeWidth="1.5" />
          <path d="M35 31 L38 34 L45 27" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'helpdesk',
      title: 'Citizen Grievance & Help',
      subtitle: 'Toll-free 1800-120-8040 & CPGRAMS',
      categoryTag: '24x7 HELPDESK',
      tagColor: 'rose',
      icon: <Headphones size={24} color="#E11D48" strokeWidth={2.2} />,
      to: '/contact',
      actionText: 'Contact Support',
      svgIllustration: (
        <svg viewBox="0 0 80 60" className="quick-action-svg" aria-hidden="true">
          <rect x="12" y="10" width="56" height="40" rx="6" fill="#FFE4E6" stroke="#E11D48" strokeWidth="1.5" />
          <path d="M28 34 C28 26 33 20 40 20 C47 20 52 26 52 34" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
          <rect x="25" y="32" width="6" height="10" rx="2" fill="#E11D48" />
          <rect x="49" y="32" width="6" height="10" rx="2" fill="#E11D48" />
          <path d="M49 40 C49 44 45 46 41 46" fill="none" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`quick-actions-modern-wrap ${className}`.trim()}>
      <div className="quick-actions-grid-cards">
        {actions.map((act) => (
          <Link
            key={act.id}
            to={act.to}
            className="quick-action-modern-card"
            title={`${act.title} - ${act.subtitle}`}
          >
            {/* Top Bar with Category Tag and Leading Icon */}
            <div className="card-top-bar">
              <span className={`card-category-tag tag-${act.tagColor}`}>
                {act.categoryTag}
              </span>
              <div className="card-top-icon">{act.icon}</div>
            </div>

            {/* Middle Illustration Thumbnail */}
            <div className="card-illustration-frame">
              {act.svgIllustration}
            </div>

            {/* Content Details */}
            <div className="card-content-block">
              <h3 className="card-heading-title">{act.title}</h3>
              <p className="card-sub-description">{act.subtitle}</p>
            </div>

            {/* Bottom CTA Row */}
            <div className="card-bottom-cta">
              <span className="cta-link-text">{act.actionText}</span>
              <span className="cta-arrow-circle">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
