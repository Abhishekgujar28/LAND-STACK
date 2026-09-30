import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, FileCheck, Layers, ShieldCheck, Map, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import publicService from '../../services/publicService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
export const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    publicService.getServices()
      .then((data) => {
        if (isMounted) {
          const list = (Array.isArray(data) ? data : []).map((s) => ({
            id: s.id,
            name: s.title || s.name,
            shortDescription: s.description || s.shortDescription,
            category: s.category || 'General',
            icon: s.icon || '📜',
            fee: s.fee || '₹15 Statutory',
            sla: s.processing_time || s.processingTime || 'Instant',
            route: s.route || '/services',
            featured: s.category === 'Extracts & RoR' || s.category === 'Mutations',
          }));
          setServices(list);
        }
      })
      .catch((err) => {
        console.error('Failed to load services:', err);
        if (isMounted) setServices([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'ALL',
    'Extracts & Certificates',
    'Mutations & Transfers',
    'Survey & Demarcation',
    'Due Diligence & Title Search',
    'Revenue Court & Appeals',
    'Grievance Redressal',
  ];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        (service.name && service.name.toLowerCase().includes(q)) ||
        (service.shortDescription && service.shortDescription.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="page-services ux4g-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* 1. Standardized Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-certified-bg)', color: 'var(--color-certified-text)', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 750, marginBottom: '0.6rem' }}>
          <span>🏛️</span>
          <span>Citizen Services Directory</span>
        </div>
        <h1 style={{ fontFamily: 'var(--ux4g-font-sans)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--ux4g-text-heading)', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          National Land Governance Services Directory
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--ux4g-text-body)', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          Access authoritative Record of Rights (RoR), e-Ferfar mutation workflows, cadastral GIS maps, and composite due diligence dossiers across Indian states.
        </p>
      </div>

      {/* 2. Search and Category Filter Card */}
      <Card style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by service name or state term (e.g. 7/12, Jamabandi, e-Ferfar, e-Mojani, Property Card)..."
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
                fontFamily: 'var(--ux4g-font-sans)',
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
                  border: selectedCategory === cat ? '1px solid var(--primary, #1b4d3e)' : '1px solid #e2e8f0',
                  background: selectedCategory === cat ? 'var(--primary, #1b4d3e)' : '#f8fafc',
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

      {/* 3. Services Grid with Semantic Cards & Explicit Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {filteredServices.map((service) => {
          const isActionType = service.category === 'Mutations' || service.featured;
          return (
            <Card
              key={service.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                borderTop: isActionType ? '3.5px solid var(--color-action-solid)' : '3.5px solid var(--primary, #1b4d3e)',
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
                      background: isActionType ? 'var(--color-action-bg)' : 'var(--color-certified-bg)',
                      border: `1px solid ${isActionType ? 'var(--color-action-border)' : 'var(--color-certified-border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                    }}
                  >
                    {service.icon || '📜'}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {service.featured && (
                      <span className="badge-action">
                        FEATURED
                      </span>
                    )}
                    <span className={isActionType ? 'badge-action' : 'badge-certified'}>
                      {service.category}
                    </span>
                  </div>
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--ux4g-font-sans)',
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

                {/* Full Unclipped Description */}
                <p style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-body)', lineHeight: 1.55, margin: 0 }}>
                  {service.shortDescription}
                </p>
              </div>

              {/* Explicit Labeled Action Footer */}
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
                  flexWrap: 'wrap',
                  gap: '0.5rem',
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
                    background: service.requiresLogin ? 'var(--secondary, #ea580c)' : 'var(--primary, #1b4d3e)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '0.42rem 0.95rem',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: service.requiresLogin ? '0 2px 4px rgba(234, 88, 12, 0.25)' : '0 2px 4px rgba(27, 77, 62, 0.2)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{service.requiresLogin ? 'Sign In to Apply' : 'Access Service'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 4. Bottom Assistance Banner */}
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
                View FAQs &amp; Guides
              </button>
            </Link>
            <Link to="/login/citizen" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                style={{
                  background: 'var(--secondary, #e65100)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(230, 81, 0, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>Citizen Login</span>
                <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServicesPage;

