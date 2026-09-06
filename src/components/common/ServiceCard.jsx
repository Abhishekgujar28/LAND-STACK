import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ServiceCard - Domain presentation card for government land records services
 * Conforms to UX4G & GIGW 3.0 standards (12px rounded corners, clean elevation)
 */
export const ServiceCard = ({ service, className = '' }) => {
  if (!service) return null;

  return (
    <div className={`common-service-card ${className}`.trim()}>
      <div className="service-card-header">
        <div className="service-icon-box">
          {service.icon || '📜'}
        </div>
        {service.category && (
          <span className="service-category-tag">
            {service.category}
          </span>
        )}
      </div>

      <div className="service-card-body">
        <h4 className="service-name">
          {service.name}
        </h4>
        <p className="service-description">
          {service.shortDescription}
        </p>
      </div>

      <div className="service-card-footer">
        <span className="service-requirement">
          {service.requiresLogin ? '🔒 Aadhaar Required' : '🌐 Direct Access'}
        </span>
        <Link
          to={service.route || '/services'}
          className="service-action-link"
        >
          <span>Access Service</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
