import React from 'react';
import { GitPullRequest, Calendar, UserCheck, ShieldCheck } from 'lucide-react';
import Card from '../ui/Card';
import StatusBadge from '../common/StatusBadge';
import Badge from '../ui/Badge';

/**
 * MutationStatus - Visual status tracker for e-Ferfar mutation workflows with Lucide icons
 */
export const MutationStatus = ({ mutation, className = '' }) => {
  if (!mutation) return null;

  return (
    <Card className={`citizen-mutation-status ${className}`.trim()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)', letterSpacing: '0.04em' }}>
            MUTATION NO: {mutation.mutationNumber}
          </span>
          <h4 style={{ margin: '0.2rem 0', fontSize: '1.05rem', color: 'var(--ux4g-primary)', fontWeight: 600 }}>
            {mutation.mutationType}
          </h4>
        </div>
        <StatusBadge status={mutation.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
        <div>
          <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Parcel ULPIN:</span>
          <div style={{ fontWeight: 600, fontFamily: 'var(--ux4g-font-mono)' }}>{mutation.parcelId}</div>
        </div>
        <div>
          <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Notice Period (15 Days):</span>
          <div>
            <Badge variant={mutation.noticePeriodEnded ? 'success' : 'warning'}>
              {mutation.noticePeriodEnded ? 'Notice Completed' : 'Notice Active'}
            </Badge>
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Initiated By:</span>
          <div style={{ fontWeight: 500 }}>{mutation.initiatedBy}</div>
        </div>
        <div>
          <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Assigned Officer:</span>
          <div style={{ fontWeight: 500 }}>{mutation.assignedOfficer}</div>
        </div>
      </div>
    </Card>
  );
};

export default MutationStatus;
