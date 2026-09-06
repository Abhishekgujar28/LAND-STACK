import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Shield,
  Layers,
  Award,
  Database,
  Calendar,
  CheckCircle2,
  Users,
  Building,
  Landmark,
  ArrowRight,
} from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * AboutPage - Comprehensive Institutional Profile
 * Mission/Vision, DoLR Mandate, Historical Milestones, and Governance Framework
 */
export const AboutPage = () => {
  const milestones = [
    {
      year: '2021',
      title: 'Rollout of Bhu-Aadhaar (ULPIN)',
      desc: 'DoLR introduced the 14-digit Unique Land Parcel Identification Number across pilot states to assign a unique geospatial identifier to every land parcel.',
      badge: 'Pilot Launch',
    },
    {
      year: '2023',
      title: '100+ Million Land Parcels Digitized',
      desc: 'Achieved 95% computerization of Record of Rights (RoRs) across 28 states and 8 UTs with digital cadastral map integration.',
      badge: 'Scale Milestone',
    },
    {
      year: '2025',
      title: 'Pan-India Federated Land Governance Mesh',
      desc: 'Integrated state land engines (Mahabhulekh, Bhoomi, Bhulekh UP, Patta Chitta) with central CERSAI, e-Courts, and Sub-Registrar registries.',
      badge: 'National Mesh',
    },
    {
      year: '2026–2031',
      title: 'Next-Gen Cadastral Intelligence (BharatBhumi)',
      desc: 'Full bi-temporal title projection, real-time e-Ferfar mutation reconciliation, and instant 360° due diligence for all citizens.',
      badge: 'Active Mandate',
    },
  ];

  return (
    <div className="page-about ux4g-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* 1. Header & Institutional Eyebrow */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcf2e8', color: '#0f4d3a', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 750, marginBottom: '0.6rem' }}>
          <span>🇮🇳</span>
          <span>ग्रामीण विकास मंत्रालय | Ministry of Rural Development, Government of India</span>
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontSize: '2.2rem', fontWeight: 850, color: '#0d382f', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          About BharatBhumi National Portal
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#526b63', maxWidth: '780px', margin: '0 auto', lineHeight: 1.55 }}>
          A parcel-centric federated Digital Public Infrastructure and governance intelligence platform connecting India’s state land administration systems into a unified citizen and government experience mesh.
        </p>
      </div>

      {/* 2. Mission & Vision Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Card
          style={{
            padding: '1.75rem',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            borderTop: '3.5px solid #1b4d3e',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#edf7f3', border: '1px solid #d1eade', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b4d3e' }}>
              <Target size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: '1.15rem', fontWeight: 800, color: '#0f2e24', margin: 0 }}>
                Our Statutory Mission
              </h2>
              <span style={{ fontSize: '0.74rem', color: '#0f4d3a', fontWeight: 700 }}>DILRMP 2.0 Mandate</span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
            To modernize, digitize, and interconnect India’s land administration ecosystem. We guarantee tamper-proof Record of Rights (RoR), transparent e-Ferfar mutation workflows, and instant access to certified geospatial cadastral maps for over 1.4 billion citizens.
          </p>
        </Card>

        <Card
          style={{
            padding: '1.75rem',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            borderTop: '3.5px solid #e65100',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fff7ed', border: '1px solid #ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e65100' }}>
              <Shield size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: '1.15rem', fontWeight: 800, color: '#0f2e24', margin: 0 }}>
                Our National Vision
              </h2>
              <span style={{ fontSize: '0.74rem', color: '#9a3412', fontWeight: 700 }}>Conclusive Land Titling</span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
            To transition India from presumptive titling to guaranteed conclusive land governance. By uniting survey boundaries, registration deeds, bank mortgages, and tribunal orders under a single Bhu-Aadhaar key, we eliminate land fraud and litigation.
          </p>
        </Card>
      </div>

      {/* 3. Organizational Context & Governance Mandate */}
      <Card
        style={{
          padding: '2rem',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <Landmark size={22} color="#1b4d3e" />
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#0f2e24', margin: 0 }}>
            Organizational Framework & Statutory Mandate
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          The <strong>Department of Land Resources (DoLR)</strong> under the <strong>Ministry of Rural Development, Government of India</strong> acts as the central policy-making and monitoring body for land governance modernization. While land administration is constitutionally a State subject (Seventh Schedule, State List Item 18), BharatBhumi establishes a consensus-driven federated data mesh that preserves state sovereignty while creating national interoperability.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <strong style={{ fontSize: '0.88rem', color: '#0f2e24', display: 'block', marginBottom: '0.25rem' }}>
              DoLR Central Command
            </strong>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              National policy formulation, DILRMP fund allocation, and inter-ministerial integration (CERSAI, e-Courts, MoRTH).
            </span>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <strong style={{ fontSize: '0.88rem', color: '#0f2e24', display: 'block', marginBottom: '0.25rem' }}>
              State Revenue PMUs
            </strong>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              State settlement commissioners and directors of land records driving district and tehsil ground verification.
            </span>
          </div>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <strong style={{ fontSize: '0.88rem', color: '#0f2e24', display: 'block', marginBottom: '0.25rem' }}>
              Survey of India & NIC
            </strong>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              High-precision drone mapping, CORS base network operations, and secure cloud public infrastructure.
            </span>
          </div>
        </div>
      </Card>

      {/* 4. National Milestones & Digitization Progress */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 0.35rem' }}>
            National Land Digitization Milestones
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            Track record of continuous advancement under the Digital India Land Records program.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {milestones.map((m, idx) => (
            <Card
              key={idx}
              style={{
                padding: '1.4rem',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1b4d3e' }}>{m.year}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: '#dcf2e8', color: '#0f4d3a' }}>
                    {m.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 0.45rem' }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  {m.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Trust Indicators & Call to Action */}
      <Card
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #075037 0%, #032b1e 100%)',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(7, 80, 55, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <h2 style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.35rem' }}>
            Empowering Citizens with Transparent Land Records
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
            Access your Record of Rights extract, verify parcel boundaries on GIS cadastral layers, or search legal title records anytime.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/services" style={{ textDecoration: 'none' }}>
            <button
              type="button"
              style={{
                background: '#e65100',
                border: 'none',
                color: '#ffffff',
                padding: '0.6rem 1.25rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 6px rgba(230, 81, 0, 0.3)',
              }}
            >
              <span>Explore All Services</span>
              <ArrowRight size={14} />
            </button>
          </Link>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button
              type="button"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                padding: '0.6rem 1.15rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Contact Nodal Office
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;
