import React, { useState } from 'react';
import tehsildarQueueData from '../../data/mutations/tehsildarQueue.json';
import talathiQueueData from '../../data/mutations/talathiQueue.json';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SLAIndicator from '../../components/government/SLAIndicator';
import {
  FileCode,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scale,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MutationManagementPage = () => {
  const [activeStage, setActiveStage] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const mutations = [
    ...tehsildarQueueData.map((m) => ({ ...m, currentStage: 'TEHSILDAR_BENCH', stageLabel: 'Stage 3: Statutory Decision' })),
    ...talathiQueueData.map((m) => ({ ...m, currentStage: 'FIELD_VERIFICATION', stageLabel: 'Stage 2: Talathi Inspection' })),
  ];

  const filtered = mutations.filter((m) => {
    if (activeStage === 'TALATHI' && m.currentStage !== 'FIELD_VERIFICATION') return false;
    if (activeStage === 'TEHSILDAR' && m.currentStage !== 'TEHSILDAR_BENCH') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.id?.toLowerCase().includes(q) ||
        m.gatNumber?.toLowerCase().includes(q) ||
        m.village?.toLowerCase().includes(q) ||
        m.applicant?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="page-mutation-management" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <Scale size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              e-Ferfar Mutation Lifecycle & Statutory Workflow
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              End-to-end statutory mutation tracking under Sections 148-154 of the Maharashtra Land Revenue Code 1966.
            </p>
          </div>
        </div>

        <Badge variant="secondary" style={{ backgroundColor: '#ea580c', color: '#ffffff', border: 'none' }}>
          {filtered.length} ACTIVE MUTATIONS
        </Badge>
      </div>

      {/* 4-Stage Lifecycle Stepper */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          STATUTORY MUTATION PIPELINE (E-FERFAR)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', fontWeight: 700 }}>STAGE 1</div>
            <div style={{ fontWeight: 800, color: '#064e3b', fontSize: '0.95rem', margin: '0.2rem 0' }}>NGDRS Registration</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>Deed executed & webhook emitted &rarr; Form 6 pencil entry created</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', fontWeight: 700 }}>STAGE 2</div>
            <div style={{ fontWeight: 800, color: '#064e3b', fontSize: '0.95rem', margin: '0.2rem 0' }}>Talathi Field Panchnama</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>135D notice served &bull; GPS photo & possession verification</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', fontWeight: 700 }}>STAGE 3</div>
            <div style={{ fontWeight: 800, color: '#064e3b', fontSize: '0.95rem', margin: '0.2rem 0' }}>Tehsildar Statutory Order</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>Hearing / objection determination &bull; Class-3 DSC digital sign</div>
          </div>

          <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>STAGE 4</div>
            <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem', margin: '0.2rem 0' }}>Certified RoR 7/12</div>
            <div style={{ fontSize: '0.75rem', color: '#166534' }}>Digital RoR updated & push notification to Khatedar DigiLocker</div>
          </div>
        </div>
      </Card>

      {/* Filters & Search */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeStage === 'ALL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveStage('ALL')}
              style={{ backgroundColor: activeStage === 'ALL' ? '#064e3b' : undefined }}
            >
              All Stages ({mutations.length})
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeStage === 'TALATHI' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveStage('TALATHI')}
              style={{ backgroundColor: activeStage === 'TALATHI' ? '#064e3b' : undefined }}
            >
              Stage 2: Talathi Inspection
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeStage === 'TEHSILDAR' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveStage('TEHSILDAR')}
              style={{ backgroundColor: activeStage === 'TEHSILDAR' ? '#064e3b' : undefined }}
            >
              Stage 3: Tehsildar Order Bench
            </button>
          </div>

          <input
            type="text"
            className="ux4g-input"
            placeholder="Search Mutation ID, Gat, Applicant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '280px', height: '34px' }}
          />
        </div>
      </Card>

      {/* Mutations Table */}
      <Card>
        <div className="ux4g-table-wrapper">
          <table className="ux4g-table">
            <thead>
              <tr>
                <th>Mutation ID</th>
                <th>Target Parcel / Village</th>
                <th>Transaction Type</th>
                <th>Transferee Applicant</th>
                <th>Current Statutory Stage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <code style={{ fontWeight: 800, color: '#064e3b' }}>{item.id}</code>
                  </td>
                  <td>
                    <strong>{item.gatNumber}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{item.village}</div>
                  </td>
                  <td>{item.type}</td>
                  <td>
                    <strong>{item.applicant}</strong>
                  </td>
                  <td>
                    <Badge variant={item.currentStage === 'TEHSILDAR_BENCH' ? 'primary' : 'warning'} style={{ backgroundColor: item.currentStage === 'TEHSILDAR_BENCH' ? '#064e3b' : undefined }}>
                      {item.stageLabel}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={item.status.includes('READY') ? 'success' : item.status.includes('DISCREPANCY') ? 'danger' : 'neutral'}>
                      {item.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td>
                    <Link
                      to={item.currentStage === 'TEHSILDAR_BENCH' ? '/government/tehsildar' : '/government/talathi'}
                      className="ux4g-btn ux4g-btn-sm ux4g-btn-outline"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <span>View Dossier</span>
                      <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MutationManagementPage;
