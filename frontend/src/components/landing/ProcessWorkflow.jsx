import React from 'react';
import {
  UserCheck,
  Cpu,
  MapPin,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
} from 'lucide-react';

/**
 * ProcessWorkflow - Informational End-to-End Governance Lifecycle
 * Explains how the BharatBhumi platform orchestrates transactions from citizens to revenue authorities.
 */
export const ProcessWorkflow = ({ className = '' }) => {
  const steps = [
    {
      step: '01',
      title: 'Citizen Request & Identity Seeding',
      roleTag: 'Citizen Domain',
      tagColor: 'green',
      icon: <UserCheck size={24} className="text-emerald-700" />,
      description:
        'Citizens authenticate securely via Aadhaar / e-Pramaan Single Sign-On (SSO) to search 14-digit Bhu-Aadhaar (ULPIN), apply for mutations, or request spatial demarcation.',
      deliverable: 'Authenticated Digital Application',
    },
    {
      step: '02',
      title: 'Automated Multi-Agency Handshake',
      roleTag: 'Interoperability Engine',
      tagColor: 'orange',
      icon: <Cpu size={24} className="text-orange-700" />,
      description:
        'Real-time automated integrity verification across National Judicial Data Grid (e-Courts NJDG for stay orders), CERSAI (bank mortgage liens), and SRO Registration deeds.',
      deliverable: 'Zero-Dispute Title Validation',
    },
    {
      step: '03',
      title: 'Cadastral GIS Demarcation',
      roleTag: 'Survey & Settlement',
      tagColor: 'blue',
      icon: <MapPin size={24} className="text-sky-700" />,
      description:
        'Field surveyors and GIS analysts utilize DGPS CORS geodetic measurements, Bhu-Naksha parcel subdivision, and SVAMITVA drone ortho-mosaics to update boundaries spatially.',
      deliverable: 'Geo-Referenced Vector Geometry',
    },
    {
      step: '04',
      title: 'Statutory Adjudication & RoR Issuance',
      roleTag: 'Revenue Authority',
      tagColor: 'teal',
      icon: <FileCheck2 size={24} className="text-teal-700" />,
      description:
        'Talathi and Tehsildar adjudicate digital workqueues under a time-bound statutory SLA (15-day deemed approval). Legally admissible, QR-coded RoRs are synced directly to DigiLocker.',
      deliverable: 'QR-Verified Immutable 7/12 Extract',
    },
  ];

  return (
    <section className={`landing-workflow-section ${className}`.trim()}>
      <div className="ux4g-container">
        {/* Section Header */}
        <div className="section-header-compact">
          <div className="section-eyebrow-pill">
            <span className="pill-dot"></span>
            <span>प्रक्रिया प्रवाह एवं कार्यप्रणाली | End-to-End Governance Architecture</span>
          </div>
          <h2 className="section-main-heading">
            How BharatBhumi <span className="heading-saffron">Manages Land Governance</span>
          </h2>
          <p className="section-sub-heading">
            A unified, transparent digital public infrastructure seamlessly linking citizens, revenue officers, registration authorities, and judicial registries.
          </p>
        </div>

        {/* 4-Step Process Flow Grid */}
        <div className="workflow-cards-grid">
          {steps.map((item, idx) => (
            <div key={item.step} className="workflow-card">
              {/* Top Step Number + Domain Badge */}
              <div className="workflow-top-bar">
                <span className="workflow-step-num">{item.step}</span>
                <span className={`workflow-role-tag tag-${item.tagColor}`}>
                  {item.roleTag}
                </span>
              </div>

              {/* Icon */}
              <div className="workflow-icon-box">{item.icon}</div>

              {/* Title & Description */}
              <h3 className="workflow-card-title">{item.title}</h3>
              <p className="workflow-card-desc">{item.description}</p>

              {/* Bottom Output Deliverable */}
              <div className="workflow-deliverable-box">
                <span className="deliverable-label">Key Output:</span>
                <span className="deliverable-text">{item.deliverable}</span>
              </div>

              {/* Connecting arrow indicator between cards */}
              {idx < steps.length - 1 && (
                <div className="workflow-connector-indicator d-none d-lg-flex" aria-hidden="true">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Informational Callout Bar */}
        <div className="workflow-trust-callout">
          <div className="callout-left">
            <ShieldAlert size={20} className="text-emerald-700" />
            <div>
              <strong>Legally Enforceable &amp; Statutorily Bound</strong>
              <span>
                All administrative workflows comply with the Right to Public Services Act and the Information Technology Act 2000.
              </span>
            </div>
          </div>
          <div className="callout-right">
            <span className="callout-badge">100% Paperless &amp; Auditable</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessWorkflow;
