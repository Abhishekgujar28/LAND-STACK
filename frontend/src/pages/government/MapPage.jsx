import React, { useState } from 'react';
import {
  Map,
  Compass,
  Layers,
  Filter,
  Search,
  Maximize2,
  ShieldCheck,
  Building,
  Landmark,
  UserCheck,
  Flag,
  CheckCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import AuthorityGisMap from '../../components/government/AuthorityGisMap';
import { ROLES } from '../../config/roles';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

/**
 * MapPage - Fullscreen GIS Cadastral Map Explorer
 * Supports switching between all 7 authority jurisdiction scopes:
 * - Talathi: Wagholi Village Cadastre + Survey Boundaries + Field Pins
 * - Tehsildar: Haveli Taluka (112 Villages) Boundary + e-Ferfar Mutation Hotspots
 * - SRO: Sub-District Registration Cadastre + Ready Reckoner Value Zones
 * - Collector: Pune District 14-Tehsil SLA Choropleth & Land Acquisition Corridors
 * - State PMU: Maharashtra 36-District ULPIN Heatmap
 * - National Monitor: Pan-India Bhu-Aadhaar Rollout Cadastre
 * - Admin: Cluster Infrastructure Spatial Mesh
 */
export const MapPage = () => {
  const [activeAuthorityRole, setActiveAuthorityRole] = useState(ROLES.TEHSILDAR);
  const [selectedUlpin, setSelectedUlpin] = useState('ULPIN-MH-PUN-000002');
  const [showFilters, setShowFilters] = useState(false);

  const authoritiesList = [
    { role: ROLES.TALATHI, label: 'Talathi (Village)', scope: 'Wagholi Village (Circle 04)' },
    { role: ROLES.TEHSILDAR, label: 'Tehsildar (Tehsil)', scope: 'Haveli Taluka (112 Villages)' },
    { role: ROLES.SRO, label: 'Sub-Registrar (SRO)', scope: 'Haveli-01 Registration Zone' },
    { role: ROLES.COLLECTOR, label: 'District Collector', scope: 'Pune District (14 Tehsils)' },
    { role: ROLES.STATE_PMU, label: 'State PMU', scope: 'Maharashtra (36 Districts)' },
    { role: ROLES.NATIONAL_MONITOR, label: 'National DoLR', scope: 'Pan-India (36 States/UTs)' },
    { role: ROLES.ADMIN, label: 'System Admin', scope: 'Martin Vector Tiles Node' },
  ];

  return (
    <div className="page-map-explorer" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(6, 78, 59, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef08a',
              }}
            >
              <Compass size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.4rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              Cadastral GIS Map & Geo-Spatial Explorer
            </h1>
            <Badge variant="secondary" style={{ backgroundColor: '#ea580c', color: '#ffffff', border: 'none' }}>
              BHUNAKSHA ENGINE
            </Badge>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
            Official multi-tier spatial cadastre viewer adhering to Survey of India (SoI) and DoLR DILRMP GIS standards.
          </p>
        </div>

        {/* Authority Scope Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Authority Perspective:</span>
          <select
            className="ux4g-select"
            value={activeAuthorityRole}
            onChange={(e) => setActiveAuthorityRole(e.target.value)}
            style={{
              height: '38px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {authoritiesList.map((auth) => (
              <option key={auth.role} value={auth.role} style={{ backgroundColor: '#064e3b', color: '#ffffff' }}>
                {auth.label} — {auth.scope}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Spatial Metrics Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <Card style={{ padding: '0.9rem 1.15rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', fontWeight: 600 }}>
            Active Spatial Jurisdiction
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ux4g-primary)', marginTop: '0.2rem' }}>
            {authoritiesList.find((a) => a.role === activeAuthorityRole)?.scope || 'Haveli Taluka'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-muted)', marginTop: '0.25rem' }}>
            CRS: EPSG:4326 &bull; WGS84 Datum
          </div>
        </Card>

        <Card style={{ padding: '0.9rem 1.15rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', fontWeight: 600 }}>
            Cadastral Digitization Rate
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>
            98.6%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-muted)', marginTop: '0.25rem' }}>
            110 of 112 villages vectorized
          </div>
        </Card>

        <Card style={{ padding: '0.9rem 1.15rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', fontWeight: 600 }}>
            Active Spatial Mutations
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ea580c', marginTop: '0.2rem' }}>
            24 Pending
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-muted)', marginTop: '0.25rem' }}>
            Form 6 pencil entries awaiting survey
          </div>
        </Card>

        <Card style={{ padding: '0.9rem 1.15rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)', fontWeight: 600 }}>
            Boundary Discrepancies
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
            3 Flagged
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-muted)', marginTop: '0.25rem' }}>
            e-Mojani joint measurement scheduled
          </div>
        </Card>
      </div>

      {/* Main Interactive Authority GIS Map */}
      <AuthorityGisMap
        authorityRole={activeAuthorityRole}
        activeJurisdiction={authoritiesList.find((a) => a.role === activeAuthorityRole)?.scope}
        height="660px"
        selectedUlpin={selectedUlpin}
        onSelectParcel={(plot) => setSelectedUlpin(plot.ulpin)}
      />

      {/* Quick Parcel Selector & BhuNaksha Quick Jump Strip */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--ux4g-primary)' }}>
              ⚡ Quick Spatial Parcel Inspector
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--ux4g-text-secondary)' }}>
              Jump straight to critical verified and disputed survey plots in Wagholi / Haveli:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { ulpin: 'ULPIN-MH-PUN-000001', label: 'Gat 42 (Aarav Patil - Clear)', status: 'success' },
              { ulpin: 'ULPIN-MH-PUN-000002', label: 'Gat 45 (Sunita Kulkarni - Pending)', status: 'warning' },
              { ulpin: 'ULPIN-MH-PUN-000003', label: 'Gat 88 (Priya Shinde - Disputed)', status: 'danger' },
              { ulpin: 'ULPIN-MH-PUN-000004', label: 'Gat 92 (Rajesh Gaikwad - Clear)', status: 'success' },
              { ulpin: 'ULPIN-MH-PUN-000005', label: 'Gat 104 (Ramesh Bhosale - Mutation)', status: 'warning' },
            ].map((p) => (
              <button
                key={p.ulpin}
                type="button"
                className={`ux4g-btn ux4g-btn-sm ${selectedUlpin === p.ulpin ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
                onClick={() => setSelectedUlpin(p.ulpin)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: selectedUlpin === p.ulpin ? 'var(--ux4g-primary)' : undefined,
                  color: selectedUlpin === p.ulpin ? '#ffffff' : undefined,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MapPage;
