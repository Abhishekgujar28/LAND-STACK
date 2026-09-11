import React from 'react';
import analyticsService from '../../../services/analyticsService';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import {
  Activity,
  Server,
  Cpu,
  HardDrive,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SystemHealthPage = () => {
  return (
    <div className="page-system-health" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <Activity size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Platform Infrastructure & Cluster Telemetry
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              NIC Cloud Kubernetes cluster, PostGIS database replicas, Kafka event pipelines, and Martin vector tiles.
            </p>
          </div>
        </div>

        <Link to="/government/admin" className="ux4g-btn ux4g-btn-sm" style={{ backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700 }}>
          &larr; Return to Admin Console
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', fontWeight: 700 }}>KUBERNETES PODS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#064e3b', margin: '0.25rem 0' }}>
            {adminSystemData.healthyPods} / {adminSystemData.totalPods}
          </div>
          <Badge variant="success">All Pods Healthy</Badge>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', fontWeight: 700 }}>KAFKA EVENT LAG</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '0.25rem 0' }}>
            {adminSystemData.kafkaConsumerLag}
          </div>
          <Badge variant="success">Realtime Event Bus</Badge>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', fontWeight: 700 }}>DEAD-LETTER QUEUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#064e3b', margin: '0.25rem 0' }}>
            {adminSystemData.deadLetterQueueDepth} Events
          </div>
          <Badge variant="success">Zero Failed Payloads</Badge>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', fontWeight: 700 }}>OPA POLICY VERSION</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b', margin: '0.4rem 0' }}>
            {adminSystemData.opaPolicyVersion}
          </div>
          <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>Enforced</Badge>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealthPage;
