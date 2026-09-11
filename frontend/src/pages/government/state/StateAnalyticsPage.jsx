import React from 'react';
import analyticsService from '../../../services/analyticsService';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { statePMUData, districtRankingsData } from '../../../data/mockDataFallbacks';
import {
  BarChart3,
  Landmark,
  TrendingUp,
  Layers,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StateAnalyticsPage = () => {
  return (
    <div className="page-state-analytics" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              State DILRMP Analytics & District Saturation
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Comparative progress across all 36 Districts of Maharashtra under DILRMP 2.0.
            </p>
          </div>
        </div>

        <Link to="/government/state" className="ux4g-btn ux4g-btn-sm" style={{ backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700 }}>
          &larr; Return to State PMU
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <Card style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem', color: '#064e3b', fontWeight: 800 }}>
            Top 5 Districts by Cadastral Digitization
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { d: 'Pune', rate: '99.1%', rank: '#1' },
              { d: 'Thane', rate: '98.8%', rank: '#2' },
              { d: 'Nagpur', rate: '98.4%', rank: '#3' },
              { d: 'Nashik', rate: '98.1%', rank: '#4' },
              { d: 'Chhatrapati Sambhajinagar', rate: '97.9%', rank: '#5' },
            ].map((item) => (
              <div key={item.d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <div>
                  <strong>{item.d}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Rank {item.rank}</div>
                </div>
                <Badge variant="success">{item.rate}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem', color: '#064e3b', fontWeight: 800 }}>
            Key Performance Highlights
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <div>&bull; <strong>Cadastral Digitization:</strong> {statePMUData.cadastralDigitizationRate} statewide</div>
            <div>&bull; <strong>Vectorized Villages:</strong> {statePMUData.vectorizedVillages} of {statePMUData.totalVillages}</div>
            <div>&bull; <strong>RoR Linkage:</strong> {statePMUData.rorMapLinkageRate} seeded with ULPIN</div>
            <div>&bull; <strong>Pending Backlog:</strong> {statePMUData.statewideMutationBacklog.toLocaleString()} cases</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StateAnalyticsPage;
