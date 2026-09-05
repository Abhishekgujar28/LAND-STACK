import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import governmentServicesData from '../../data/services/governmentServices.json';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

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
    <div className="page-services ux4g-container" style={{ padding: '2.5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ux4g-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Government of India &bull; Digital India Land Records (DILRMP)
        </div>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
          National Land Governance Services Directory
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary)', maxWidth: '680px', margin: '0 auto' }}>
          Access authoritative Record of Rights (RoR), e-Ferfar mutation workflows, cadastral GIS maps, and composite due diligence dossiers across Indian states.
        </p>
      </div>

      {/* Search and Category Filter */}
      <Card style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="ux4g-form-group" style={{ margin: 0 }}>
            <input
              type="text"
              className="ux4g-input"
              placeholder="Search by service name, state term (e.g. 7/12, Jamabandi, e-Ferfar, e-Mojani, Property Card)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--ux4g-radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  border: 'none',
                  background: selectedCategory === cat ? 'var(--ux4g-primary)' : 'var(--ux4g-surface-muted)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--ux4g-text)',
                  cursor: 'pointer',
                  transition: 'background var(--ux4g-transition-fast)',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: service.featured ? '4px solid #ff9933' : '4px solid var(--ux4g-primary)',
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '2.2rem' }}>{service.icon || '📜'}</div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {service.featured && <Badge variant="warning">FEATURED</Badge>}
                  <Badge variant="primary">{service.category}</Badge>
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: 'var(--ux4g-primary)', margin: '0 0 0.5rem' }}>
                {service.name}
              </h3>

              {service.stateVariants && (
                <div style={{ background: 'var(--ux4g-surface-muted)', padding: '0.5rem 0.75rem', borderRadius: 'var(--ux4g-radius-sm)', fontSize: '0.775rem', color: 'var(--ux4g-text)', marginBottom: '0.75rem' }}>
                  {service.stateVariants.MH && <div><strong>Maharashtra:</strong> {service.stateVariants.MH}</div>}
                  {service.stateVariants.RJ && <div><strong>Rajasthan:</strong> {service.stateVariants.RJ}</div>}
                </div>
              )}

              <p style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {service.shortDescription}
              </p>
            </div>

            <div style={{ padding: '1rem 1.5rem', background: '#fafbfc', borderTop: '1px solid var(--ux4g-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                {service.requiresLogin ? 'Requires Citizen Login' : 'Public Access'}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (service.requiresLogin) {
                    navigate('/login/citizen');
                  } else {
                    navigate(service.route || '/citizen/search');
                  }
                }}
              >
                {service.requiresLogin ? 'Login to Apply →' : 'Access Service →'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Assistance Banner */}
      <Card style={{ padding: '2rem', background: 'linear-gradient(135deg, #0b3c5d 0%, #1a4968 100%)', color: '#ffffff', borderRadius: 'var(--ux4g-radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ color: '#ffffff', fontSize: '1.35rem', margin: '0 0 0.4rem' }}>
              Need Help with Land Services or Mutation Tracking?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', margin: 0 }}>
              Call national toll-free helpline 1800-120-8040 or search comprehensive FAQs.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/help">
              <Button variant="outline" style={{ color: '#ffffff', borderColor: '#ffffff', background: 'rgba(255,255,255,0.1)' }}>
                View FAQs & Guides
              </Button>
            </Link>
            <Link to="/login/citizen">
              <Button variant="primary" style={{ background: '#ff9933', borderColor: '#ff9933', color: '#000000', fontWeight: 700 }}>
                Citizen Login →
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServicesPage;
