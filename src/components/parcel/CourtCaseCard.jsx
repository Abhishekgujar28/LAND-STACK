import React from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Badge from '../ui/Badge';

/**
 * CourtCaseCard - e-Courts & Revenue Court litigation records for parcel
 */
export const CourtCaseCard = ({ cases = [], className = '' }) => {
  const columns = [
    { key: 'caseNumber', title: 'Case / CNR No' },
    { key: 'courtName', title: 'Forum / Court' },
    { key: 'petitioner', title: 'Petitioner vs Respondent' },
    { key: 'filingDate', title: 'Filing Date' },
    {
      key: 'status',
      title: 'Status',
      render: (val) => (
        <Badge variant={val === 'PENDING' ? 'danger' : 'neutral'}>
          {val}
        </Badge>
      ),
    },
  ];

  return (
    <Card
      className={`parcel-court-cases ${className}`.trim()}
      header={<strong>Litigation History (e-Courts & Revenue Tribunal)</strong>}
    >
      <Table columns={columns} data={cases} emptyMessage="No active or pending litigation found for this land parcel." />
    </Card>
  );
};

export default CourtCaseCard;
