import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import CaseDossierModal from '../../components/government/CaseDossierModal';
import mutationService from '../../services/mutationService';
import {
  Gavel,
  Calendar,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building,
  Eye,
  ArrowRight,
} from 'lucide-react';

export const CasesPage = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [casesList, setCasesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const fetchCases = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await mutationService.getOfficerQueue();
      const items = res?.items || (Array.isArray(res) ? res : res?.data?.items || []);

      const formatted = items.map((item) => {
        const isUrgent = (item.daysLeft ?? item.slaDaysLeft ?? 15) <= 5;
        const isDispute = item.status === 'OBJECTION_RECEIVED' || item.status === 'DISPUTED';

        return {
          id: item.id || item.mutationNumber,
          mutationNumber: item.mutationNumber || item.id,
          bench: item.requiredRole === 'COLLECTOR' ? 'District Collector Revenue Bench, Pune' : 'Tehsildar Revenue Court, Haveli',
          parties: item.seller
            ? `${item.applicant || item.buyer || 'Applicant'} vs. ${item.seller}`
            : `${item.applicant || 'Applicant'} vs. State of Maharashtra`,
          gat: item.gatNumber || (item.ulpin ? `Gat ${item.ulpin.slice(-2)}` : 'Gat 42'),
          village: item.village || 'Wagholi',
          section: item.isUrban ? 'Section 44 MLR Code / PMC Regulations' : 'Section 149/150 MLR Code',
          disputeType: item.type || 'Statutory Title Mutation & Verification Proceeding',
          hearingDate: isUrgent ? 'Urgent SLA (Hearing Scheduled)' : 'Inward Statutory Review',
          status: item.status || 'PENDING',
          stayOrder: isDispute,
          daysLeft: item.daysLeft ?? item.slaDaysLeft ?? 15,
        };
      });

      setCasesList(formatted);
    } catch (err) {
      console.error('[CasesPage] Failed to query cases from database:', err);
      setErrorMsg(err.message || 'Unable to connect to revenue court database.');
      setCasesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filtered = casesList.filter((c) => {
    if (activeTab === 'TODAY' && c.daysLeft > 3) return false;
    if (activeTab === 'STAYS' && !c.stayOrder) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.parties.toLowerCase().includes(q) ||
        c.gat.toLowerCase().includes(q) ||
        c.village.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenDossier = (caseItem) => {
    setSelectedCaseId(caseItem.id);
    setIsDossierOpen(true);
  };

  return (
    <div className="page-cases" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <Gavel size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Revenue Court Cases &amp; Tribunal Disputes
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Quasi-judicial proceedings under the Maharashtra Land Revenue Code 1966 and e-Courts civil injunction integrations.
            </p>
          </div>
        </div>

        <Badge variant="secondary" style={{ backgroundColor: '#ea580c', color: '#ffffff', border: 'none' }}>
          {filtered.length} ACTIVE CAUSE LISTINGS
        </Badge>
      </div>

      {errorMsg && (
        <Alert variant="danger">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={16} />
            {errorMsg}
          </span>
        </Alert>
      )}

      {/* Filters & Search */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'ALL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveTab('ALL')}
            >
              All Proceedings ({casesList.length})
            </button>
            <button
              type="button"
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'TODAY' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveTab('TODAY')}
            >
              Urgent SLA Bench ({casesList.filter((c) => c.daysLeft <= 3).length})
            </button>
            <button
              type="button"
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'STAYS' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveTab('STAYS')}
            >
              Active Objections / Stays ({casesList.filter((c) => c.stayOrder).length})
            </button>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Case ID, Party, Gat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ux4g-input"
              style={{ paddingLeft: '2rem', width: '100%', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </Card>

      {/* Cases Listing */}
      {loading ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>
            Querying revenue court registry from PostgreSQL...
          </p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>
            No active revenue cases matching criteria.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((item) => (
            <Card key={item.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
                      CASE: {item.mutationNumber || item.id}
                    </span>
                    <h3 style={{ margin: '0.2rem 0', fontSize: '1.05rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>
                      {item.parties}
                    </h3>
                  </div>
                  <Badge variant={item.status === 'APPROVED' ? 'success' : item.stayOrder ? 'error' : 'warning'}>
                    {item.status}
                  </Badge>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)', marginBottom: '0.5rem' }}>
                  {item.gat} &bull; {item.village} &bull; <strong>{item.section}</strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '0.75rem' }}>
                  <div style={{ color: '#475569', marginBottom: '0.25rem' }}>
                    <strong>Dispute:</strong> {item.disputeType}
                  </div>
                  <div style={{ color: '#166534', fontWeight: 600 }}>
                    <strong>Bench:</strong> {item.bench}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: item.daysLeft <= 3 ? '#dc2626' : '#64748b', fontWeight: item.daysLeft <= 3 ? 700 : 500 }}>
                  SLA: {item.daysLeft} Days Remaining
                </span>
                <Button variant="primary" size="sm" onClick={() => handleOpenDossier(item)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Eye size={13} />
                    Open Dossier
                  </span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Case Dossier Modal */}
      {isDossierOpen && selectedCaseId && (
        <CaseDossierModal
          caseId={selectedCaseId}
          isOpen={isDossierOpen}
          onClose={() => {
            setIsDossierOpen(false);
            setSelectedCaseId(null);
          }}
          onActionExecuted={() => fetchCases()}
        />
      )}
    </div>
  );
};

export default CasesPage;
