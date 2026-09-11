import React, { useState } from 'react';
import analyticsService from '../../../services/analyticsService';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { districtRankingsData } from '../../../data/mockDataFallbacks';
import {
  Building2,
  Layers,
  MapPin,
  TrendingUp,
  Clock,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TehsilOverviewPage = () => {
  const [selectedTehsil, setSelectedTehsil] = useState(districtRankingsData[0]);

  return (
    <div className="page-tehsil-overview" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <Building2 size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Tehsil Performance & Administrative Drill-Down
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Detailed operational metrics, officer allocation, and mutation throughput by Tehsil.
            </p>
          </div>
        </div>

        <Link to="/government/district" className="ux4g-btn ux4g-btn-sm" style={{ backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700 }}>
          &larr; Return to Collector Cockpit
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.25rem' }}>
        {/* Tehsil Selector */}
        <Card style={{ padding: '1rem' }}>
          <div style={{ fontWeight: 800, color: '#064e3b', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Select Tehsil (Pune District)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '550px', overflowY: 'auto' }}>
            {districtRankingsData.map((t) => (
              <div
                key={t.tehsil}
                onClick={() => setSelectedTehsil(t)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: selectedTehsil.tehsil === t.tehsil ? '2px solid #064e3b' : '1px solid #e2e8f0',
                  background: selectedTehsil.tehsil === t.tehsil ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.tehsil}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Rank #{t.rank} &bull; {t.totalParcels}</div>
                </div>
                <Badge variant={t.status === 'RED' ? 'danger' : t.status === 'YELLOW' ? 'warning' : 'success'}>
                  {t.slaAdherence}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Drill-down Detail */}
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                TEHSIL ADMINISTRATIVE DOSSIER
              </div>
              <h2 style={{ fontSize: '1.3rem', margin: '0.2rem 0 0', color: '#064e3b', fontWeight: 800 }}>
                {selectedTehsil.tehsil} Taluka
              </h2>
            </div>
            <Badge variant={selectedTehsil.status === 'RED' ? 'danger' : 'success'} style={{ fontSize: '0.85rem' }}>
              Rank #{selectedTehsil.rank} of 14
            </Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Total Parcels</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#064e3b' }}>{selectedTehsil.totalParcels}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>ULPIN Coverage</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>{selectedTehsil.ulpinCoverage}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>SLA Adherence</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedTehsil.status === 'RED' ? 'var(--ux4g-danger)' : '#16a34a' }}>
                {selectedTehsil.slaAdherence}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Revenue Officers</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#064e3b' }}>{selectedTehsil.officersAllocated}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Link to="/government/map" className="ux4g-btn ux4g-btn-sm ux4g-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Layers size={14} />
              <span>Inspect in Cadastral GIS</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TehsilOverviewPage;
