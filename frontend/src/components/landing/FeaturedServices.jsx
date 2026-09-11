import React, { useState } from 'react';
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
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Layers,
  HelpCircle,
  Clock,
  Shield,
} from 'lucide-react';

/**
 * FeaturedServices - 2-Column Government Service Catalog
 * Replaces box grid monotony with a 2-column layout:
 * - Left: Vertical Category Navigation with active indicators and quick stats
 * - Right: Clean, horizontal service rows with full metadata, regional aliases, and direct CTAs.
 */
export const FeaturedServices = ({ services = [], className = '' }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Categories list
  const categories = [
    { id: 'ALL', label: 'All Popular Services', icon: Layers, count: services.length },
    { id: 'Extracts & RoR', label: 'Extracts & RoR Records', icon: FileText, count: services.filter(s => s.category === 'Extracts & RoR').length },
    { id: 'Mutations', label: 'Online Mutations & Transfers', icon: RefreshCw, count: services.filter(s => s.category === 'Mutations').length },
    { id: 'Survey & Maps', label: 'Cadastral Maps & Spatial GIS', icon: Map, count: services.filter(s => s.category === 'Survey & Maps').length },
    { id: 'Citizen Due Diligence', label: 'Citizen Due Diligence', icon: ShieldCheck, count: services.filter(s => s.category === 'Citizen Due Diligence' || s.category === 'Disputes & Courts').length },
    { id: 'Search', label: 'ULPIN Bhu-Aadhaar Search', icon: Search, count: services.filter(s => s.category === 'Search').length },
    { id: 'Urban Titles', label: 'Urban Land Property Cards', icon: Building2, count: services.filter(s => s.category === 'Urban Titles').length },
  ];

  // Filter services by category
  const filteredServices =
    activeCategory === 'ALL'
      ? services.filter(s => s.featured || s.popular || ['SRV-001', 'SRV-002', 'SRV-003', 'SRV-004', 'SRV-008', 'SRV-012', 'SRV-015'].includes(s.id))
      : services.filter(s => {
          if (activeCategory === 'Citizen Due Diligence') return s.category === 'Citizen Due Diligence' || s.category === 'Disputes & Courts';
          return s.category === activeCategory;
        });

  // Helper to map icon component
  const getServiceIcon = (id, category) => {
    switch (id) {
      case 'SRV-001': return FileText;
      case 'SRV-002': return FileSpreadsheet;
      case 'SRV-003': return Building2;
      case 'SRV-004':
      case 'SRV-005':
      case 'SRV-009': return RefreshCw;
      case 'SRV-006':
      case 'SRV-008': return Map;
      case 'SRV-011':
      case 'SRV-012': return ShieldCheck;
      case 'SRV-015': return Search;
      default: return FileText;
    }
  };

  return (
    <section className={`landing-featured-services ${className}`.trim()}>
      <div className="ux4g-container">
        {/* Government Section Header */}
        <div className="section-header-compact">
          <div className="section-eyebrow-pill">
            <span className="pill-dot"></span>
            <span>लोकप्रिय नागरिक सेवाएं | Key Citizen Land Services</span>
          </div>
          <h2 className="section-main-heading">
            Popular <span className="heading-saffron">Land &amp; Revenue</span> Services
          </h2>
          <p className="section-sub-heading">
            Access verified digitally signed land records, cadastral maps, and mutation services across 36 States &amp; UTs.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="services-2col-layout">
          {/* Left Column: Vertical Category Navigation */}
          <div className="services-nav-sidebar">
            <div className="sidebar-nav-header">
              <span className="sidebar-nav-title">Service Categories</span>
              <span className="sidebar-nav-count">{services.length} Services</span>
            </div>

            <nav className="sidebar-category-list">
              {categories.map((cat) => {
                const IconComp = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`sidebar-nav-item ${isActive ? 'item-active' : ''}`}
                  >
                    <div className="item-icon-title">
                      <IconComp size={16} strokeWidth={isActive ? 2.5 : 2} className="cat-icon" />
                      <span>{cat.label}</span>
                    </div>
                    <span className="item-badge">{cat.count}</span>
                  </button>
                );
              })}
            </nav>

            {/* Helpline / Verification Notice in Sidebar */}
            <div className="sidebar-info-card">
              <div className="info-card-header">
                <Shield size={16} strokeWidth={2.4} className="text-forest" />
                <span className="info-card-title">Digital India Verified</span>
              </div>
              <p className="info-card-desc">
                All extracts are QR-coded and legally admissible in Indian courts under IT Act 2000.
              </p>
              <div className="info-card-badge">
                <Clock size={12} strokeWidth={2.2} />
                <span>24x7 Instant Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: Horizontal Service Rows */}
          <div className="services-rows-container">
            <div className="rows-list-header">
              <span className="list-showing-text">
                Showing <strong>{filteredServices.length}</strong> services under{' '}
                <span className="active-cat-name">
                  {categories.find(c => c.id === activeCategory)?.label || 'All'}
                </span>
              </span>
            </div>

            <div className="services-rows-list">
              {filteredServices.map((service) => {
                const IconComp = getServiceIcon(service.id, service.category);
                const isFeaturedOrange = service.id === 'SRV-003' || service.category === 'Urban Titles';

                return (
                  <div
                    key={service.id}
                    className={`service-horizontal-row ${isFeaturedOrange ? 'row-highlight-orange' : ''}`}
                  >
                    {/* Left Icon */}
                    <div className={`service-row-icon-box ${isFeaturedOrange ? 'box-orange' : 'box-green'}`}>
                      <IconComp size={20} strokeWidth={2.2} />
                    </div>

                    {/* Middle Content */}
                    <div className="service-row-body">
                      <div className="service-row-topline">
                        <h3 className="service-row-title">{service.name}</h3>
                        <span className={`service-row-tag ${isFeaturedOrange ? 'tag-saffron' : 'tag-mint'}`}>
                          {service.category.toUpperCase()}
                        </span>
                      </div>

                      <p className="service-row-desc">{service.shortDescription}</p>

                      {/* Micro Metadata Tags */}
                      <div className="service-row-meta">
                        {service.stateVariants && (
                          <span className="meta-alias">
                            Aliases: <strong>{Object.values(service.stateVariants).join(', ')}</strong>
                          </span>
                        )}
                        <span className="meta-separator">•</span>
                        {service.requiresLogin ? (
                          <span className="meta-req req-aadhaar">
                            <Lock size={12} strokeWidth={2.5} />
                            <span>Aadhaar / e-Sign Required</span>
                          </span>
                        ) : (
                          <span className="meta-req req-direct">
                            <Globe size={12} strokeWidth={2.2} />
                            <span>Direct Public Access</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right CTA */}
                    <div className="service-row-action">
                      <Link
                        to={service.route || '/services'}
                        className={`service-row-btn ${isFeaturedOrange ? 'btn-saffron' : 'btn-forest'}`}
                      >
                        <span>Access Service</span>
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
