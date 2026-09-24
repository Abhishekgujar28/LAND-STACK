import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import SLAIndicator from '../../components/government/SLAIndicator';
import mutationService from '../../services/mutationService';
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  FileText,
  UserCheck,
  Search,
  Filter,
  Eye,
  Check,
  X,
} from 'lucide-react';

export const MutationManagementPage = () => {
  const [activeStage, setActiveStage] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [mutations, setMutations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    mutationService.getMutations()
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : (data?.data || []);
        const formatted = list.map((m) => ({
          id: m.id || m.mutation_number || 'MUT-001',
          mutationNumber: m.mutation_number || m.id,
          type: m.mutation_type || m.type || 'Sale Deed Mutation',
          gatNumber: m.gat_number || m.gatNumber || m.survey_number || 'Gat 42',
          village: m.village_name || m.village || 'Wagholi',
          applicant: m.applicant_name || m.applicant || 'Landholder',
          date: m.created_at ? new Date(m.created_at).toLocaleDateString('en-IN') : '2026-09-01',
          daysPending: m.days_pending || 3,
          status: m.status || 'PENDING',
          currentStage: m.status === 'PENDING' ? 'FIELD_VERIFICATION' : 'TEHSILDAR_BENCH',
          stageLabel: m.status === 'PENDING' ? 'Stage 2: Talathi Inspection' : 'Stage 3: Statutory Decision',
        }));
        setMutations(formatted);
      })
      .catch((err) => {
        console.warn('Failed to load mutations from API:', err.message);
        if (isMounted) setErrorMsg(err.message || 'Unable to load mutations.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

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
            <GitPullRequest size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              e-Ferfar Statutory Mutation Lifecycle Registry
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Statutory 6-stage mutation processing pipeline under Maharashtra Land Revenue Code (MLRC) 1966 Section 149/150.
            </p>
          </div>
        </div>

        <Badge variant="secondary" style={{ backgroundColor: '#ea580c', color: '#ffffff', border: 'none' }}>
          {filtered.length} ACTIVE MUTATIONS
        </Badge>
      </div>

      {errorMsg && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem' }}>
          <strong>Notice:</strong> {errorMsg}
        </div>
      )}

      {/* Stage Filters */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeStage === 'ALL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveStage('ALL')}
              style={{ backgroundColor: activeStage === 'ALL' ? '#064e3b' : undefined }}
            >
              All Pipelines ({mutations.length})
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeStage === 'TALATHI' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveStage('TALATHI')}
              style={{ backgroundColor: activeStage === 'TALATHI' ? '#064e3b' : undefined }}
            >
              Talathi Verification
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeStage === 'TEHSILDAR' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveStage('TEHSILDAR')}
              style={{ backgroundColor: activeStage === 'TEHSILDAR' ? '#064e3b' : undefined }}
            >
              Tehsildar Hearing
            </button>
          </div>

          <input
            type="text"
            className="ux4g-input"
            placeholder="Search Ferfar No, Gat, Applicant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '280px', height: '34px' }}
          />
        </div>
      </Card>

      {/* Mutation Pipeline Table */}
      <Card>
        <div className="ux4g-table-wrapper">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Loading statutory mutation lifecycle from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '1rem' }}>No mutations found</p>
              <span style={{ fontSize: '0.85rem' }}>No mutation pipeline records matched the selected filter in your jurisdiction.</span>
            </div>
          ) : (
            <table className="ux4g-table">
              <thead>
                <tr>
                  <th>Ferfar Case ID</th>
                  <th>Type &amp; Parcel</th>
                  <th>Applicant Name</th>
                  <th>Statutory Stage</th>
                  <th>SLA Days</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <code>{item.mutationNumber || item.id}</code>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-muted)' }}>{item.date}</div>
                    </td>
                    <td>
                      <strong>{item.type}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{item.gatNumber}, {item.village}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.applicant}</div>
                    </td>
                    <td>
                      <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>
                        {item.stageLabel}
                      </Badge>
                    </td>
                    <td>
                      <SLAIndicator daysRemaining={Math.max(1, 15 - item.daysPending)} maxDays={15} />
                    </td>
                    <td>
                      <Badge variant={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'danger' : 'warning'}>
                        {item.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td>
                      <Link
                        to={item.currentStage === 'TEHSILDAR_BENCH' ? '/government/tehsildar' : '/government/talathi'}
                        className="ux4g-btn ux4g-btn-sm ux4g-btn-primary"
                        style={{ backgroundColor: '#064e3b', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <span>Audit</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MutationManagementPage;
