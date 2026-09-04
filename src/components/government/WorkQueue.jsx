import React from 'react';
import Table from '../ui/Table';
import StatusBadge from '../common/StatusBadge';
import Button from '../ui/Button';

/**
 * WorkQueue - Officer pending work items & approval queue
 */
export const WorkQueue = ({ items = [], onAction, className = '' }) => {
  const columns = [
    { key: 'id', title: 'Task / App ID' },
    { key: 'type', title: 'Action Required' },
    { key: 'ulpin', title: 'Target ULPIN' },
    { key: 'submittedDate', title: 'Received' },
    {
      key: 'status',
      title: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      title: 'Action',
      render: (_, row) => (
        <Button variant="primary" size="sm" onClick={() => onAction?.(row)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className={`gov-work-queue ${className}`.trim()}>
      <Table columns={columns} data={items} emptyMessage="No pending tasks in work queue" />
    </div>
  );
};

export default WorkQueue;
