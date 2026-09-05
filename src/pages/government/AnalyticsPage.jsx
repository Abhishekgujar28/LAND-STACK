import React from 'react';
import KPIStat from '../../components/government/KPIStat';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

export const AnalyticsPage = () => {
  return (
    <div className="page-analytics" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            <BarChart3 size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Land Governance MIS & Operational Analytics
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Multi-echelon spatial analytics, SLA adherence telemetry, and mutation velocity metrics.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
            <Download size={14} style={{ marginRight: '4px' }} />
            Download Excel MIS
          </Button>
          <Button variant="primary" size="sm" style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}>
            Generate Executive PDF
          </Button>
        </div>
      </div>

      {/* Analytics KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <KPIStat
          title="Avg Mutation Turnaround"
          value="16.4 Days"
          subtitle="Target: 21 Days (NLRMP Standard)"
          icon="⏱️"
          status="success"
        />
        <KPIStat
          title="Cadastral Coverage Rate"
          value="98.2%"
          subtitle="43,210 of 44,000 villages vectorized"
          icon="🗺️"
          status="success"
        />
        <KPIStat
          title="Citizen Satisfaction Index"
          value="4.6 / 5.0"
          subtitle="Based on 124,000 post-mutation ratings"
          icon="⭐"
          status="normal"
        />
        <KPIStat
          title="Active Revenue Court Cases"
          value="1,420"
          subtitle="Across 358 Tehsil Executive Courts"
          icon="⚖️"
          status="warning"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {/* Mutation Velocity Breakdown */}
        <Card style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', margin: '0 0 1rem', color: '#064e3b', fontWeight: 800 }}>
            📈 12-Month Mutation Resolution Velocity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { month: 'Sep 2026', total: 4210, cleared: 3950, rate: '93.8%' },
              { month: 'Aug 2026', total: 4050, cleared: 3820, rate: '94.3%' },
              { month: 'Jul 2026', total: 3890, cleared: 3610, rate: '92.8%' },
              { month: 'Jun 2026', total: 3740, cleared: 3420, rate: '91.4%' },
            ].map((m) => (
              <div key={m.month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <div>
                  <strong>{m.month}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{m.cleared} cleared of {m.total} registered</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge variant="success">{m.rate} SLA</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Division Cadastral Saturation */}
        <Card style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', margin: '0 0 1rem', color: '#064e3b', fontWeight: 800 }}>
            🌐 Cadastral BhuNaksha Vectorization by Division
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { div: 'Pune Division', cov: 98.6, villages: '7,120 / 7,220' },
              { div: 'Konkan Division', cov: 97.4, villages: '5,840 / 6,000' },
              { div: 'Nashik Division', cov: 96.8, villages: '6,920 / 7,150' },
              { div: 'Nagpur Division', cov: 95.1, villages: '7,800 / 8,200' },
            ].map((d) => (
              <div key={d.div}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <strong>{d.div}</strong>
                  <span style={{ fontWeight: 800, color: '#064e3b' }}>{d.cov}% ({d.villages})</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${d.cov}%`, height: '100%', backgroundColor: '#064e3b', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
