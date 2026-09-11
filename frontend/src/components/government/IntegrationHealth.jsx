import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * IntegrationHealth - Shows connectivity health with SRO, CERSAI, Courts, Bhunaksha
 */
export const IntegrationHealth = ({ integrations = [], className = '' }) => {
  return (
    <Card className={`gov-integration-health ${className}`.trim()} header={<strong>Connected Registry Interfaces</strong>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {integrations.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--ux4g-border-subtle)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.systemName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                Latency: {item.latency || '45ms'} &bull; Last Sync: {item.lastSync || 'Just now'}
              </div>
            </div>
            <Badge variant={item.status === 'HEALTHY' ? 'success' : item.status === 'DEGRADED' ? 'warning' : 'danger'}>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default IntegrationHealth;
