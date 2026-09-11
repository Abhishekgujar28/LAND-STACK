import React from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Badge from '../ui/Badge';

/**
 * EncumbranceCard - Bank mortgages, charges, liens registered on parcel
 */
export const EncumbranceCard = ({ encumbrances = [], className = '' }) => {
  const columns = [
    { key: 'bankName', title: 'Financial Institution' },
    { key: 'chargeAmount', title: 'Charge Amount (₹)' },
    { key: 'registrationDate', title: 'Charge Date' },
    { key: 'cersaiId', title: 'CERSAI Security ID' },
    {
      key: 'status',
      title: 'Status',
      render: (val) => (
        <Badge variant={val === 'ACTIVE' ? 'danger' : 'success'}>
          {val}
        </Badge>
      ),
    },
  ];

  return (
    <Card
      className={`parcel-encumbrances ${className}`.trim()}
      header={<strong>Bank Encumbrances & Liens (CERSAI Integrated)</strong>}
    >
      <Table columns={columns} data={encumbrances} emptyMessage="No active encumbrances on this parcel (Clear from bank liabilities)" />
    </Card>
  );
};

export default EncumbranceCard;
