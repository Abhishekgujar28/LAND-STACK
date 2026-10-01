import React from 'react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Common UserMenu avatar and dropdown
 */
export const UserMenu = ({ user = { name: 'Citizen User', role: 'CITIZEN' }, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      if (user?.role && user.role !== 'CITIZEN' && !user.role.toLowerCase().includes('citizen')) {
        navigate('/login/government', { replace: true });
      } else {
        navigate('/login/citizen', { replace: true });
      }
    }
  };

  const trigger = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        cursor: 'pointer',
        padding: '0.3rem 0.6rem',
        borderRadius: 'var(--ux4g-radius-md)',
        background: 'var(--ux4g-surface-muted)',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--ux4g-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.85rem',
        }}
      >
        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </div>
      <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ux4g-text)' }}>{user.name}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-muted)' }}>{user.role}</div>
      </div>
    </div>
  );

  return (
    <Dropdown trigger={trigger} align="right">
      <DropdownItem onClick={() => navigate('/citizen/profile')}>
        Profile & Settings
      </DropdownItem>
      <DropdownItem onClick={() => navigate('/citizen/watchlist')}>
        My Watchlist
      </DropdownItem>
      <DropdownItem onClick={() => navigate('/citizen/documents')}>
        My Documents
      </DropdownItem>
      <hr style={{ border: 'none', borderTop: '1px solid var(--ux4g-border-subtle)', margin: '0.25rem 0' }} />
      <DropdownItem onClick={handleLogout}>
        <span style={{ color: 'var(--ux4g-danger)' }}>Sign Out</span>
      </DropdownItem>
    </Dropdown>
  );
};

export default UserMenu;
