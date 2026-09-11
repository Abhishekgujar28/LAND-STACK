import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserManagementPage = () => {
  const officers = [
    { name: 'Prakash Shinde', role: 'TALATHI', jurisdiction: 'Circle Wagholi, Haveli', status: 'ACTIVE', dsc: 'ACTIVE_HARDWARE' },
    { name: 'Sanjay Deshmukh', role: 'TEHSILDAR', jurisdiction: 'Haveli Taluka (112 Villages)', status: 'ACTIVE', dsc: 'CLASS3_DSC_VALID' },
    { name: 'Rekha Joshi', role: 'SRO', jurisdiction: 'SRO Haveli No. 05', status: 'ACTIVE', dsc: 'IGR_TOKEN_ACTIVE' },
    { name: 'Dr. Suhas Diwase, IAS', role: 'COLLECTOR', jurisdiction: 'Pune District (14 Tehsils)', status: 'ACTIVE', dsc: 'NIC_EXECUTIVE_TOKEN' },
    { name: 'Anil Verma', role: 'STATE_PMU', jurisdiction: 'Maharashtra State', status: 'ACTIVE', dsc: 'STATE_ADMIN_TOKEN' },
    { name: 'Meera Sengupta', role: 'NATIONAL_MONITOR', jurisdiction: 'Pan-India (DoLR)', status: 'ACTIVE', dsc: 'CENTRAL_MTR_VALID' },
  ];

  return (
    <div className="page-user-management" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <Users size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Government Officer Identity & Role Provisioning
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Statutory officer account credentials, jurisdiction scopes, and Class-3 DSC digital token bindings.
            </p>
          </div>
        </div>

        <Link to="/government/admin" className="ux4g-btn ux4g-btn-sm" style={{ backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700 }}>
          &larr; Return to Admin Console
        </Link>
      </div>

      <Card>
        <div className="ux4g-table-wrapper">
          <table className="ux4g-table">
            <thead>
              <tr>
                <th>Officer Name</th>
                <th>Assigned Role</th>
                <th>Jurisdiction Scope</th>
                <th>DSC Digital Token</th>
                <th>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((o) => (
                <tr key={o.name}>
                  <td><strong>{o.name}</strong></td>
                  <td>
                    <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>{o.role}</Badge>
                  </td>
                  <td>{o.jurisdiction}</td>
                  <td>
                    <code style={{ fontSize: '0.75rem', color: '#15803d' }}>{o.dsc}</code>
                  </td>
                  <td>
                    <Badge variant="success">{o.status}</Badge>
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

export default UserManagementPage;
