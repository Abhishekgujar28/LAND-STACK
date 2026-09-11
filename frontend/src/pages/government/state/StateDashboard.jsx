import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import analyticsService from '../../../services/analyticsService';
import KPIStat from '../../../components/government/KPIStat';
import AuthorityGisMap from '../../../components/government/AuthorityGisMap';
import { ROLES } from '../../../config/roles';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { statePMUData, districtRankingsData } from '../../../data/mockDataFallbacks';
import {
  Landmark,
  Layers,
  Cpu,
  BrainCircuit,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
} from 'lucide-react';

export const StateDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('TELEMETRY'); // 'TELEMETRY' | 'GIS_MAP' | 'ADAPTERS' | 'AI_BRIEF'

  return (
    <div className="page-state-dashboard" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* State PMU Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #033628 50%, #022319 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(6, 78, 59, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef08a',
              }}
            >
              <Landmark size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              State PMU Command Center — {statePMUData.stateName}
            </h1>
            <span
              style={{
                background: '#ea580c',
                color: '#ffffff',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              STATE NODAL PMU
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span><strong>Nodal Officer:</strong> {user?.name || 'Anil Verma'}</span>
            <span><strong>Department:</strong> {statePMUData.nodalDepartment}</span>
            <span><strong>Scope:</strong> {statePMUData.totalDistricts} Districts, {statePMUData.totalTehsils} Tehsils</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
            <FileSpreadsheet size={14} style={{ marginRight: '4px' }} />
            State DILRMP Report
          </Button>
          <Button variant="primary" size="sm" style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}>
            Sync 36 Districts Feeds
          </Button>
        </div>
      </div>

      {/* Statewide DILRMP KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <KPIStat
          title="Cadastral Digitization"
          value={statePMUData.cadastralDigitizationRate}
          subtitle={`${statePMUData.vectorizedVillages} of ${statePMUData.totalVillages} villages vectorized`}
          icon="🗺️"
          status="success"
        />
        <KPIStat
          title="RoR-Map Spatial Linkage"
          value={statePMUData.rorMapLinkageRate}
          subtitle="ULPIN seeded on 7/12 records"
          icon="🔗"
          status="success"
        />
        <KPIStat
          title="Statewide Mutation Backlog"
          value={statePMUData.statewideMutationBacklog.toLocaleString()}
          subtitle={`${statePMUData.monthlyReductionRate} reduction this month`}
          icon="📉"
          status="normal"
        />
        <KPIStat
          title="State Adapter API Uptime"
          value="99.4%"
          subtitle="Mahabhulekh, NGDRS, e-Mojani"
          icon="⚡"
          status="success"
        />
      </div>

      {/* Mode Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('TELEMETRY')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'TELEMETRY' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'TELEMETRY' ? '#064e3b' : undefined,
            borderColor: activeTab === 'TELEMETRY' ? '#064e3b' : undefined,
            color: activeTab === 'TELEMETRY' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Activity size={15} />
          <span>Statewide DILRMP Performance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('GIS_MAP')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'GIS_MAP' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'GIS_MAP' ? '#064e3b' : undefined,
            borderColor: activeTab === 'GIS_MAP' ? '#064e3b' : undefined,
            color: activeTab === 'GIS_MAP' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Layers size={15} />
          <span>Maharashtra 36-District GIS Saturation Map</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ADAPTERS')}
          className={`ux4g-btn ux4g-btn-sm ${activeTab === 'ADAPTERS' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
          style={{
            backgroundColor: activeTab === 'ADAPTERS' ? '#064e3b' : undefined,
            borderColor: activeTab === 'ADAPTERS' ? '#064e3b' : undefined,
            color: activeTab === 'ADAPTERS' ? '#ffffff' : undefined,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Cpu size={15} />
          <span>State Department Adapters Health Grid</span>
        </button>
      </div>

      {/* TAB 1: TELEMETRY & AI BRIEF */}
      {activeTab === 'TELEMETRY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI State Executive Brief */}
          <Card>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BrainCircuit size={20} color="#064e3b" />
                <h2 style={{ fontSize: '1.05rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
                  AI Land Governance Executive Brief (Statewide Synthesis)
                </h2>
              </div>
              <Badge variant="warning">ADVISORY &bull; Confidence {statePMUData.confidenceScore}</Badge>
            </div>
            <div style={{ padding: '1.25rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <p style={{ margin: 0, color: 'var(--ux4g-text)' }}>
                "{statePMUData.executiveBrief}"
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                Generated by <code>{statePMUData.briefModel}</code> &bull; Audited against OPA Rego policies.
              </div>
            </div>
          </Card>

          {/* Quick Metrics Breakdown */}
          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#064e3b', fontWeight: 800 }}>
              DILRMP Component Progress Across 6 Administrative Divisions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { div: 'Pune Division', cov: '94.8%', status: 'Leader' },
                { div: 'Konkan Division', cov: '91.2%', status: 'On Track' },
                { div: 'Nashik Division', cov: '88.6%', status: 'On Track' },
                { div: 'Chhatrapati Sambhajinagar', cov: '85.4%', status: 'Improving' },
                { div: 'Amravati Division', cov: '82.1%', status: 'Attention' },
                { div: 'Nagpur Division', cov: '86.5%', status: 'On Track' },
              ].map((d) => (
                <div key={d.div} style={{ border: '1px solid #e2e8f0', padding: '0.85rem', borderRadius: '8px', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{d.div}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#064e3b', margin: '0.2rem 0' }}>{d.cov}</div>
                  <Badge variant={d.status === 'Leader' ? 'success' : d.status === 'On Track' ? 'info' : 'warning'}>
                    {d.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: STATE GIS SATURATION MAP */}
      {activeTab === 'GIS_MAP' && (
        <Card style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
                Maharashtra Statewide DILRMP Cadastral Saturation GIS Map
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Vectorized cadastre across all 36 Districts with ULPIN linkage rate and active spatial telemetry.
              </p>
            </div>
            <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>
              36 Districts
            </Badge>
          </div>

          <AuthorityGisMap
            authorityRole={ROLES.STATE_PMU}
            activeJurisdiction="Maharashtra State"
            height="620px"
          />
        </Card>
      )}

      {/* TAB 3: ADAPTERS HEALTH */}
      {activeTab === 'ADAPTERS' && (
        <Card>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc' }}>
            <h2 style={{ fontSize: '1.05rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
              🔌 State Department Adapter APIs Health & Circuit Breakers
            </h2>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {statePMUData.adapterHealth.map((adapter) => (
                <div key={adapter.name} style={{ border: '1px solid var(--ux4g-border-subtle)', borderRadius: '10px', padding: '1rem', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{adapter.name}</strong>
                    <Badge variant="success">{adapter.uptime}</Badge>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)', marginTop: '0.35rem' }}>
                    P95 Latency: {adapter.p95Latency}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-success)', marginTop: '0.2rem', fontWeight: 600 }}>
                    Circuit Breaker: {adapter.circuitBreaker}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StateDashboard;
