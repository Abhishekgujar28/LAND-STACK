import React from 'react';
import { Link } from 'react-router-dom';
import nationalStats from '../../data/analytics/national.json';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const AboutPage = () => {
  return (
    <div className="page-about ux4g-container" style={{ padding: '2.5rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Hero Strip */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--ux4g-primary-light)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', marginBottom: '0.75rem' }}>
          <span>🇮🇳</span> SIH PROBLEM STATEMENT 26014 &bull; National Land Governance Initiative (2026–2031)
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--ux4g-primary)', marginBottom: '0.75rem' }}>
          About BharatBhumi National Portal
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--ux4g-text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          A parcel-centric federated Digital Public Infrastructure and governance intelligence platform connecting India's state land administration systems into a unified citizen and government experience mesh.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card style={{ padding: '1.75rem', borderTop: '4px solid var(--ux4g-primary)' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
            Parcel-Centric Identity (ULPIN)
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Every interaction is anchored to a unique 14-digit Bhu-Aadhaar ULPIN, resolving fragmented state identifiers (Survey No, Gat No, Khasra No, CTS No) into a single canonical identity.
          </p>
        </Card>

        <Card style={{ padding: '1.75rem', borderTop: '4px solid #ff9933' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
            Multi-Layer Due Diligence
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Assembling 10+ data layers—ownership, PostGIS cadastre, CERSAI bank mortgages, statutory Section 36A tribal restrictions, e-Courts litigation, and PMRDA zoning—for fraud-free land transactions.
          </p>
        </Card>

        <Card style={{ padding: '1.75rem', borderTop: '4px solid #138808' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🔄</div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
            Federated State Mesh
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Respecting state data sovereignty by integrating with Mahabhulekh, Bhoomi, Bhulekh UP, and Patta Chitta via configuration-driven state adapters without centralizing state land databases.
          </p>
        </Card>
      </div>

      {/* Key Architectural Principles */}
      <Card style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--ux4g-primary)', marginBottom: '1.25rem' }}>
          Core Architectural Principles
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', fontSize: '0.9rem' }}>
          <div style={{ borderLeft: '3px solid var(--ux4g-primary)', paddingLeft: '0.75rem' }}>
            <strong>1. Projections, Not Originals:</strong>
            <p style={{ color: 'var(--ux4g-text-secondary)', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
              State revenue systems remain the statutory source of truth. Land Stack serves high-performance bi-temporal projections.
            </p>
          </div>
          <div style={{ borderLeft: '3px solid #ff9933', paddingLeft: '0.75rem' }}>
            <strong>2. ISO 19152 LADM Compliant:</strong>
            <p style={{ color: 'var(--ux4g-text-secondary)', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
              Standardized spatial units, parties, and rights schema customized for Indian land administration.
            </p>
          </div>
          <div style={{ borderLeft: '3px solid #138808', paddingLeft: '0.75rem' }}>
            <strong>3. Trust Through Provenance:</strong>
            <p style={{ color: 'var(--ux4g-text-secondary)', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
              Every data element includes authoritative source attribution, retrieval timestamp, and SHA-256 cryptographic verification hashes.
            </p>
          </div>
          <div style={{ borderLeft: '3px solid var(--ux4g-info)', paddingLeft: '0.75rem' }}>
            <strong>4. Dual Experience Planes:</strong>
            <p style={{ color: 'var(--ux4g-text-secondary)', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
              Citizen Portal for public landholders alongside 7 specialized role workspaces for revenue officials.
            </p>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--ux4g-primary)', marginBottom: '0.75rem' }}>
          Explore Your Land Records Today
        </h3>
        <p style={{ color: 'var(--ux4g-text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Access digitally signed extracts, track active e-Ferfar mutations, or run a 360 title due diligence check.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/citizen/search">
            <Button variant="primary">Search Any Land Parcel →</Button>
          </Link>
          <Link to="/login/citizen">
            <Button variant="outline">Citizen Login (Aarav Patil) →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
