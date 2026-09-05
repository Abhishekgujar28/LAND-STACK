import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const GOV_ROLES_LIST = [
  {
    role: ROLES.TALATHI,
    title: 'Talathi / Patwari',
    vernacular: 'तलाठी / पटवारी',
    designation: 'Village Revenue Officer',
    department: 'Revenue & Land Records',
    jurisdiction: 'Wagholi Circle, Haveli Tehsil, Pune',
    sampleOfficer: 'Prakash Shinde',
    icon: '👤',
    color: '#0b3c5d',
    badgeText: 'Field Verifications',
    route: '/government/talathi',
    description: 'Ground-level field inspections, Form 6 pencil entries, geotagged site photo capture, possession verification, and structured recommendations to Tehsildar.',
  },
  {
    role: ROLES.TEHSILDAR,
    title: 'Tehsildar & Executive Magistrate',
    vernacular: 'तहसीलदार',
    designation: 'Primary Statutory Authority',
    department: 'Revenue & Land Records',
    jurisdiction: 'Haveli Taluka, Pune District',
    sampleOfficer: 'Sanjay Deshmukh',
    icon: '⚖️',
    color: '#dc2626',
    badgeText: 'Statutory Sanction',
    route: '/government/tehsildar',
    description: 'Statutory sanction or rejection of e-Ferfar mutation orders, RTS revenue court hearings, clarification directives, and AI risk advisory overrides.',
  },
  {
    role: ROLES.SRO,
    title: 'Sub-Registrar Officer (SRO)',
    vernacular: 'दुय्यम निबंधक',
    designation: 'Registration Authority (Registration Act 1908)',
    department: 'Registration & Stamps',
    jurisdiction: 'Sub-Registrar Office Haveli No 5, Pune',
    sampleOfficer: 'Rekha Joshi',
    icon: '🏛️',
    color: '#7c3aed',
    badgeText: 'Deed Audits & NGDRS',
    route: '/government/registration',
    description: 'Pre-registration instant ULPIN title audit, encumbrance verification, court stay check, and NGDRS deed execution webhook synchronization.',
  },
  {
    role: ROLES.COLLECTOR,
    title: 'District Collector & DM',
    vernacular: 'जिल्हाधिकारी',
    designation: 'District Administrative Authority',
    department: 'District Administration',
    jurisdiction: 'Pune District (14 Tehsils)',
    sampleOfficer: 'Dr. Suhas Diwase, IAS',
    icon: '🏢',
    color: '#0369a1',
    badgeText: 'District Cockpit',
    route: '/government/district',
    description: 'District command cockpit, 14 tehsils SLA compliance choropleth, inter-tehsil dispute escalations, Section 36A approvals, and officer reallocation.',
  },
  {
    role: ROLES.STATE_PMU,
    title: 'State PMU Head',
    vernacular: 'राज्य प्रकल्प नियंत्रण कक्ष',
    designation: 'State Nodal Officer',
    department: 'Settlement Commissionerate',
    jurisdiction: 'State of Maharashtra (36 Districts)',
    sampleOfficer: 'Anil Verma',
    icon: '📈',
    color: '#15803d',
    badgeText: 'DILRMP Progress',
    route: '/government/state',
    description: 'Statewide cadastral digitization milestones, RoR-Map linkage rate, Mahabhulekh/NGDRS adapter uptime grid, and AI State Executive Briefings.',
  },
  {
    role: ROLES.NATIONAL_MONITOR,
    title: 'DoLR National Monitor',
    vernacular: 'राष्ट्रीय भूमी अभिलेख',
    designation: 'Central Ministry Oversight Officer',
    department: 'Ministry of Rural Development',
    jurisdiction: 'National (36 States & Union Territories)',
    sampleOfficer: 'Meera Sengupta',
    icon: '🇮🇳',
    color: '#ea580c',
    badgeText: 'National Benchmarks',
    route: '/government/national',
    description: 'Department of Land Resources (DoLR) national benchmarks, 40+ Cr Bhu-Aadhaar (ULPIN) assignment, GoRT cross-state terminology, and Parliamentary MIS.',
  },
  {
    role: ROLES.ADMIN,
    title: 'System & Security Admin',
    vernacular: 'प्रणाली प्रशासक',
    designation: 'Platform Operations Administrator',
    department: 'NIC Land Records Division',
    jurisdiction: 'Platform-wide / Multi-AZ Cluster',
    sampleOfficer: 'Manoj Tiwari',
    icon: '⚙️',
    color: '#334155',
    badgeText: 'Cluster & Security',
    route: '/government/admin',
    description: 'Kubernetes cluster & pod health, OPA Rego policy deployment, state_config schema updates, cryptographic hash-chain audit log integrity, and DLQ replay.',
  },
];

export const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { loginAsOfficer, loginAsCitizen } = useAuth();

  const handleSelectGovRole = (item) => {
    loginAsOfficer(item.role);
    navigate(item.route);
  };

  const handleSelectCitizen = () => {
    loginAsCitizen('CIT-001');
    navigate('/citizen/dashboard');
  };

  return (
    <div className="page-role-selection ux4g-container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ux4g-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Government of India / National Land Stack Portal
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
          Select Authorized Portal Role
        </h1>
        <p style={{ color: 'var(--ux4g-text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '0.95rem' }}>
          Land Stack implements strict role-based access control (RBAC) across the Citizen Plane and the 7 Government Department Administrative Planes.
        </p>
      </div>

      {/* Citizen Plane Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--ux4g-radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2.2rem', background: '#ffffff', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--ux4g-shadow-sm)' }}>
            🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ux4g-primary)' }}>
                Citizen / Landholder Plane
              </h2>
              <Badge variant="success">PUBLIC / CITIZEN</Badge>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.2rem' }}>
              Access personal land parcels, certified 7/12 RoR extracts, apply for e-Ferfar mutation, track applications & due diligence.
            </div>
          </div>
        </div>

        <Button variant="primary" size="md" onClick={handleSelectCitizen}>
          Login as Citizen (Aarav Patil) →
        </Button>
      </div>

      {/* Government Plane Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--ux4g-primary)' }}>
            🏛️ Government Operations Plane (7 Roles)
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
            Task-first administrative workspaces tailored to official statutory competence and geographic jurisdiction
          </div>
        </div>
        <Badge variant="warning">7 Authorized Workspaces</Badge>
      </div>

      {/* 7 Government Roles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {GOV_ROLES_LIST.map((item) => (
          <Card
            key={item.role}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `4px solid ${item.color}`,
              transition: 'transform var(--ux4g-transition-fast), box-shadow var(--ux4g-transition-fast)',
            }}
          >
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `${item.color}15`,
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--ux4g-primary)' }}>
                      {item.title}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                      {item.vernacular} • {item.designation}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <Badge variant="primary" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>
                  {item.badgeText}
                </Badge>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginBottom: '1rem', minHeight: '52px', lineHeight: 1.5 }}>
                {item.description}
              </p>

              <div
                style={{
                  background: 'var(--ux4g-surface-muted)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--ux4g-radius-sm)',
                  fontSize: '0.78rem',
                  color: 'var(--ux4g-text)',
                  marginBottom: '1rem',
                }}
              >
                <div><strong>Sample Officer:</strong> {item.sampleOfficer}</div>
                <div><strong>Jurisdiction:</strong> {item.jurisdiction}</div>
              </div>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--ux4g-border-subtle)', background: '#fafbfc' }}>
              <Button
                variant="primary"
                size="sm"
                style={{ width: '100%', background: item.color, borderColor: item.color }}
                onClick={() => handleSelectGovRole(item)}
              >
                Login as {item.title.split('/')[0]} →
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleSelectionPage;
