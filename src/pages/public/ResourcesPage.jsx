import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  BookOpen,
  Layers,
  ShieldCheck,
  FileCheck,
  Calendar,
  HardDrive,
  Code2,
  BarChart3,
  Filter,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * ResourcesPage - Official Publications, DILRMP Guidelines, Acts & Open APIs
 * Conforms to fixed/sticky sidebar requirement, semantic color system, and GIGW 3.0 standards.
 */
export const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Resources', icon: BookOpen },
    { id: 'Downloads (Forms & Acts)', label: 'Downloads & Statutory Acts', icon: FileCheck },
    { id: 'Technical Guidelines', label: 'Technical Guidelines & SOPs', icon: Layers },
    { id: 'API & Developer Docs', label: 'API & Developer Specs', icon: Code2 },
    { id: 'National Data Reports', label: 'National Reports & Benchmarks', icon: BarChart3 },
  ];

  const formats = ['ALL', 'PDF', 'OpenAPI JSON', 'Data Sheet'];

  const resources = [
    {
      id: 'res-1',
      title: 'Digital India Land Records Modernization Programme (DILRMP) Guidelines 2.0',
      category: 'Technical Guidelines',
      docType: 'PDF',
      size: '3.4 MB',
      updatedDate: '15 Jan 2026',
      statusType: 'certified',
      statusText: 'Statutory Guideline',
      description: 'Comprehensive operational guidelines for state nodal agencies on computerization of land records, cadastral survey digitization, and modern record rooms setup.',
      source: 'Department of Land Resources (DoLR)',
      downloadUrl: '#',
    },
    {
      id: 'res-2',
      title: 'Unique Land Parcel Identification Number (ULPIN) Technical Specification & Standard',
      category: 'Technical Guidelines',
      docType: 'PDF',
      size: '2.1 MB',
      updatedDate: '02 Feb 2026',
      statusType: 'certified',
      statusText: 'National Standard',
      description: 'Standardized algorithm specification for generating 14-digit geo-referenced Bhu-Aadhaar identifiers from polygon boundary vertices and spatial centroids.',
      source: 'National Informatics Centre (NIC) & Survey of India',
      downloadUrl: '#',
    },
    {
      id: 'res-3',
      title: 'Right to Fair Compensation and Transparency in Land Acquisition Act (RFCTLARR)',
      category: 'Downloads (Forms & Acts)',
      docType: 'PDF',
      size: '1.8 MB',
      updatedDate: '10 Dec 2025',
      statusType: 'certified',
      statusText: 'Central Statute',
      description: 'Official statutory gazette notification and rules governing public purpose land acquisition, mandatory social impact assessments, and rehabilitation entitlements.',
      source: 'Ministry of Law & Justice, GoI',
      downloadUrl: '#',
    },
    {
      id: 'res-4',
      title: 'Model Form 6 & Form 135D Statutory Notice Templates for e-Ferfar Mutation',
      category: 'Downloads (Forms & Acts)',
      docType: 'PDF',
      size: '950 KB',
      updatedDate: '20 Nov 2025',
      statusType: 'action',
      statusText: 'Prescribed Template',
      description: 'Standardized citizen application forms for mutation upon registered sale deed, heirship succession, partition deed, and bank mortgage charge entry.',
      source: 'State Revenue Administration PMU',
      downloadUrl: '#',
    },
    {
      id: 'res-5',
      title: 'National Land Stack Federated REST & GraphQL OpenAPI Specification (v1.4)',
      category: 'API & Developer Docs',
      docType: 'OpenAPI JSON',
      size: '420 KB',
      updatedDate: '01 Mar 2026',
      statusType: 'info',
      statusText: 'Machine-Readable Spec',
      description: 'Machine-readable OpenAPI schemas and GraphQL endpoint definitions for inter-departmental federation, Sub-Registrar deed verification, and bank lien query APIs.',
      source: 'Digital India Developer Portal',
      downloadUrl: '#',
    },
    {
      id: 'res-6',
      title: 'ISO 19152: Land Administration Domain Model (LADM) National Profile Spec',
      category: 'API & Developer Docs',
      docType: 'PDF',
      size: '4.8 MB',
      updatedDate: '18 Nov 2025',
      statusType: 'certified',
      statusText: 'ISO Profile',
      description: 'Formal technical data model mapping Indian spatial units, tenure types (Khata, Patta, Sanad), and administrative rights into international cadastral standards.',
      source: 'Department of Land Resources (DoLR)',
      downloadUrl: '#',
    },
    {
      id: 'res-7',
      title: 'Annual National Land Governance & Cadastral Coverage Index Report 2025–26',
      category: 'National Data Reports',
      docType: 'PDF',
      size: '5.2 MB',
      updatedDate: '28 Feb 2026',
      statusType: 'certified',
      statusText: 'Annual Report',
      description: 'Comprehensive state-wise benchmark data on parcel mapping progress, mutation disposal TAT, SRO integration rates, and court dispute reduction metrics.',
      source: 'DoLR Monitoring & Evaluation Wing',
      downloadUrl: '#',
    },
  ];

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesCategory = selectedCategory === 'ALL' || res.category === selectedCategory;
      const matchesFormat = selectedFormat === 'ALL' || res.docType.includes(selectedFormat);
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.source.toLowerCase().includes(q);

      return matchesCategory && matchesFormat && matchesQuery;
    });
  }, [selectedCategory, selectedFormat, searchQuery]);

  return (
    <div className="page-resources ux4g-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* 1. Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-certified-bg)', color: 'var(--color-certified-text)', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 750, marginBottom: '0.6rem' }}>
          <span>📚</span>
          <span>आधिकारिक परिपत्रके व मार्गदर्शक तत्त्वे | Official Publications &amp; Technical Standards</span>
        </div>
        <h1 style={{ fontFamily: 'var(--ux4g-font-sans)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--ux4g-text-heading)', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          Resources, Circulars &amp; Technical Standards
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--ux4g-text-body)', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          Authoritative technical manuals, statutory gazette notifications, ISO cadastral schema profiles, and open API documentation for citizens, revenue officials, and software developers.
        </p>
      </div>

      {/* 2. Fixed/Sticky Sidebar Layout */}
      <div className="sticky-sidebar-layout">
        {/* ================= LEFT SIDEBAR (STICKY) ================= */}
        <aside className="sticky-sidebar-pane">
          <Card style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary, #1b4d3e)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Filter size={14} />
                <span>Resource Filters</span>
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b' }}>
                {filteredResources.length} of {resources.length}
              </span>
            </div>

            {/* Quick Search */}
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.84rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--ux4g-font-sans)',
                }}
              />
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Category Navigation List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 750, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
                Category
              </div>
              {categories.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory === cat.id;
                const count = cat.id === 'ALL' ? resources.length : resources.filter((r) => r.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 750 : 600,
                      border: isSelected ? '1px solid var(--primary, #1b4d3e)' : '1px solid transparent',
                      background: isSelected ? 'var(--primary-light, #edf7f3)' : 'transparent',
                      color: isSelected ? 'var(--primary, #1b4d3e)' : '#334155',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IconComp size={15} color={isSelected ? 'var(--primary, #1b4d3e)' : '#64748b'} />
                      <span>{cat.label}</span>
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: isSelected ? 'var(--primary, #1b4d3e)' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#64748b',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Document Format Chips */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 750, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                File Format
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {formats.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt)}
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      border: selectedFormat === fmt ? '1px solid var(--primary, #1b4d3e)' : '1px solid #e2e8f0',
                      background: selectedFormat === fmt ? 'var(--primary, #1b4d3e)' : '#f8fafc',
                      color: selectedFormat === fmt ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Help Box inside Sidebar */}
          <Card style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <HelpCircle size={16} color="var(--primary, #1b4d3e)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 750, color: 'var(--primary, #1b4d3e)' }}>
                Need Gazette Copies?
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.5rem', lineHeight: 1.45 }}>
              For certified historical gazette extracts or state land revenue notifications, contact the DoLR Documentation Desk at <strong>1800-120-8040</strong>.
            </p>
          </Card>
        </aside>

        {/* ================= RIGHT SCROLLABLE CONTENT PANE ================= */}
        <div className="scrollable-content-pane">
          {/* Header indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
              Showing {filteredResources.length} authoritative publications
            </span>
            {(selectedCategory !== 'ALL' || selectedFormat !== 'ALL' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedFormat('ALL');
                  setSearchQuery('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary, #ea580c)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Resources Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {filteredResources.length > 0 ? (
              filteredResources.map((res) => (
                <Card
                  key={res.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    borderTop: res.statusType === 'action' ? '3.5px solid var(--color-action-solid)' : '3.5px solid var(--primary, #1b4d3e)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <div style={{ padding: '1.35rem' }}>
                    {/* Card Meta Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        className={
                          res.statusType === 'action'
                            ? 'badge-action'
                            : res.statusType === 'info'
                            ? 'badge-info'
                            : 'badge-certified'
                        }
                      >
                        {res.statusText}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Calendar size={12} />
                        <span>Updated: {res.updatedDate}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        fontFamily: 'var(--ux4g-font-sans)',
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: '#0f2e24',
                        margin: '0 0 0.5rem',
                        lineHeight: 1.35,
                      }}
                    >
                      {res.title}
                    </h2>

                    {/* Full Readable Description (Never Truncated with ellipsis) */}
                    <p style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-body)', lineHeight: 1.55, margin: '0 0 0.75rem' }}>
                      {res.description}
                    </p>

                    {/* Source Agency */}
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      <strong>Source:</strong> {res.source}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div
                    style={{
                      padding: '0.85rem 1.35rem',
                      background: '#f8fafc',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottomLeftRadius: '12px',
                      borderBottomRightRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>
                      <FileText size={14} color="var(--primary, #1b4d3e)" />
                      <span>{res.docType} &bull; {res.size}</span>
                    </div>

                    <a
                      href={res.downloadUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading official publication: ${res.title} (${res.docType}, ${res.size})`);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'var(--primary, #1b4d3e)',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '0.4rem 0.85rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        boxShadow: '0 1px 3px rgba(27, 77, 62, 0.2)',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <Download size={13} />
                      <span>Download ({res.size})</span>
                    </a>
                  </div>
                </Card>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '3rem 1rem', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
                  No resources found matching the specified filters. Try selecting a different category or clearing search terms.
                </p>
              </div>
            )}
          </div>

          {/* Developer API & Data Portal Callout */}
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
                  Building on National Land Digital Public Infrastructure?
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
                  Access sandbox developer credentials, tokenized GraphQL APIs, and PostGIS cadastral boundary spatial layers on the Open Government Data (Data.gov.in) exchange.
                </p>
              </div>
              <a
                href="https://data.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'var(--secondary, #e65100)',
                  color: '#ffffff',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(230, 81, 0, 0.3)',
                }}
              >
                <span>Explore Open Data Exchange</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;

