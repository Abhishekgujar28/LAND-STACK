import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  Share2,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const IntegrationsPage = () => {
  const integrations = [
    {
      name: 'NGDRS (National Generic Document Registration)',
      type: 'Two-Way Webhook',
      status: 'HEALTHY',
      uptime: '99.98%',
      latency: '42ms',
      todayTx: '1,420 Deeds',
      desc: 'Automatic push of registered sale and conveyance deeds for Form 6 pencil entry generation.',
    },
    {
      name: 'Mahabhulekh (Maharashtra Land Records RoR)',
      type: 'REST + gRPC Adapter',
      status: 'HEALTHY',
      uptime: '99.85%',
      latency: '88ms',
      todayTx: '18,400 RoRs Synced',
      desc: 'Authoritative sync of certified 7/12 RoR khata extracts and Khatedar ownership records.',
    },
    {
      name: 'BhuNaksha (NIC National Cadastral GIS Engine)',
      type: 'WFS / Vector Tile Layer',
      status: 'HEALTHY',
      uptime: '99.72%',
      latency: '115ms',
      todayTx: '42,000 Tiles Streamed',
      desc: 'Cadastral Gat parcel polygon boundaries, subdivision lines, and FMB spatial maps.',
    },
    {
      name: 'e-Courts (National Judicial Data Grid NJDG)',
      type: 'Periodic Injunction Sync',
      status: 'HEALTHY',
      uptime: '99.40%',
      latency: '240ms',
      todayTx: '82 Injunction Alerts',
      desc: 'Realtime lookup of civil court stay orders and property disputes to halt restricted mutations.',
    },
    {
      name: 'DigiLocker & Aadhaar e-KYC (MeitY)',
      type: 'OAuth 2.0 PKCE',
      status: 'HEALTHY',
      uptime: '99.99%',
      latency: '34ms',
      todayTx: '9,200 Verifications',
      desc: 'Biometric & OTP based citizen identity authentication and digital delivery of signed 7/12 extracts.',
    },
    {
      name: 'PM GatiShakti (National Infrastructure Master Plan)',
      type: 'OGC API Features / GeoJSON',
      status: 'HEALTHY',
      uptime: '99.65%',
      latency: '130ms',
      todayTx: '350 Corridor Queries',
      desc: 'Multi-modal connectivity layer integration for NHAI, Railway, and State Highway land acquisition.',
    },
  ];

  return (
    <div className="page-integrations" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <Share2 size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              External Government Department Integrations & Adapters
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              National and State interoperability telemetry connecting NGDRS, Mahabhulekh, BhuNaksha, and e-Courts.
            </p>
          </div>
        </div>

        <Badge variant="secondary" style={{ backgroundColor: '#ea580c', color: '#ffffff', border: 'none' }}>
          6 / 6 ADAPTERS HEALTHY
        </Badge>
      </div>

      {/* Integrations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {integrations.map((item) => (
          <Card key={item.name} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#064e3b', fontWeight: 800 }}>
                  {item.name}
                </h3>
                <Badge variant="success">Active (200 OK)</Badge>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', marginBottom: '0.75rem' }}>
                Protocol: <strong>{item.type}</strong>
              </div>

              <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <div>
                <span style={{ color: 'var(--ux4g-text-muted)' }}>Uptime:</span>{' '}
                <strong style={{ color: '#16a34a' }}>{item.uptime}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--ux4g-text-muted)' }}>P95 Latency:</span>{' '}
                <strong>{item.latency}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--ux4g-text-muted)' }}>Today:</span>{' '}
                <strong>{item.todayTx}</strong>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
