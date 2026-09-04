import React from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';

/**
 * OwnershipCard - Khatedar / Co-sharer ownership table and shares
 */
export const OwnershipCard = ({ owners = [], className = '' }) => {
  const columns = [
    { key: 'ownerName', title: 'Khatedar / Owner Name' },
    { key: 'khataNumber', title: 'Khata No (8A)' },
    { key: 'relation', title: 'Relation / Type' },
    {
      key: 'share',
      title: 'Holding Share',
      render: (val) => `${val}%`,
    },
    { key: 'aadhaarStatus', title: 'Aadhaar Seeded' },
  ];

  return (
    <Card className={`parcel-ownership ${className}`.trim()} header={<strong>Ownership & Khata Registry (Form 8A)</strong>}>
      <Table columns={columns} data={owners} emptyMessage="No ownership records found" />
    </Card>
  );
};

export default OwnershipCard;
