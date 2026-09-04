import React from 'react';
import Card from '../ui/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../ui/Button';

/**
 * ApplicationCard - Citizen application tracker card
 */
export const ApplicationCard = ({ application, onTrack, className = '' }) => {
  if (!application) return null;

  return (
    <Card className={`citizen-application-card ${className}`.trim()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ux4g-text-muted)' }}>
            App ID: {application.id}
          </span>
          <h4 style={{ margin: '0.2rem 0', fontSize: '1rem', color: 'var(--ux4g-primary)' }}>
            {application.serviceName || application.type}
          </h4>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', margin: '0.5rem 0' }}>
        Applied on: {application.appliedDate} &bull; Target SLA: {application.slaDays || 15} Days
      </p>

      {application.remarks && (
        <div style={{ fontSize: '0.8rem', background: 'var(--ux4g-surface-muted)', padding: '0.5rem', borderRadius: 'var(--ux4g-radius-sm)', marginBottom: '0.75rem' }}>
          <strong>Latest Remarks:</strong> {application.remarks}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        {onTrack && (
          <Button variant="outline" size="sm" onClick={() => onTrack(application)}>
            Track Progress
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ApplicationCard;
