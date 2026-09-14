import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  GitPullRequest,
  ArrowRight,
  Share2,
  Download,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import parcelService from '../../services/parcelService';
import mutationService from '../../services/mutationService';

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
import Badge from '../../components/ui/Badge';
import RorModal from '../../components/citizen/RorModal';
import { Calculator, TrendingUp, Landmark, FileText as FileTextIcon } from 'lucide-react';

export const Parcel360Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');
  const [reportDownloaded, setReportDownloaded] = useState(false);
  const [sharedAlert, setSharedAlert] = useState(false);
  const [isRorOpen, setIsRorOpen] = useState(false);
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    parcelService.getParcel360(id || 'ULPIN-MH-PUN-000001').then(data => {
      if (isMounted) {
        setParcelData(data);
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Error loading parcel 360:', err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [id]);

  const parcel = parcelData?.overview ? {
    ulpin: parcelData.overview.ulpin,
    surveyNumber: parcelData.overview.surveyNumber || parcelData.overview.survey_number,
    gatNumber: parcelData.overview.gatNumber || parcelData.overview.gat_number,
    khasraNumber: parcelData.overview.khasraNumber || parcelData.overview.khasra_number,
    ctsNumber: parcelData.overview.ctsNumber || parcelData.overview.cts_number,
    stateCode: parcelData.overview.jurisdiction?.stateCode || parcelData.overview.state_code || 'MH',
    districtCode: parcelData.overview.jurisdiction?.districtCode || parcelData.overview.district_code || 'DIST-PUN',
    tehsilCode: parcelData.overview.jurisdiction?.tehsilCode || parcelData.overview.tehsil_code || 'TEH-HAV',
    villageCode: parcelData.overview.jurisdiction?.villageCode || parcelData.overview.village_code || 'VIL-WAG',
    villageName: parcelData.overview.villageName || parcelData.overview.village_name || 'Wagholi',
    area: parcelData.overview.area || 1.45,
    areaUnit: parcelData.overview.areaUnit || parcelData.overview.area_unit || 'Hectare',
    landUse: parcelData.overview.landUse || parcelData.overview.land_use || 'Agricultural',
    classification: parcelData.overview.classification || 'Jirayat',
    latitude: parcelData.map?.latitude || 18.5793,
    longitude: parcelData.map?.longitude || 73.9812,
    status: parcelData.overview.status || 'CLEAR',
    lastUpdated: parcelData.overview.provenance?.retrievedAt || '2025-01-15T09:00:00Z',
    source: parcelData.overview.provenance?.authority || 'e-Mahabhumi Digital Land Records',
    sourceSystem: parcelData.overview.provenance?.source || 'MAHA_REVENUE_DB',
  } : (parcelData || {
    ulpin: id || 'ULPIN-MH-PUN-000001',
    surveyNumber: '104',
    gatNumber: '42',
    khasraNumber: '104/1',
    ctsNumber: 'CTS-WAG-101',
    stateCode: 'MH',
    districtCode: 'DIST-PUN',
    tehsilCode: 'TEH-HAV',
    villageCode: 'VIL-WAG',
    villageName: 'Wagholi',
    area: 1.45,
    areaUnit: 'Hectare',
    landUse: 'Agricultural',
    classification: 'Jirayat',
    latitude: 18.5793,
    longitude: 73.9812,
    status: 'CLEAR',
    lastUpdated: '2025-01-15T09:00:00Z',
    source: 'e-Mahabhumi Digital Land Records',
    sourceSystem: 'MAHA_REVENUE_DB',
  });

  const owners = (
    Array.isArray(parcelData?.ownership?.current) ? parcelData.ownership.current :
    Array.isArray(parcelData?.owners) ? parcelData.owners :
    [
      { id: 'OWN-001', parcelId: parcel.ulpin, ownerId: 'CIT-001', ownerName: 'Aarav Patil', khataNumber: 'KH-8A-1001', relation: 'Sole Owner', share: 100, aadhaarStatus: 'Verified' },
    ]
  );

  const encumbrances = (
    Array.isArray(parcelData?.encumbrances?.records) ? parcelData.encumbrances.records :
    Array.isArray(parcelData?.encumbrances) ? parcelData.encumbrances :
    []
  );

  const restrictions = (
    Array.isArray(parcelData?.restrictions?.records) ? parcelData.restrictions.records :
    Array.isArray(parcelData?.restrictions) ? parcelData.restrictions :
    []
  );

  const zoning = parcelData?.planning || parcelData?.zoning || {
    authority: 'Planning Authority (PMRDA / PMC)',
    zoneCategory: parcel.landUse || 'Agricultural / General Zone',
    permissibility: 'Permitted as per State Master Plan',
    reservation: 'No reservation / Green Zone',
    sanctionedDP: 'Master Plan 2021-2041',
  };

  const tax = parcelData?.tax ? {
    annualAssessment: parcelData.tax.annualTax || parcelData.tax.annualAssessment || 180,
    financialYear: parcelData.tax.assessmentYear || parcelData.tax.financialYear || '2024-25',
    outstandingDues: parcelData.tax.pendingDues ?? parcelData.tax.outstandingDues ?? 0,
    status: parcelData.tax.paymentStatus || parcelData.tax.status || 'PAID',
    receiptNumber: parcelData.tax.receiptNumber || 'MHPUN-REV-2024-881',
  } : {
    annualAssessment: 180,
    financialYear: '2024-25',
    outstandingDues: 0,
    status: 'PAID',
    receiptNumber: 'MHPUN-REV-2024-881',
  };

  const courtCases = (
    Array.isArray(parcelData?.courts?.cases) ? parcelData.courts.cases :
    Array.isArray(parcelData?.courtCases) ? parcelData.courtCases :
    []
  );

  const documents = (
    Array.isArray(parcelData?.documents) ? parcelData.documents :
    []
  );

  const mutations = (
    Array.isArray(parcelData?.mutations?.records) ? parcelData.mutations.records :
    Array.isArray(parcelData?.mutations) ? parcelData.mutations :
    []
  );

  const history = mutations.map((m) => ({
    mutationNumber: m.mutation_number || m.mutationNumber || m.id,
    transactionType: m.mutation_type || m.mutationType || 'Title Transfer',
    recordedDate: m.sanction_date || m.sanctionDate || m.filing_date || m.filingDate || '2025-01-01',
    fromOwner: m.initiated_by || m.initiatedBy || 'Previous Owner',
    toOwner: owners[0]?.owner_name || owners[0]?.ownerName || 'Current Khatedar',
    sanctionedBy: m.sanctioned_by || m.sanctionedBy || m.assigned_officer || m.assignedOfficer || 'Tehsildar Office',
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} />
            Certified 360° Composite Title Report for <strong>{parcel.ulpin}</strong> downloaded successfully.
          </span>
        </Alert>
      )}
      {sharedAlert && (
        <Alert variant="info">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Share2 size={16} />
            Parcel 360 URL copied to clipboard for ULPIN <strong>{parcel.ulpin}</strong>.
          </span>
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
          borderBottom: '1px solid var(--ux4g-border-subtle)',
        }}
      >
        {[
          { key: 'ALL', label: 'Complete 360° Dossier' },
          { key: 'IDENTITY', label: 'Identity & Map' },
          { key: 'OWNERSHIP', label: 'Form 8A Khatedars' },
          { key: 'ENCUMBRANCE', label: 'Encumbrance & Tax' },
          { key: 'RESTRICTIONS', label: 'Restrictions & Court' },
          { key: 'ZONING', label: 'Zoning & Master Plan' },
          { key: 'VALUATION', label: 'Valuation & Stamp Duty' },
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
              transition: 'all var(--ux4g-transition-fast)',
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
            <TaxCard tax={tax} onPay={() => alert('Redirecting to Government e-GRAS / MahaKosh payment gateway...')} />
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

        {/* Advisory Valuation Estimator (Section 10.2) */}
        {(activeTab === 'ALL' || activeTab === 'VALUATION') && (
          <Card
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calculator size={18} style={{ color: 'var(--ux4g-primary)' }} />
                  <strong>Advisory Government Valuation & Ready Reckoner Estimator</strong>
                </div>
                <Badge variant="warning">Advisory Only &bull; Consult SRO</Badge>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', margin: 0 }}>
                Estimated approximate land valuation based on official geographic ready reckoner / circle rate zones (DILRMP Section 10.2). Final stamp duty and registration fees are calculated by the Sub-Registrar Officer (SRO) at deed execution.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  background: 'var(--ux4g-surface-muted)',
                  padding: '1rem',
                  borderRadius: 'var(--ux4g-radius-md)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Registered Land Area:</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {parcel.area || 1.45} Hectare ({(parcel.area || 1.45) * 10000} sq.m)
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Circle Rate / Ready Reckoner:</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ux4g-primary)' }}>
                    ₹ {parcel.landUse?.includes('Commercial') ? '18,500' : parcel.landUse?.includes('Residential') ? '9,500' : '3,200'} / sq.m
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Estimated Govt Valuation:</span>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#047857' }}>
                    ₹ {Math.round(((parcel.area || 1.45) * 10000 * (parcel.landUse?.includes('Commercial') ? 18500 : parcel.landUse?.includes('Residential') ? 9500 : 3200)) / 100000).toLocaleString('en-IN')} Lakh
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Est. Stamp Duty (6%) + Reg. Fee:</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#b45309' }}>
                    ₹ {Math.round((((parcel.area || 1.45) * 10000 * (parcel.landUse?.includes('Commercial') ? 18500 : parcel.landUse?.includes('Residential') ? 9500 : 3200) * 0.06) + 30000) / 1000).toLocaleString('en-IN')} K
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  background: '#f8fafc',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '4px',
                  borderLeft: '3px solid var(--ux4g-secondary)',
                }}
              >
                <strong>Legal Statutory Disclaimer:</strong> This valuation is system-generated for guidance purposes. For actual stamp duty computation under the Maharashtra Stamp Act 1958 or Rajasthan Stamp Act, please refer to the annual Annual Statement of Rates (ASR) published by the Department of Registration and Stamps.
              </div>
            </div>
          </Card>
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
      <Card style={{ padding: '1.25rem', background: 'var(--ux4g-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--ux4g-primary)' }}>
              Need official RoR extract, due diligence risk score, or apply for e-Ferfar mutation?
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.2rem' }}>
              Cross-checked against 8 Department registries &bull; National Cadastral Mesh
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => setIsRorOpen(true)}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileTextIcon size={16} />
                View Official RoR (7/12 & 8A)
              </span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/citizen/due-diligence')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={16} />
                Check Due Diligence Score
              </span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/citizen/mutations')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <GitPullRequest size={16} />
                Apply e-Ferfar Mutation
                <ArrowRight size={14} />
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Official Government RoR (7/12 & 8A) Modal */}
      <RorModal
        isOpen={isRorOpen}
        onClose={() => setIsRorOpen(false)}
        parcel={parcel}
        owners={owners}
        encumbrances={encumbrances}
        restrictions={restrictions}
        courtCases={courtCases}
        mutations={mutations}
        tax={tax}
      />
    </div>
  );
};

export default Parcel360Page;
