import React, { useState } from 'react';
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
} from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * ResourcesPage - Official Publications, DILRMP Guidelines, Acts & Open APIs
 * Enhanced per BharatBhumi Design System
 */
export const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'ALL',
    'Downloads (Forms & Acts)',
    'Technical Guidelines',
    'API & Developer Docs',
    'National Data Reports',
  ];

  const resources = [
    {
      id: 'res-1',
      title: 'Digital India Land Records Modernization Programme (DILRMP) Guidelines 2.0',
      category: 'Technical Guidelines',
      docType: 'PDF',
      size: '3.4 MB',
      updatedDate: '15 Jan 2026',
      description: 'Comprehensive operational guidelines for state nodal agencies on computerization of land records, cadastral survey digitization, and modern records rooms.',
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
      description: 'Standardized algorithm specification for generating 14-digit geo-referenced Bhu-Aadhaar identifiers from polygon vertices and spatial centroids.',
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
      description: 'Official statutory gazette notification and rules governing public purpose land acquisition, social impact assessments, and compensation rehabilitation.',
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
      description: 'Standardized citizen application forms for mutation upon sale deed, heirship succession, partition, and bank mortgage charge entry.',
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
      description: 'Machine-readable OpenAPI schemas and GraphQL endpoint definitions for inter-departmental federation, Sub-Registrar deed verification, and bank lien query.',
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
      description: 'Comprehensive state-wise benchmark data on parcel mapping progress, mutation disposal TAT, SRO integration rates, and court dispute reduction.',
      source: 'DoLR Monitoring & Evaluation Wing',
      downloadUrl: '#',
    },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'ALL' || res.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      res.title.toLowerCase().includes(q) ||
      res.description.toLowerCase().includes(q) ||
      res.source.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="page-resources ux4g-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcf2e8', color: '#0f4d3a', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 750, marginBottom: '0.6rem' }}>
          <span>📚</span>
          <span>आधिकारिक परिपत्रके व मार्गदर्शक तत्त्वे | Official Publications</span>
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontSize: '2.2rem', fontWeight: 850, color: '#0d382f', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          Resources, Circulars &amp; Technical Standards
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#526b63', maxWidth: '720px', margin: '0 auto', lineHeight: 1.55 }}>
          Official technical manuals, statutory gazette notifications, ISO cadastral schema profiles, and open API documentation for citizens, revenue officials, and developers.
        </p>
      </div>

      {/* Search and Category Filter Card */}
      <Card style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by guideline title, keyword (e.g., ULPIN, DILRMP, SOP, LADM, RFCTLARR)..."
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

      {/* Resources Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {filteredResources.map((res) => (
          <Card
            key={res.id}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              borderTop: '3.5px solid #1b4d3e',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ padding: '1.4rem' }}>
              {/* Card Meta Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: '#dcf2e8',
                    color: '#0f4d3a',
                  }}
                >
                  {res.category}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Calendar size={12} />
                  <span>Updated: {res.updatedDate}</span>
                </span>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  color: '#0f2e24',
                  margin: '0 0 0.5rem',
                  lineHeight: 1.35,
                }}
              >
                {res.title}
              </h2>

              {/* Description */}
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                {res.description}
              </p>

              {/* Source Agency */}
              <div style={{ fontSize: '0.76rem', color: '#64748b', fontStyle: 'italic' }}>
                Source: {res.source}
              </div>
            </div>

            {/* Bottom Action Footer */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>
                <FileText size={14} color="#1b4d3e" />
                <span>{res.docType} &bull; {res.size}</span>
              </div>

              <a
                href={res.downloadUrl}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading ${res.title} (${res.docType}, ${res.size})`);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#1b4d3e',
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
        ))}
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
              Building Applications on National Land Public Infrastructure?
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
              background: '#e65100',
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
  );
};

export default ResourcesPage;
