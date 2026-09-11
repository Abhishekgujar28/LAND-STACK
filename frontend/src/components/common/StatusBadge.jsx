import React from 'react';
import Badge from '../ui/Badge';

/**
 * Common StatusBadge for land records and mutation status
 * @param {'CLEAR'|'ENCUMBERED'|'RESTRICTED'|'DISPUTED'|'UNDER_VERIFICATION'|'PENDING'|'APPROVED'|'REJECTED'} status
 */
export const StatusBadge = ({ status = 'CLEAR', className = '' }) => {
  const statusConfig = {
    CLEAR: { variant: 'success', label: 'Clear Title' },
    ENCUMBERED: { variant: 'warning', label: 'Encumbered' },
    RESTRICTED: { variant: 'danger', label: 'Restricted Land' },
    DISPUTED: { variant: 'danger', label: 'Disputed' },
    UNDER_VERIFICATION: { variant: 'info', label: 'Under Verification' },
    PENDING: { variant: 'warning', label: 'Pending' },
    APPROVED: { variant: 'success', label: 'Approved' },
    REJECTED: { variant: 'danger', label: 'Rejected' },
    IN_PROGRESS: { variant: 'info', label: 'In Progress' },
  };

  const current = statusConfig[status] || { variant: 'neutral', label: status };

  return (
    <Badge variant={current.variant} className={className}>
      {current.label}
    </Badge>
  );
};

export default StatusBadge;
