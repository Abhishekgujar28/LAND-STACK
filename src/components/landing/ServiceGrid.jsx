import React from 'react';
import ServiceCard from '../common/ServiceCard';

/**
 * Landing Page - ServiceGrid Section
 */
export const ServiceGrid = ({ services = [], title = 'All Citizen & Revenue Services', className = '' }) => {
  return (
    <section className={`landing-service-grid ${className}`.trim()} style={{ padding: '3rem 0' }}>
      <div className="ux4g-container">
        {title && <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{title}</h2>}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
