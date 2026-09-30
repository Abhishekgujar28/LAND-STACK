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
  Layers,
  Clock,
  Shield,
  Scale,
  Compass,
  CheckCircle2,
  LogIn,
} from 'lucide-react';
import { defaultServices } from '../../data/landingData';

/**
 * FeaturedServices - Informational Directory of Citizen Land Governance Services
 * Explains available citizen services, statutory turnaround times, and regional aliases,
 * providing clean authentication guidance instead of unauthenticated bypass links.
 */
export const FeaturedServices = ({ services = [], className = '' }) => {
  const activeServicesList = services && services.length > 0 ? services : defaultServices;
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All Key Services', icon: Layers, count: activeServicesList.length },
    {
      id: 'Extracts & RoR',
      label: 'Extracts & RoR Records',
      icon: FileText,
      count: activeServicesList.filter((s) => s.category === 'Extracts & RoR').length,
    },
    {
      id: 'Mutations',
      label: 'Online Mutations & Transfers',
      icon: RefreshCw,
      count: activeServicesList.filter((s) => s.category === 'Mutations').length,
    },
    {
      id: 'Survey & Maps',
      label: 'Cadastral Maps & Spatial GIS',
      icon: Map,
      count: activeServicesList.filter((s) => s.category === 'Survey & Maps').length,
    },
    {
      id: 'Citizen Due Diligence',
      label: 'Citizen Due Diligence',
      icon: ShieldCheck,
      count: activeServicesList.filter(
        (s) => s.category === 'Citizen Due Diligence' || s.category === 'Disputes & Courts'
      ).length,
    },
    {
      id: 'Search',
      label: 'ULPIN Bhu-Aadhaar Search',
      icon: Search,
      count: activeServicesList.filter((s) => s.category === 'Search').length,
    },
    {
      id: 'Urban Titles',
      label: 'Urban Land Property Cards',
      icon: Building2,
      count: activeServicesList.filter((s) => s.category === 'Urban Titles').length,
    },
  ];

  const filteredServices =
    activeCategory === 'ALL'
      ? activeServicesList
      : activeServicesList.filter((s) => {
          if (activeCategory === 'Citizen Due Diligence') {
            return s.category === 'Citizen Due Diligence' || s.category === 'Disputes & Courts';
          }
          return s.category === activeCategory;
        });

  const getServiceIcon = (iconType) => {
    switch (iconType) {
      case 'document': return FileText;
      case 'fingerprint': return Search;
      case 'map': return Map;
      case 'refresh': return RefreshCw;
      case 'shield': return ShieldCheck;
      case 'building': return Building2;
      case 'scale': return Scale;
      case 'compass': return Compass;
      default: return FileText;
    }
  };

  return (
    <section className={`landing-featured-services ${className}`.trim()}>
      <div className="ux4g-container">
        {/* Section Header */}
        <div className="section-header-compact">
          <div className="section-eyebrow-pill">
            <span className="pill-dot"></span>
            <span>Citizen Service Catalog &bull; Land &amp; Revenue Services</span>
          </div>
          <h2 className="section-main-heading">
            Overview of <span className="heading-saffron">Land &amp; Revenue Services</span>
          </h2>
          <p className="section-sub-heading">
            Detailed information on digitally signed Record of Rights, statutory mutation workflows, cadastral GIS layers, and composite due diligence.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="services-2col-layout">
          {/* Left Column: Category Navigation & Citizen Login Guidance */}
          <div className="services-nav-sidebar">
            <div className="sidebar-nav-header">
              <span className="sidebar-nav-title">Service Categories</span>
              <span className="sidebar-nav-count">{activeServicesList.length} Services Cataloged</span>
            </div>

            <nav className="sidebar-category-list" aria-label="Land service categories">
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

            {/* Secure Citizen Login Requirement Card */}
            <div className="sidebar-auth-notice-card">
              <div className="auth-notice-header">
                <Lock size={18} className="text-forest" />
                <h4 className="auth-notice-title">Authenticated Citizen Access</h4>
              </div>
              <p className="auth-notice-desc">
                In compliance with data protection &amp; statutory land laws, certified downloads, mutation filings, and diligence dossiers require verified Citizen Login.
              </p>
              <Link to="/login/citizen" className="auth-notice-btn">
                <LogIn size={14} />
                <span>Login to Citizen Portal</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Informational Service Specification Cards */}
          <div className="services-rows-container">
            <div className="rows-list-header">
              <span className="list-showing-text">
                Showing specifications for <strong>{filteredServices.length}</strong> services under{' '}
                <span className="active-cat-name">
                  {categories.find((c) => c.id === activeCategory)?.label || 'All'}
                </span>
              </span>
            </div>

            <div className="services-rows-list">
              {filteredServices.map((service) => {
                const IconComp = getServiceIcon(service.iconType);
                const isFeaturedSaffron = service.category === 'Urban Titles' || service.id === 'SRV-002';

                return (
                  <div
                    key={service.id}
                    className={`service-spec-card ${isFeaturedSaffron ? 'card-saffron-accent' : ''}`}
                  >
                    {/* Left Icon Thumbnail */}
                    <div className={`service-spec-icon-box ${isFeaturedSaffron ? 'box-saffron' : 'box-emerald'}`}>
                      <IconComp size={22} strokeWidth={2.2} />
                    </div>

                    {/* Center Service Information */}
                    <div className="service-spec-body">
                      <div className="service-spec-topline">
                        <h3 className="service-spec-title">{service.name}</h3>
                        <span className={`service-spec-tag ${isFeaturedSaffron ? 'tag-saffron' : 'tag-mint'}`}>
                          {service.categoryTag || service.category.toUpperCase()}
                        </span>
                      </div>

                      <p className="service-spec-desc">{service.shortDescription}</p>

                      {/* Micro Metadata Tags (Regional Aliases & SLA) */}
                      <div className="service-spec-meta">
                        {service.stateVariants && (
                          <span className="meta-alias">
                            Regional Aliases: <strong>{Object.values(service.stateVariants).slice(0, 3).join(', ')}</strong>
                          </span>
                        )}
                        <span className="meta-separator">•</span>
                        <span className="meta-sla">
                          Turnaround SLA: <strong>{service.sla || 'Instant'}</strong>
                        </span>
                        <span className="meta-separator">•</span>
                        <span className="meta-statutory">
                          Statutory Fee: <strong>{service.fee || '₹15 Statutory'}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Right Security & Access Badge */}
                    <div className="service-spec-security">
                      {service.requiresLogin ? (
                        <div className="security-badge badge-auth">
                          <Lock size={12} strokeWidth={2.4} />
                          <span>Aadhaar / e-Sign Required</span>
                        </div>
                      ) : (
                        <div className="security-badge badge-public">
                          <Globe size={12} strokeWidth={2.2} />
                          <span>Public Registry Query</span>
                        </div>
                      )}
                      <span className="security-validity">Valid under IT Act 2000</span>
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
