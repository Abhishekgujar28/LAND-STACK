import React from 'react';
import Select from '../ui/Select';
import Button from '../ui/Button';

/**
 * DashboardFilter - Tehsil / Village / Period filter bar for government consoles
 */
export const DashboardFilter = ({
  districts = [],
  tehsils = [],
  selectedDistrict,
  selectedTehsil,
  onDistrictChange,
  onTehsilChange,
  onApply,
  className = '',
}) => {
  return (
    <div
      className={`gov-dashboard-filter ${className}`.trim()}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'flex-end',
        padding: '1rem',
        background: 'var(--ux4g-surface)',
        borderRadius: 'var(--ux4g-radius-md)',
        border: '1px solid var(--ux4g-border-subtle)',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ flex: 1, minWidth: '180px' }}>
        <Select
          label="District"
          value={selectedDistrict}
          onChange={(e) => onDistrictChange?.(e.target.value)}
          options={districts.map((d) => ({ value: d.code, label: d.name }))}
        />
      </div>
      <div style={{ flex: 1, minWidth: '180px' }}>
        <Select
          label="Sub-District / Tehsil"
          value={selectedTehsil}
          onChange={(e) => onTehsilChange?.(e.target.value)}
          options={tehsils.map((t) => ({ value: t.code, label: t.name }))}
        />
      </div>
      <div>
        <Button variant="primary" onClick={onApply} style={{ marginBottom: '1rem' }}>
          Filter Analytics
        </Button>
      </div>
    </div>
  );
};

export default DashboardFilter;
