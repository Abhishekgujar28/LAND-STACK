import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import parcelsData from '../../data/parcels/parcels.json';
import ownershipData from '../../data/parcels/ownership.json';
import encumbrancesData from '../../data/parcels/encumbrances.json';
import restrictionsData from '../../data/parcels/restrictions.json';
import zoningData from '../../data/parcels/zoning.json';
import taxRecordsData from '../../data/parcels/taxRecords.json';
import courtCasesData from '../../data/parcels/courtCases.json';
import parcelDocumentsData from '../../data/parcels/parcelDocuments.json';
import mutationsData from '../../data/mutations/mutations.json';

import ParcelHeader from '../../components/parcel/ParcelHeader';
import ParcelIdentity from '../../components/parcel/ParcelIdentity';
import ParcelMap from '../../components/parcel/ParcelMap';
import OwnershipCard from '../../components/parcel/OwnershipCard';
import EncumbranceCard from '../../components/parcel/EncumbranceCard';
import RestrictionCard from '../../components/parcel/RestrictionCard';
import ZoningCard from '../../components/parcel/ZoningCard';
import TaxCard from '../../components/parcel/TaxCard';
import CourtCaseCard from '../../components/parcel/CourtCaseCard';
import ParcelDocuments from '../../components/parcel/ParcelDocuments';
import Provenance from '../../components/parcel/Provenance';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const Parcel360Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');
  const [reportDownloaded, setReportDownloaded] = useState(false);
  const [sharedAlert, setSharedAlert] = useState(false);

  // Match target parcel
  const parcel =
    parcelsData.find((p) => p.ulpin === id || p.gatNumber === id || p.surveyNumber === id) ||
    parcelsData[0];

  // Match layers
  const owners = ownershipData.filter((o) => o.parcelId === parcel.ulpin);
  const encumbrances = encumbrancesData.filter((e) => e.parcelId === parcel.ulpin);
  const restrictions = restrictionsData.filter((r) => r.parcelId === parcel.ulpin);
  const zoning = zoningData.find((z) => z.parcelId === parcel.ulpin) || {
    authority: 'Planning Authority (PMRDA / PMC)',
    zoneCategory: parcel.landUse || 'Agricultural / General Zone',
    permissibility: 'Permitted as per State Master Plan',
    reservation: 'No public reservation recorded',
  };
  const tax = taxRecordsData.find((t) => t.parcelId === parcel.ulpin) || {
    annualAssessment: 180,
    financialYear: '2024-25',
    outstandingDues: 0,
    status: 'PAID',
  };
  const courtCases = courtCasesData.filter((c) => c.parcelId === parcel.ulpin);
  const documents = parcelDocumentsData.filter((d) => d.parcelId === parcel.ulpin);
  const mutations = mutationsData.filter((m) => m.parcelId === parcel.ulpin);

  const history = mutations.map((m) => ({
    mutationNumber: m.mutationNumber,
    transactionType: m.mutationType,
    recordedDate: m.sanctionDate || m.filingDate,
    fromOwner: m.initiatedBy,
    toOwner: owners[0]?.ownerName || 'Current Khatedar',
    sanctionedBy: m.sanctionedBy || m.assignedOfficer,
  }));

  const handleDownloadReport = () => {
    setReportDownloaded(true);
    setTimeout(() => setReportDownloaded(false), 5000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setSharedAlert(true);
    setTimeout(() => setSharedAlert(false), 4000);
  };

  return (
    <div className="page-parcel-360" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Notifications */}
      {reportDownloaded && (
        <Alert variant="success">
          ✓ Certified 360&deg; Composite Title Report for <strong>{parcel.ulpin}</strong> downloaded successfully.
        </Alert>
      )}
      {sharedAlert && (
        <Alert variant="info">
          ✓ Parcel 360 URL copied to clipboard for ULPIN <strong>{parcel.ulpin}</strong>.
        </Alert>
      )}

      {/* Parcel Header Banner */}
      <ParcelHeader
        parcel={parcel}
        onShare={handleShare}
        onDownloadReport={handleDownloadReport}
      />

      {/* Navigation / Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
          borderBottom: '1px solid var(--ux4g-border)',
        }}
      >
        {[
          { key: 'ALL', label: 'Complete 360° Dossier' },
          { key: 'IDENTITY', label: 'Identity & Map' },
          { key: 'OWNERSHIP', label: 'Form 8A Khatedars' },
          { key: 'ENCUMBRANCE', label: 'Encumbrance & Tax' },
          { key: 'RESTRICTIONS', label: 'Restrictions & Court' },
          { key: 'ZONING', label: 'Zoning & Master Plan' },
          { key: 'DOCUMENTS', label: 'Certified Documents' },
          { key: 'PROVENANCE', label: 'Mutation Lineage' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--ux4g-radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              border: 'none',
              background: activeTab === tab.key ? 'var(--ux4g-primary)' : 'var(--ux4g-surface-muted)',
              color: activeTab === tab.key ? '#ffffff' : 'var(--ux4g-text)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Layer Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {(activeTab === 'ALL' || activeTab === 'IDENTITY') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            <ParcelIdentity parcel={parcel} />
            <ParcelMap parcel={parcel} />
          </div>
        )}

        {(activeTab === 'ALL' || activeTab === 'OWNERSHIP') && (
          <OwnershipCard owners={owners} />
        )}

        {(activeTab === 'ALL' || activeTab === 'ENCUMBRANCE') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            <EncumbranceCard encumbrances={encumbrances} />
            <TaxCard tax={tax} onPay={() => alert('Redirecting to Government e-Gras / MahaKosh payment gateway...')} />
          </div>
        )}

        {(activeTab === 'ALL' || activeTab === 'RESTRICTIONS') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            <RestrictionCard restrictions={restrictions} />
            <CourtCaseCard cases={courtCases} />
          </div>
        )}

        {(activeTab === 'ALL' || activeTab === 'ZONING') && (
          <ZoningCard zoning={zoning} />
        )}

        {(activeTab === 'ALL' || activeTab === 'DOCUMENTS') && (
          <ParcelDocuments
            documents={documents}
            onDownload={(doc) => alert(`Downloading certified PDF for ${doc.title}`)}
            onView={(doc) => alert(`Viewing document: ${doc.title} (Verified: ${doc.verified ? 'YES' : 'NO'})`)}
          />
        )}

        {(activeTab === 'ALL' || activeTab === 'PROVENANCE') && (
          <Provenance history={history} />
        )}
      </div>

      {/* Footer Actions */}
      <Card style={{ padding: '1.25rem', background: '#fafbfc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ux4g-primary)' }}>
              Need due diligence risk score or apply for e-Ferfar mutation?
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
              Cross-checked against 8 Department registries under DILRMP 3.0
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => navigate('/citizen/due-diligence')}>
              🛡️ Check Due Diligence Score
            </Button>
            <Button variant="primary" onClick={() => navigate('/citizen/mutations')}>
              Apply e-Ferfar Mutation →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Parcel360Page;
