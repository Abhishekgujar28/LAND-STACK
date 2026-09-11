import React from 'react';
import analyticsService from '../../../services/analyticsService';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { nationalBenchmarksData } from '../../../data/mockDataFallbacks';
import {
  Globe2,
  Award,
  Download,
  Flag,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StateBenchmarkPage = () => {
  return (
    <div className="page-state-benchmark" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <Globe2 size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              National Inter-State Benchmarks & GoRT Compliance
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Comparative land modernization index across 36 States & Union Territories.
            </p>
          </div>
        </div>

        <Link to="/government/national" className="ux4g-btn ux4g-btn-sm" style={{ backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700 }}>
          &larr; Return to National Cockpit
        </Link>
      </div>

      <Card>
        <div className="ux4g-table-wrapper">
          <table className="ux4g-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>State / Portal</th>
                <th>Total Parcels</th>
                <th>ULPIN Assigned</th>
                <th>Coverage</th>
                <th>Avg SLA</th>
                <th>GoRT Terminology</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {nationalBenchmarksData.map((s) => (
                <tr key={s.state}>
                  <td><strong>#{s.rank}</strong></td>
                  <td>
                    <strong>{s.state}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{s.portalName}</div>
                  </td>
                  <td>{s.parcels}</td>
                  <td>{s.ulpinAssigned}</td>
                  <td><strong style={{ color: '#16a34a' }}>{s.ulpinCoverage}</strong></td>
                  <td>{s.avgDays}</td>
                  <td>
                    <Badge variant={s.gortStandard === 'Full' ? 'success' : 'warning'}>{s.gortStandard}</Badge>
                  </td>
                  <td>
                    <Badge variant={s.status === 'Leader' ? 'success' : 'info'}>{s.status}</Badge>
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

export default StateBenchmarkPage;
