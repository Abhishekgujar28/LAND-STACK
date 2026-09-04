import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * Common DocumentCard component
 */
export const DocumentCard = ({
  document,
  onDownload,
  onView,
  className = '',
}) => {
  if (!document) return null;

  return (
    <Card className={`common-document-card ${className}`.trim()}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'var(--ux4g-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            📄
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ux4g-primary)' }}>
              {document.title || document.name}
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
              {document.type} &bull; {document.fileSize || 'PDF'} &bull; Issued: {document.issuedDate || document.date}
            </div>
          </div>
        </div>
        <Badge variant={document.verified ? 'success' : 'neutral'}>
          {document.verified ? 'VERIFIED' : 'PENDING'}
        </Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
        {onView && (
          <Button variant="outline" size="sm" onClick={() => onView(document)}>
            View
          </Button>
        )}
        {onDownload && (
          <Button variant="primary" size="sm" onClick={() => onDownload(document)}>
            Download
          </Button>
        )}
      </div>
    </Card>
  );
};

export default DocumentCard;
