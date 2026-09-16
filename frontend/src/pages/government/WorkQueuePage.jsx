import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import SLAIndicator from '../../components/government/SLAIndicator';
import mutationService from '../../services/mutationService';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  ArrowRight,
  UserCheck,
  Building,
  FileCheck,
  ListTodo,
} from 'lucide-react';

export const WorkQueuePage = () => {
  const { role } = useAuth();
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    mutationService.getOfficerQueue()
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : (data?.data || []);
        const formatted = list.map((item) => ({
          id: item.id || item.mutation_number || 'CASE-001',
          mutationNumber: item.mutation_number || item.id,
          gatNumber: item.gat_number || item.gatNumber || item.survey_number || 'Gat 42',
          village: item.village_name || item.village || 'Wagholi',
          type: item.mutation_type || item.type || 'Sale Deed Mutation',
          applicant: item.applicant_name || item.applicant || 'Applicant',
          status: item.status || 'PENDING',
          daysPending: item.days_pending || 3,
          daysLeft: item.days_left != null ? item.days_left : 12,
          slaTargetDays: item.sla_target_days || 15,
          roleCategory: item.required_role || (item.status === 'PENDING' ? 'TALATHI' : 'TEHSILDAR'),
          authority: item.assigned_to || (item.status === 'PENDING' ? 'Talathi Field Inspection' : 'Tehsildar Statutory Bench'),
        }));
        setTasks(formatted);
      })
      .catch((err) => {
        console.warn('Failed to load work queue from API:', err.message);
        if (isMounted) setErrorMsg(err.message || 'Unable to load work queue.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const filtered = tasks.filter((task) => {
    if (filterType === 'TALATHI' && task.roleCategory !== 'TALATHI') return false;
    if (filterType === 'TEHSILDAR' && task.roleCategory !== 'TEHSILDAR') return false;
    if (filterType === 'URGENT' && task.daysLeft > 3) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        task.id?.toLowerCase().includes(q) ||
        task.gatNumber?.toLowerCase().includes(q) ||
        task.village?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="page-work-queue" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <ListTodo size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Officer Work Queue &amp; Statutory Action Items
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Consolidated revenue administration case tasks sorted by Maharashtra Land Revenue Code statutory SLAs.
            </p>
          </div>
        </div>

        <Badge variant="secondary" style={{ backgroundColor: '#ea580c', color: '#ffffff', border: 'none' }}>
          {filtered.length} ACTIVE ITEMS
        </Badge>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem' }}>
          <strong>Notice:</strong> {errorMsg}
        </div>
      )}

      {/* Filters & Search */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`ux4g-btn ux4g-btn-sm ${filterType === 'ALL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setFilterType('ALL')}
              style={{ backgroundColor: filterType === 'ALL' ? '#064e3b' : undefined }}
            >
              All Items ({tasks.length})
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${filterType === 'TALATHI' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setFilterType('TALATHI')}
              style={{ backgroundColor: filterType === 'TALATHI' ? '#064e3b' : undefined }}
            >
              Talathi Verification
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${filterType === 'TEHSILDAR' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setFilterType('TEHSILDAR')}
              style={{ backgroundColor: filterType === 'TEHSILDAR' ? '#064e3b' : undefined }}
            >
              Tehsildar Orders
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${filterType === 'URGENT' ? 'ux4g-btn-danger' : 'ux4g-btn-outline'}`}
              onClick={() => setFilterType('URGENT')}
            >
              🔴 Approaching SLA (&le; 3 Days)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              className="ux4g-input"
              placeholder="Filter by Gat, Village, Case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '240px', height: '34px' }}
            />
          </div>
        </div>
      </Card>

      {/* Task List Table */}
      <Card>
        <div className="ux4g-table-wrapper">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Loading official work queue from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '1rem' }}>No pending tasks in your work queue</p>
              <span style={{ fontSize: '0.85rem' }}>All revenue administration mutations in your jurisdiction have been processed within SLA targets.</span>
            </div>
          ) : (
            <table className="ux4g-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Target Parcel / Village</th>
                  <th>Authority Queue</th>
                  <th>Type of Action</th>
                  <th>SLA Countdown</th>
                  <th>Status</th>
                  <th>Launch Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td><code>{item.id}</code></td>
                    <td>
                      <strong>{item.gatNumber}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{item.village}</div>
                    </td>
                    <td>
                      <Badge variant={item.roleCategory === 'TEHSILDAR' ? 'primary' : 'neutral'} style={{ backgroundColor: item.roleCategory === 'TEHSILDAR' ? '#064e3b' : undefined }}>
                        {item.authority}
                      </Badge>
                    </td>
                    <td>{item.type}</td>
                    <td>
                      <SLAIndicator daysRemaining={Math.max(1, item.daysLeft || 5)} maxDays={15} />
                    </td>
                    <td>
                      <Badge variant={item.status.includes('REJECT') ? 'danger' : item.status.includes('RECOMMEND') ? 'success' : 'warning'}>
                        {item.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td>
                      <Link
                        to={item.roleCategory === 'TEHSILDAR' ? '/government/tehsildar' : '/government/talathi'}
                        className="ux4g-btn ux4g-btn-sm ux4g-btn-primary"
                        style={{ backgroundColor: '#064e3b', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <span>Process</span>
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

export default WorkQueuePage;
