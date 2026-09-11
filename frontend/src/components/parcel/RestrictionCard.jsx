import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * RestrictionCard - Tribal land protection (Sec 36A), government acquisition, non-alienation
 */
export const RestrictionCard = ({ restrictions = [], className = '' }) => {
  return (
    <Card className={`parcel-restrictions ${className}`.trim()} header={<strong>Statutory Land Restrictions & Transfer Prohibitions</strong>}>
      {restrictions.length === 0 ? (
        <p style={{ color: 'var(--ux4g-success)', fontWeight: 600, margin: 0 }}>
          ✓ No statutory transfer restrictions recorded on this land.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {restrictions.map((r) => (
            <div
              key={r.id}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--ux4g-danger-border)',
                background: 'var(--ux4g-danger-bg)',
                borderRadius: 'var(--ux4g-radius-md)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--ux4g-danger)', fontSize: '0.9rem' }}>
                  {r.type}
                </span>
                <Badge variant="danger">Active Restriction</Badge>
              </div>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--ux4g-text)' }}>
                {r.reason || r.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RestrictionCard;
