import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import citizensData from '../../data/users/citizens.json';
import documentsData from '../../data/documents/documents.json';
import parcelDocumentsData from '../../data/parcels/parcelDocuments.json';
import parcelsData from '../../data/parcels/parcels.json';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import DocumentCard from '../../components/common/DocumentCard';

export const DocumentsPage = () => {
  const { user } = useAuth();
  const currentCitizen =
    citizensData.find((c) => c.id === user?.id) ||
    citizensData[0];

  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDoc, setViewingDoc] = useState(null);
  const [downloadAlert, setDownloadAlert] = useState('');

  // User documents
  const userDocs = documentsData.filter((d) => d.userId === currentCitizen.id);

  const filteredDocs = useMemo(() => {
    return userDocs.filter((doc) => {
      const matchesType = selectedType === 'ALL' || doc.type.toLowerCase().includes(selectedType.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.type.toLowerCase().includes(q) ||
        (doc.parcelId && doc.parcelId.toLowerCase().includes(q));

      return matchesType && matchesQuery;
    });
  }, [userDocs, selectedType, searchQuery]);

  const handleDownload = (doc) => {
    setDownloadAlert(`Downloaded "${doc.title}" (PDF, ${doc.fileSize || '300 KB'}) with Government Digital Signature.`);
    setTimeout(() => setDownloadAlert(''), 5000);
  };

  const handleView = (doc) => {
    setViewingDoc(doc);
  };

  return (
    <div className="page-documents" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase' }}>
            DigiLocker & Digital India Land Records Vault
          </span>
          <Badge variant="success">IT Act 2000 Section 65B</Badge>
        </div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0 }}>
          Certified Land Documents Vault
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
          Legally valid, court-admissible digitally signed 7/12 extracts, Form 8A holding certificates, and Property Cards.
        </p>
      </div>

      {downloadAlert && <Alert variant="success">{downloadAlert}</Alert>}

      {/* Filter and Search Bar */}
      <Card style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: '1 1 280px' }}>
            <input
              type="text"
              className="ux4g-input"
              placeholder="Search by document name, type, or ULPIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'ALL', label: 'All Documents' },
              { key: '7/12', label: 'Form 7/12' },
              { key: '8A', label: 'Form 8A' },
              { key: 'Property Card', label: 'Property Card' },
              { key: 'Receipt', label: 'Payment Receipts' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedType(tab.key)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--ux4g-radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  background: selectedType === tab.key ? 'var(--ux4g-primary)' : 'var(--ux4g-surface-muted)',
                  color: selectedType === tab.key ? '#ffffff' : 'var(--ux4g-text)',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>
            No documents found matching your filter criteria.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDownload={handleDownload}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Document View Modal */}
      {viewingDoc && (
        <Modal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          title={`Certified Document Preview — ${viewingDoc.title}`}
        >
          <div style={{ padding: '0.5rem 0' }}>
            {/* Gov Watermark Preview Box */}
            <div
              style={{
                border: '2px solid var(--ux4g-border)',
                borderRadius: 'var(--ux4g-radius-md)',
                padding: '1.5rem',
                background: '#f8fafc',
                position: 'relative',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ textAlign: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.8rem' }}>🇮🇳</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ux4g-primary)' }}>
                  GOVERNMENT OF MAHARASHTRA &bull; REVENUE DEPARTMENT
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                  Certified Electronic Copy (e-Mahabhumi Digital Portal)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Document Title:</span>
                  <div style={{ fontWeight: 600 }}>{viewingDoc.title}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Category:</span>
                  <div style={{ fontWeight: 600 }}>{viewingDoc.type}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Associated ULPIN:</span>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--ux4g-font-mono)' }}>{viewingDoc.parcelId || 'N/A'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--ux4g-text-muted)', fontSize: '0.75rem' }}>Issued Date:</span>
                  <div style={{ fontWeight: 600 }}>{viewingDoc.date}</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: 'var(--ux4g-radius-sm)',
                  border: '1px dashed #94a3b8',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-success)' }}>
                    ✓ DIGITALLY SIGNED & VERIFIED
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ux4g-text-muted)' }}>
                    Certifying Authority: e-Mudhra Sub-CA &bull; SHA-256 Hash
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  📱
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" onClick={() => setViewingDoc(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleDownload(viewingDoc);
                  setViewingDoc(null);
                }}
              >
                Download Official PDF ({viewingDoc.fileSize || 'PDF'})
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DocumentsPage;
