import React from 'react';
import { ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../ui/Button';

/**
 * ApplicationCard - Citizen application tracker card with Lucide icons
 */
export const ApplicationCard = ({ application, onTrack, className = '' }) => {
  if (!application) return null;

  return (
    <Card className={`citizen-application-card ${className}`.trim()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ux4g-text-muted)' }}>
            App ID: {application.application_number || application.id}
          </span>
          <h4 style={{ margin: '0.2rem 0', fontSize: '1rem', color: 'var(--ux4g-primary)', fontWeight: 600 }}>
            {application.application_types?.title || application.serviceName || application.type_code || application.type || 'Revenue Service'}
          </h4>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Clock size={14} style={{ color: 'var(--ux4g-text-muted)' }} />
        Applied on: {application.submission_date ? new Date(application.submission_date).toLocaleDateString('en-IN') : (application.appliedDate || 'Recent')} &bull; Target SLA: {application.sla_days || application.slaDays || 15} Days
      </p>

      {(application.form_data?.remarks || application.remarks) && (
        <div style={{ fontSize: '0.8rem', background: 'var(--ux4g-surface-muted)', padding: '0.5rem 0.75rem', borderRadius: 'var(--ux4g-radius-sm)', marginBottom: '0.75rem', borderLeft: '3px solid var(--ux4g-primary)' }}>
          <strong>Latest Remarks:</strong> {application.form_data?.remarks || application.remarks}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        {onTrack && (
          <Button variant="outline" size="sm" onClick={() => onTrack(application)}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Track Progress
              <ArrowRight size={13} />
            </span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ApplicationCard;
