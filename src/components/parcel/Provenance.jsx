import React from 'react';
import Card from '../ui/Card';
import Timeline from '../citizen/Timeline';

/**
 * Provenance - Historical chain of title and mutation lineage for the parcel
 */
export const Provenance = ({ history = [], className = '' }) => {
  const steps = history.map((item) => ({
    title: `Mutation No. ${item.mutationNumber || item.id}: ${item.transactionType || item.title}`,
    date: item.recordedDate || item.date,
    description: `From: ${item.fromOwner || 'Prior Holder'} -> To: ${item.toOwner || 'Current Khatedar'} (${item.consideration || 'Inheritance/Sale'})`,
    actor: item.sanctionedBy || 'Talathi / Mandal Adhikari',
    status: 'COMPLETED',
  }));

  return (
    <Card className={`parcel-provenance ${className}`.trim()} header={<strong>Historical Chain of Title (Provenance)</strong>}>
      <Timeline steps={steps} />
    </Card>
  );
};

export default Provenance;
