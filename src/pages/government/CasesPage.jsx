import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
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
} from 'lucide-react';

export const CasesPage = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const courtCases = [
    {
      id: 'REV-HVL-2026-0089',
      bench: 'Tehsildar Revenue Court, Haveli',
      parties: 'Priya Shinde vs. Dnyaneshwar Lande',
      gat: 'Gat 88',
      village: 'Wagholi',
      section: 'Section 150(2) MLR Code',
      disputeType: 'Boundary Demarcation & Physical Possession Dispute',
      hearingDate: 'Today (05-Sep-2026), 11:00 AM',
      status: 'HEARING_TODAY',
      stayOrder: true,
    },
    {
      id: 'REV-HVL-2026-0092',
      bench: 'Sub-Divisional Officer (SDO) Eastern Pune',
      parties: 'Kishore Patil vs. State of Maharashtra',
      gat: 'Gat 112',
      village: 'Manjri',
      section: 'Section 149 MLR Code',
      disputeType: 'Unregistered Partition Deed Challenge',
      hearingDate: '12-Sep-2026, 02:30 PM',
      status: 'ADJOURNED',
      stayOrder: false,
    },
    {
      id: 'REV-HVL-2026-0095',
      bench: 'District Collector Revenue Bench',
      parties: 'Amit Jagtap vs. Ramesh Kale',
      gat: 'Gat 64',
      village: 'Lohegaon',
      section: 'Section 36A MLR Code',
      disputeType: 'Tribal Land Alienation Violation',
      hearingDate: '16-Sep-2026, 11:30 AM',
      status: 'UNDER_INQUIRY',
      stayOrder: true,
    },
    {
      id: 'CIV-PUN-2024-892',
      bench: 'Civil Court Senior Division Pune',
      parties: 'Laxman Jadhav vs. Suresh Deshmukh',
      gat: 'Gat 142',
      village: 'Wadgaon Sheri',
      section: 'Civil Injunction Suit',
      disputeType: 'Title Declaration & Permanent Injunction',
      hearingDate: '24-Sep-2026, 10:30 AM',
      status: 'CIVIL_INJUNCTION_STAY',
      stayOrder: true,
    },
  ];

  const filtered = courtCases.filter((c) => {
    if (activeTab === 'TODAY' && c.status !== 'HEARING_TODAY') return false;
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
              Revenue Court Cases & Tribunal Disputes
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

      {/* Filters & Search */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'ALL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveTab('ALL')}
              style={{ backgroundColor: activeTab === 'ALL' ? '#064e3b' : undefined }}
            >
              All Cases ({courtCases.length})
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'TODAY' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveTab('TODAY')}
              style={{ backgroundColor: activeTab === 'TODAY' ? '#064e3b' : undefined }}
            >
              Today's Bench Hearings
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${activeTab === 'STAYS' ? 'ux4g-btn-danger' : 'ux4g-btn-outline'}`}
              onClick={() => setActiveTab('STAYS')}
            >
              🛑 Active Injunction Stays
            </button>
          </div>

          <input
            type="text"
            className="ux4g-input"
            placeholder="Search Case, Gat, Parties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '250px', height: '34px' }}
          />
        </div>
      </Card>

      {/* Court Cases List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((item) => (
          <Card key={item.id} style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', color: '#064e3b' }}>
                    {item.id}
                  </span>
                  <Badge variant={item.stayOrder ? 'danger' : 'warning'}>
                    {item.stayOrder ? 'Stay Order Active' : 'Under Determination'}
                  </Badge>
                </div>
                <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'var(--ux4g-text)' }}>
                  {item.parties}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)', marginTop: '0.2rem' }}>
                  <strong>Bench:</strong> {item.bench} &bull; <strong>Section:</strong> {item.section}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Target Parcel</div>
                <div style={{ fontWeight: 800, color: '#064e3b' }}>
                  {item.gat}, {item.village}
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <strong>Dispute Gist:</strong> {item.disputeType}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} />
                <span>Next Scheduled Hearing: <strong>{item.hearingDate}</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" size="sm">
                  View Case Docket
                </Button>
                <Button variant="primary" size="sm" style={{ backgroundColor: '#064e3b' }}>
                  Record Bench Proceedings
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CasesPage;
