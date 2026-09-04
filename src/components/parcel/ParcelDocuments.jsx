import React from 'react';
import Card from '../ui/Card';
import DocumentCard from '../common/DocumentCard';

/**
 * ParcelDocuments - 7/12, 8A, Property Card, and Ferfar archives for the parcel
 */
export const ParcelDocuments = ({ documents = [], onDownload, onView, className = '' }) => {
  return (
    <Card className={`parcel-documents ${className}`.trim()} header={<strong>Certified Land Registry Documents</strong>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} onDownload={onDownload} onView={onView} />
        ))}
      </div>
    </Card>
  );
};

export default ParcelDocuments;
