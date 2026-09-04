import React from 'react';

/**
 * RoleSelector component for role-based authentication simulation
 */
export const RoleSelector = ({ selectedRole, onSelectRole, roles = [], className = '' }) => {
  return (
    <div className={`auth-role-selector ${className}`.trim()} style={{ marginBottom: '1.25rem' }}>
      <label className="ux4g-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
        Select Login Role / Designation
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.5rem',
        }}
      >
        {roles.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              style={{
                padding: '0.6rem 0.5rem',
                border: '1px solid',
                borderColor: isSelected ? 'var(--ux4g-primary)' : 'var(--ux4g-border)',
                backgroundColor: isSelected ? 'var(--ux4g-primary-light)' : 'var(--ux4g-surface)',
                color: isSelected ? 'var(--ux4g-primary)' : 'var(--ux4g-text)',
                borderRadius: 'var(--ux4g-radius-md)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all var(--ux4g-transition-fast)',
              }}
            >
              {r.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
