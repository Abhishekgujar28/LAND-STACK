import React from 'react';

/**
 * ConnectedDepartments - Infinite looping marquee of integrated national ministries & portals
 * Conforms to UX4G / GIGW standards and PM GatiShakti inter-departmental integration
 */
export const ConnectedDepartments = ({ className = '' }) => {
  const portals = [
    {
      id: 'ngdrs',
      name: 'NGDRS',
      hindiName: 'दस्तावेज़ पंजीकरण',
      title: 'National Generic Document Registration System',
      category: 'Deed Registration',
      domain: 'ngdrs.gov.in',
      icon: '🏛️',
      color: '#064e3b',
    },
    {
      id: 'dolr',
      name: 'DoLR',
      hindiName: 'भूमि संसाधन विभाग',
      title: 'Department of Land Resources',
      category: 'Rural Development',
      domain: 'dolr.gov.in',
      icon: '🇮🇳',
      color: '#ea580c',
    },
    {
      id: 'bhunaksha',
      name: 'Bhu-Naksha',
      hindiName: 'कैडस्ट्रल भू-मानचित्र',
      title: 'National Cadastral Mapping Solution (NIC)',
      category: 'Spatial GIS Maps',
      domain: 'bhunaksha.gov.in',
      icon: '🗺️',
      color: '#0284c7',
    },
    {
      id: 'soi',
      name: 'Survey of India',
      hindiName: 'भारतीय सर्वेक्षण विभाग',
      title: 'National Mapping & CORS Geodetic Network',
      category: 'Geodetic Survey',
      domain: 'surveyofindia.gov.in',
      icon: '🧭',
      color: '#7c3aed',
    },
    {
      id: 'gatishakti',
      name: 'PM GatiShakti',
      hindiName: 'राष्ट्रीय मास्टर प्लान',
      title: 'National Master Plan for Multi-Modal Connectivity',
      category: 'Infrastructure',
      domain: 'pmgatishakti.gov.in',
      icon: '⚡',
      color: '#ea580c',
    },
    {
      id: 'ecourts',
      name: 'e-Courts NJDG',
      hindiName: 'राष्ट्रीय न्यायिक डेटा ग्रिड',
      title: 'Civil Land Litigation & Revenue Tribunal Sync',
      category: 'Judicial Sync',
      domain: 'ecourts.gov.in',
      icon: '⚖️',
      color: '#0f172a',
    },
    {
      id: 'cersai',
      name: 'CERSAI',
      hindiName: 'प्रतिभूति हित रजिस्ट्री',
      title: 'Central Security Interest Registry (Lien / Mortgage)',
      category: 'Mortgage Check',
      domain: 'cersai.org.in',
      icon: '🛡️',
      color: '#15803d',
    },
    {
      id: 'digilocker',
      name: 'DigiLocker',
      hindiName: 'डिजिटल लॉकर प्रणाली',
      title: 'Cryptographic 65B Digital Extract Issuance',
      category: 'e-Credentials',
      domain: 'digilocker.gov.in',
      icon: '🔒',
      color: '#0284c7',
    },
    {
      id: 'bhuvan',
      name: 'Bhuvan ISRO',
      hindiName: 'राष्ट्रीय भू-स्थानिक पोर्टल',
      title: 'High-Resolution Satellite Geoportal & LISS-IV',
      category: 'Satellite Remote Sensing',
      domain: 'bhuvan.nrsc.gov.in',
      icon: '🛰️',
      color: '#0891b2',
    },
    {
      id: 'svamitva',
      name: 'SVAMITVA',
      hindiName: 'स्वामित्व योजना',
      title: 'Survey of Inhabited Abadi via Drone Survey',
      category: 'Drone Cadastre',
      domain: 'svamitva.nic.in',
      icon: '🚁',
      color: '#ea580c',
    },
    {
      id: 'nic',
      name: 'NIC Cloud',
      hindiName: 'राष्ट्रीय सूचना विज्ञान केंद्र',
      title: 'MeitY National Cloud & Adapter Gateway',
      category: 'Gov Tech Mesh',
      domain: 'nic.in',
      icon: '🌐',
      color: '#064e3b',
    },
    {
      id: 'ulpin',
      name: 'Bhu-Aadhaar',
      hindiName: 'भू-आधार (ULPIN)',
      title: '14-Digit Standard Cadastral Parcel Identifier',
      category: 'National PIN',
      domain: 'dolr.gov.in',
      icon: '📍',
      color: '#ea580c',
    },
  ];

  // Duplicate for infinite seamless marquee loop
  const loopPortals = [...portals, ...portals];

  return (
    <section
      className={`connected-departments-section ${className}`.trim()}
      style={{
        padding: '3.5rem 0 3.25rem',
        background: '#ffffff',
        borderTop: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
        borderBottom: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
        overflow: 'hidden',
      }}
    >
      <div className="ux4g-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {/* Section Header (GIGW / PM GatiShakti style) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--primary-light, #ecfdf5)',
            color: 'var(--primary, #064e3b)',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.76rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            border: '1px solid var(--primary-subtle, #d1fae5)',
          }}
        >
          <span>🔗</span>
          <span>राष्ट्रीय एकीकृत नेटवर्क | Inter-Ministerial Integration</span>
        </div>

        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary, #064e3b)', margin: '0.2rem 0 0.4rem' }}>
          Connected External Departments & Ministries
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary, #475569)', maxWidth: '750px', margin: '0 auto' }}>
          Real-time bi-directional mesh synchronizing NGDRS deed registration, Bhu-Naksha cadastral geometry, e-Courts litigation, CERSAI charges, and PM GatiShakti multi-modal infrastructure.
        </p>

        <div
          style={{
            width: '50px',
            height: '3px',
            background: 'var(--secondary, #ea580c)',
            margin: '0.75rem auto 0',
            borderRadius: '2px',
          }}
        />
      </div>

      {/* Marquee Container with edge fade masks */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          padding: '0.75rem 0',
          maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
        }}
      >
        <div className="connected-departments-track">
          {loopPortals.map((portal, index) => (
            <div
              key={`${portal.id}-${index}`}
              className="connected-portal-card"
              style={{
                width: '260px',
                flexShrink: 0,
                background: '#ffffff',
                border: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
                borderLeft: `4px solid ${portal.color || 'var(--primary, #064e3b)'}`,
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  background: 'var(--ux4g-bg, #f8fafc)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}
              >
                {portal.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                  <h4
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: 'var(--ux4g-text, #0f172a)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {portal.name}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: '#64748b',
                      background: '#f1f5f9',
                      padding: '1px 5px',
                      borderRadius: '3px',
                    }}
                  >
                    .gov.in
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--primary, #064e3b)',
                    fontWeight: 600,
                    margin: '1px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {portal.hindiName}
                </div>

                <div
                  style={{
                    fontSize: '0.68rem',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {portal.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectedDepartments;
