import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Services & Components
import parcelService from '../../services/parcelService';
import publicService from '../../services/publicService';
import CadastralGisMap from '../../components/citizen/CadastralGisMap';
import RorModal from '../../components/citizen/RorModal';
import MapReportModal from '../../components/government/MapReportModal';

/**
 * ParcelSearchPage - Official BharatBhumi GIS Land Parcel Viewer
 * Full-screen spatial viewer matching MoRD & Digital India specifications.
 */
const ParcelSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Jurisdictions & Parcels Live State
  const [jurisdictions, setJurisdictions] = useState({ states: [], districts: [], tehsils: [], villages: [] });
  const [parcels, setParcels] = useState([]);
  const [dossier, setDossier] = useState(null);

  // Active Selected Parcel State
  const [selectedParcel, setSelectedParcel] = useState(null);

  // RoR & Map Report Modal State
  const [isRorOpen, setIsRorOpen] = useState(false);
  const [isMapReportOpen, setIsMapReportOpen] = useState(false);

  // Fetch initial jurisdictions and parcels from live API
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      publicService.getJurisdictions().catch(() => null),
      parcelService.getParcels().catch(() => null),
    ])
      .then(([jur, parcelList]) => {
        if (isMounted) {
          if (jur) setJurisdictions(jur);
          const pList = Array.isArray(parcelList) ? parcelList : (parcelList?.items || []);
          setParcels(pList);

          const paramUlpin = searchParams.get('ulpin');
          const initial = (paramUlpin && pList.find((p) => p.ulpin === paramUlpin)) || pList[0] || null;
          if (initial) {
            setSelectedParcel(initial);
          }
        }
      })
      .catch((err) => console.warn('ParcelSearch initial fetch:', err));

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Load 360 dossier whenever selected parcel changes
  useEffect(() => {
    if (!selectedParcel?.ulpin) return;
    let isMounted = true;
    parcelService.getParcel360(selectedParcel.ulpin)
      .then((d) => {
        if (isMounted) setDossier(d);
      })
      .catch((err) => console.warn('Dossier fetch:', err));

    return () => {
      isMounted = false;
    };
  }, [selectedParcel?.ulpin]);

  // Derive parcel layers & records from live dossier
  const parcelOwners = dossier?.ownership || [];
  const parcelEncumbrances = dossier?.encumbrances || [];
  const parcelRestrictions = dossier?.restrictions || [];
  const parcelCourtCases = dossier?.courtCases || [];
  const parcelTax = dossier?.taxRecords || { annualAssessment: 180, outstandingDues: 0 };
  const parcelMutations = dossier?.mutations || [];

  return (
    <div className="page-parcel-search-fullscreen">
      {/* Full-Screen Spatial GIS Map Engine */}
      <CadastralGisMap
        villageParcels={parcels}
        selectedParcel={selectedParcel}
        dossier={dossier}
        onSelectParcel={(parcel) => {
          setSelectedParcel(parcel);
        }}
        onOpenRor={(parcel) => {
          setSelectedParcel(parcel);
          setIsRorOpen(true);
        }}
        onOpenMapReport={(parcel) => {
          setSelectedParcel(parcel);
          setIsMapReportOpen(true);
        }}
        height="100%"
      />

      {/* ============================================================ */}
      {/* Official Government RoR (7/12 & 8A Extract) Modal Viewer */}
      {/* ============================================================ */}
      <RorModal
        isOpen={isRorOpen}
        onClose={() => setIsRorOpen(false)}
        parcel={selectedParcel}
        owners={parcelOwners}
        encumbrances={parcelEncumbrances}
        restrictions={parcelRestrictions}
        courtCases={parcelCourtCases}
        mutations={parcelMutations}
        tax={parcelTax}
      />

      {/* ============================================================ */}
      {/* Official MahaBhunaksha Cadastral Map Report (FMB) Modal */}
      {/* ============================================================ */}
      <MapReportModal
        isOpen={isMapReportOpen}
        onClose={() => setIsMapReportOpen(false)}
        parcel={selectedParcel}
      />
    </div>
  );
};

export default ParcelSearchPage;
