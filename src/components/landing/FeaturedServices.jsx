import React from 'react';
import ServiceCard from '../common/ServiceCard';

/**
 * Landing Page - FeaturedServices Section (National)
 */
export const FeaturedServices = ({ services = [], className = '' }) => {
  const featured = services.filter((s) => s.featured || s.popular);

  return (
    <section
      className={`landing-featured-services ${className}`.trim()}
      style={{ padding: '3.5rem 0', background: '#ffffff', borderBottom: '1px solid var(--ux4g-border-subtle)' }}
    >
      <div className="ux4g-container">
        <div className="section-header">
          <h2>Popular Land Services</h2>
          <p>Most frequently accessed land record and revenue services across India</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
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
