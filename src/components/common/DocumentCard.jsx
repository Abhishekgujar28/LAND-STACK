import React from 'react';
import { FileText, Eye, Download, CheckCircle2, Clock } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * Common DocumentCard component with clean Lucide SVG icons
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
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--ux4g-radius-md)',
              background: 'var(--ux4g-primary-light)',
              color: 'var(--ux4g-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={22} strokeWidth={2} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ux4g-primary)', fontWeight: 600 }}>
              {document.title || document.name}
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', marginTop: '0.2rem' }}>
              {document.type} &bull; {document.fileSize || 'PDF'} &bull; Issued: {document.issuedDate || document.date}
            </div>
          </div>
        </div>

        <Badge variant={document.verified ? 'success' : 'neutral'}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            {document.verified ? <CheckCircle2 size={12} strokeWidth={2.5} /> : <Clock size={12} strokeWidth={2.5} />}
            {document.verified ? 'VERIFIED' : 'PENDING'}
          </span>
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
        {onView && (
          <Button variant="outline" size="sm" onClick={() => onView(document)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Eye size={14} strokeWidth={2} />
              View
            </span>
          </Button>
        )}
        {onDownload && (
          <Button variant="primary" size="sm" onClick={() => onDownload(document)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Download size={14} strokeWidth={2} />
              Download
            </span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default DocumentCard;
