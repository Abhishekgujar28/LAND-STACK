import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, FileCheck, Layers, ShieldCheck, Map, RefreshCw } from 'lucide-react';
import governmentServicesData from '../../data/services/governmentServices.json';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * ServicesPage - National Land Governance Services Directory
 * Standardized per BharatBhumi Design System
 */
export const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'ALL',
    'Extracts & RoR',
    'Mutations',
    'Urban Titles',
    'Survey & Maps',
    'Citizen Due Diligence',
    'Disputes & Courts',
  ];

  const filteredServices = governmentServicesData.filter((service) => {
    const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      service.name.toLowerCase().includes(q) ||
      service.shortDescription.toLowerCase().includes(q) ||
      (service.stateVariants?.MH && service.stateVariants.MH.toLowerCase().includes(q)) ||
      (service.stateVariants?.RJ && service.stateVariants.RJ.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="page-services ux4g-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcf2e8', color: '#0f4d3a', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 750, marginBottom: '0.6rem' }}>
          <span>🏛️</span>
          <span>नागरिक सेवा निर्देशिका | Services Directory</span>
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontSize: '2.2rem', fontWeight: 850, color: '#0d382f', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          National Land Governance Services Directory
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#526b63', maxWidth: '720px', margin: '0 auto', lineHeight: 1.55 }}>
          Access authoritative Record of Rights (RoR), e-Ferfar mutation workflows, cadastral GIS maps, and composite due diligence dossiers across Indian states.
        </p>
      </div>

      {/* Search and Category Filter Card */}
      <Card style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by service name, state term (e.g. 7/12, Jamabandi, e-Ferfar, e-Mojani, Property Card)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: selectedCategory === cat ? '1px solid #1b4d3e' : '1px solid #e2e8f0',
                  background: selectedCategory === cat ? '#1b4d3e' : '#f8fafc',
                  color: selectedCategory === cat ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Services Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              borderTop: service.featured ? '3.5px solid #e65100' : '3.5px solid #1b4d3e',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: service.featured ? '#fff7ed' : '#edf7f3',
                    border: `1px solid ${service.featured ? '#ffedd5' : '#d1eade'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                  }}
                >
                  {service.icon || '📜'}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {service.featured && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#ffedd5', color: '#9a3412' }}>
                      FEATURED
                    </span>
                  )}
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#dcf2e8', color: '#0f4d3a' }}>
                    {service.category}
                  </span>
                </div>
              </div>

              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: '1.12rem',
                  fontWeight: 800,
                  color: '#0f2e24',
                  margin: '0 0 0.45rem',
                  lineHeight: 1.35,
                }}
              >
                {service.name}
              </h2>

              {service.stateVariants && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    color: '#475569',
                    marginBottom: '0.75rem',
                    lineHeight: 1.4,
                  }}
                >
                  {service.stateVariants.MH && <div><strong>Maharashtra:</strong> {service.stateVariants.MH}</div>}
                  {service.stateVariants.RJ && <div><strong>Rajasthan:</strong> {service.stateVariants.RJ}</div>}
                </div>
              )}

              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                {service.shortDescription}
              </p>
            </div>

            <div
              style={{
                padding: '0.85rem 1.4rem',
                background: '#f8fafc',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>
                {service.requiresLogin ? 'Requires Citizen Sign-In' : 'Public Access'}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (service.requiresLogin) {
                    navigate('/login/citizen');
                  } else {
                    navigate(service.route || '/citizen/search');
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: service.featured ? '#e65100' : '#1b4d3e',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.38rem 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                <span>{service.requiresLogin ? 'Login to Apply' : 'Access Service'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Assistance Banner */}
      <Card
        style={{
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, #075037 0%, #032b1e 100%)',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(7, 80, 55, 0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem' }}>
              Need Help with Land Services or Mutation Tracking?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
              Call national toll-free helpline 1800-120-8040 or search comprehensive citizen FAQs and guidelines.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/help" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#ffffff',
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                View FAQs & Guides
              </button>
            </Link>
            <Link to="/login/citizen" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                style={{
                  background: '#e65100',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(230, 81, 0, 0.3)',
                }}
              >
                Citizen Login →
              </button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServicesPage;
