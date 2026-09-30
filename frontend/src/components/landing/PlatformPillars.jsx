import React from 'react';
import {
  Fingerprint,
  FileCheck,
  Map,
  ArrowLeftRight,
  ShieldCheck,
  Scale,
  Sparkles,
} from 'lucide-react';

/**
 * PlatformPillars - Core Capabilities & Institutional Pillars of BharatBhumi
 * Clean, informative cards explaining what the platform does without direct-access bypass links.
 */
export const PlatformPillars = ({ className = '' }) => {
  const pillars = [
    {
      id: 'ulpin',
      title: 'Bhu-Aadhaar (14-Digit ULPIN)',
      tag: 'Spatial Identity',
      tagColor: 'orange',
      icon: <Fingerprint size={24} color="#E65100" strokeWidth={2.2} />,
      summary:
        'A unique 14-digit alphanumeric geocoded standard identifier assigned to every cadastral land parcel based on international standards (ISO 19152 LADM) and geodetic coordinates.',
      benefits: ['Eliminates duplicate registrations', 'Prevents benami transactions', 'Unified parcel lifecycle tracking'],
    },
    {
      id: 'ror',
      title: 'Digitized Record of Rights (RoR)',
      tag: 'Certified Registry',
      tagColor: 'green',
      icon: <FileCheck size={24} color="#0D6E4F" strokeWidth={2.2} />,
      summary:
        'Authoritative digital land extracts (7/12, 8A Khata, Jamabandi, Pahani, Patta Chitta) secured with cryptographic QR codes and instant verifiability under the IT Act 2000.',
      benefits: ['Instant QR verification', 'Direct DigiLocker synchronization', 'Tamper-proof digital signatures'],
    },
    {
      id: 'naksha',
      title: 'Cadastral Bhu-Naksha GIS',
      tag: 'Vector Cartography',
      tagColor: 'blue',
      icon: <Map size={24} color="#0284C7" strokeWidth={2.2} />,
      summary:
        'High-resolution spatial village maps seamlessly integrated with ROR text databases. Features sub-division mapping, satellite overlays, and SVAMITVA drone ortho-mosaics.',
      benefits: ['Centimeter-level survey accuracy', 'Seamless sub-division updates', 'Overlaid satellite & topographical layers'],
    },
    {
      id: 'mutation',
      title: 'e-Ferfar Statutory Mutation',
      tag: 'Workflow Automation',
      tagColor: 'amber',
      icon: <ArrowLeftRight size={24} color="#D97706" strokeWidth={2.2} />,
      summary:
        'End-to-end transparent mutation workflow for sale deeds, inheritance, partition, and court decrees with automated public notice issuance and 15-day deemed approvals.',
      benefits: ['Zero physical office visits', 'Automated statutory notice dispatch', 'Guaranteed turnaround SLA'],
    },
    {
      id: 'diligence',
      title: 'Composite Due Diligence 360°',
      tag: 'Risk Intelligence',
      tagColor: 'teal',
      icon: <ShieldCheck size={24} color="#0D9488" strokeWidth={2.2} />,
      summary:
        'Consolidated title audit reports combining 30-year deed transaction histories, revenue court proceedings, bank mortgage liens, and government acquisition alerts.',
      benefits: ['Complete 30-year search history', 'Zero-friction bank loan processing', 'Pre-purchase legal clearance'],
    },
    {
      id: 'judicial',
      title: 'Real-Time NJDG Judicial Sync',
      tag: 'Litigation Shield',
      tagColor: 'purple',
      icon: <Scale size={24} color="#7C3AED" strokeWidth={2.2} />,
      summary:
        'Direct automated integration with the National Judicial Data Grid (e-Courts NJDG) reflecting civil court stay orders and injunctions directly on land records within hours.',
      benefits: ['Instant litigation warnings', 'Prevents illegal property sales', 'High Court / District Court sync'],
    },
  ];

  return (
    <section className={`landing-pillars-section ${className}`.trim()}>
      <div className="ux4g-container">
        {/* Section Header */}
        <div className="section-header-compact">
          <div className="section-eyebrow-pill">
            <span className="pill-dot"></span>
            <span>Platform Core Capabilities &bull; Digital Land Stack</span>
          </div>
          <h2 className="section-main-heading">
            Foundational Pillars of <span className="heading-saffron">Digital Land Stack</span>
          </h2>
          <p className="section-sub-heading">
            Transforming legacy manual revenue administration into an interconnected, real-time spatial digital public infrastructure.
          </p>
        </div>

        {/* 6-Card Informational Grid */}
        <div className="pillars-cards-grid">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="pillar-info-card">
              {/* Top Header */}
              <div className="pillar-card-topbar">
                <div className="pillar-icon-wrap">{pillar.icon}</div>
                <span className={`pillar-tag tag-${pillar.tagColor}`}>
                  {pillar.tag}
                </span>
              </div>

              {/* Title & Summary */}
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-summary">{pillar.summary}</p>

              {/* Benefit List */}
              <div className="pillar-benefits-block">
                <span className="benefits-label">Key Governance Value:</span>
                <ul className="benefits-list">
                  {pillar.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="benefit-item">
                      <span className="benefit-bullet">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformPillars;
