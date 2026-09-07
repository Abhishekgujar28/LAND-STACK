import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FileSpreadsheet,
  Building2,
  RefreshCw,
  Map,
  ShieldCheck,
  Search,
  Globe,
  Lock,
  ArrowRight,
} from 'lucide-react';

/**
 * ServiceCard - Domain presentation card for government land records services
 * Conforms to the reference UI specification with top border accent, rounded icon container,
 * uppercase category badge, clean typography, and standardized footer alignment.
 */
export const ServiceCard = ({ service, className = '' }) => {
  if (!service) return null;

  // Map icon component based on service ID or icon type
  const getIcon = () => {
    switch (service.id) {
      case 'SRV-001':
        return <FileText size={20} strokeWidth={2.2} />;
      case 'SRV-002':
        return <FileSpreadsheet size={20} strokeWidth={2.2} />;
      case 'SRV-003':
        return <Building2 size={20} strokeWidth={2.2} />;
      case 'SRV-004':
        return <RefreshCw size={20} strokeWidth={2.2} />;
      case 'SRV-008':
        return <Map size={20} strokeWidth={2.2} />;
      case 'SRV-012':
        return <ShieldCheck size={20} strokeWidth={2.2} />;
      case 'SRV-015':
        return <Search size={20} strokeWidth={2.2} />;
      default:
        return <FileText size={20} strokeWidth={2.2} />;
    }
  };

  // Check if this is the highlighted Urban Property Card (featured orange style in reference)
  const isUrbanCard = service.id === 'SRV-003' || service.category?.toLowerCase().includes('urban');

  return (
    <div
      className={`common-service-card ${isUrbanCard ? 'service-card-featured-orange' : 'service-card-standard'} ${className}`.trim()}
    >
      {/* Card Header: Icon Box (left) & Category Badge (right) */}
      <div className="service-card-header">
        <div className={`service-icon-box ${isUrbanCard ? 'icon-box-orange' : 'icon-box-green'}`}>
          {getIcon()}
        </div>
        {service.category && (
          <span className={`service-category-tag ${isUrbanCard ? 'tag-orange' : 'tag-neutral'}`}>
            {service.category.toUpperCase()}
          </span>
        )}
      </div>

      {/* Card Body: Title & Description */}
      <div className="service-card-body">
        <h4 className="service-name">
          {service.name}
        </h4>
        <p className="service-description">
          {service.shortDescription}
        </p>
      </div>

      {/* Card Footer: Access Status (left) & Action Button (right) */}
      <div className="service-card-footer">
        <div className="service-requirement">
          {service.requiresLogin ? (
            <span className="req-aadhaar">
              <Lock size={13} strokeWidth={2.5} />
              <span>Aadhaar Required</span>
            </span>
          ) : (
            <span className="req-direct">
              <Globe size={13} strokeWidth={2.2} />
              <span>Direct Access</span>
            </span>
          )}
        </div>

        <Link
          to={service.route || '/services'}
          className={`service-action-btn ${isUrbanCard ? 'btn-arrow-orange' : 'btn-arrow-green'}`}
          aria-label={`Access ${service.name}`}
        >
          <span className="action-text">Access Service</span>
          <span className="action-circle">
            <ArrowRight size={13} strokeWidth={2.5} />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
