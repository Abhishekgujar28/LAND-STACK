import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import TalathiDashboard from './TalathiDashboard';
import TehsildarDashboard from './TehsildarDashboard';

/**
 * RevenueDashboard - Smart Revenue & Land Records Workspace
 * Dynamically switches between Talathi (Village Officer) and Tehsildar (Statutory Authority)
 */
export const RevenueDashboard = () => {
  const { role } = useAuth();
  const [activeView, setActiveView] = useState(() => (role === 'TEHSILDAR' ? 'TEHSILDAR' : 'TALATHI'));

  return (
    <div className="page-revenue-dashboard">
      {/* Revenue Department Quick View Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--ux4g-radius-md)',
          border: '1px solid var(--ux4g-border-subtle)',
          marginBottom: '1rem',
          boxShadow: 'var(--ux4g-shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🏛️</span>
          <span style={{ fontWeight: 700, color: 'var(--ux4g-primary)', fontSize: '0.95rem' }}>
            Revenue & Land Records Operations
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`ux4g-btn ux4g-btn-sm ${activeView === 'TALATHI' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
            onClick={() => setActiveView('TALATHI')}
          >
            👤 Talathi Field Workspace
          </button>
          <button
            className={`ux4g-btn ux4g-btn-sm ${activeView === 'TEHSILDAR' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
            onClick={() => setActiveView('TEHSILDAR')}
          >
            ⚖️ Tehsildar Statutory Bench
          </button>
        </div>
      </div>

      {/* Render Active Workspace */}
      {activeView === 'TALATHI' ? <TalathiDashboard /> : <TehsildarDashboard />}
    </div>
  );
};

export default RevenueDashboard;
