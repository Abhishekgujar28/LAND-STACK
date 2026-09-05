import React from 'react';
import ServiceCard from '../common/ServiceCard';

/**
 * Landing Page - FeaturedServices Section (National)
 * Conforms to UX4G / GIGW standards
 */
export const FeaturedServices = ({ services = [], className = '' }) => {
  const featured = services.filter((s) => s.featured || s.popular);

  return (
    <section
      className={`landing-featured-services ${className}`.trim()}
      style={{
        padding: '3.5rem 0',
        background: '#ffffff',
        borderBottom: '1px solid var(--ux4g-border-subtle, #e2e8f0)',
      }}
    >
      <div className="ux4g-container">
        {/* Government Section Header (GIGW / PM GatiShakti style) */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
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
            <span>📜</span>
            <span>लोकप्रिय नागरिक सेवाएं | Key Citizen Land Services</span>
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary, #064e3b)', margin: '0.2rem 0 0.4rem' }}>
            Popular Land & Revenue Services
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary, #475569)', maxWidth: '720px', margin: '0 auto' }}>
            Most frequently accessed digitally signed land records, cadastral maps, and mutation services across India.
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

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
