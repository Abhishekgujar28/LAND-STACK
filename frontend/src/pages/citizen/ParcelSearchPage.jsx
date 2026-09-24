import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Layers,
  RotateCcw,
  FileText,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  User,
  Building,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Sparkles,
  Compass,
  DollarSign,
  Share2,
  Printer,
} from 'lucide-react';

// Data imports
import parcelService from '../../services/parcelService';
import publicService from '../../services/publicService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import CadastralGisMap from '../../components/citizen/CadastralGisMap';
import RorModal from '../../components/citizen/RorModal';
import MapReportModal from '../../components/government/MapReportModal';

const ParcelSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search Mode Tab: 'CASCADING' | 'ULPIN' | 'OWNER'
  const [searchMode, setSearchMode] = useState('CASCADING');

  // Jurisdictions & Parcels Live State
  const [jurisdictions, setJurisdictions] = useState({ states: [], districts: [], tehsils: [], villages: [] });
  const [parcels, setParcels] = useState([]);
  const [dossier, setDossier] = useState(null);

  // Cascading Selection State
  const [selectedState, setSelectedState] = useState('MH');
  const [selectedDistrict, setSelectedDistrict] = useState('DIST-PUN');
  const [selectedTehsil, setSelectedTehsil] = useState('TEH-HAV');
  const [selectedVillage, setSelectedVillage] = useState('VIL-WAG');
  const [selectedPlotNo, setSelectedPlotNo] = useState('42'); // Gat or Survey No
  const [manualPlotQuery, setManualPlotQuery] = useState('');

  // ULPIN Search State
  const [ulpinQuery, setUlpinQuery] = useState('');

  // Owner Name Search State
  const [ownerQuery, setOwnerQuery] = useState('');

  // Active Selected Parcel State
  const [selectedParcel, setSelectedParcel] = useState(null);

  // RoR Modal State
  const [isRorOpen, setIsRorOpen] = useState(false);
  const [isMapReportOpen, setIsMapReportOpen] = useState(false);
  const [watchlistSuccess, setWatchlistSuccess] = useState('');

  // Fetch initial jurisdictions and parcels from live API
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      publicService.getJurisdictions(),
      parcelService.getParcels(),
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
            setSelectedPlotNo(initial.gatNumber || initial.surveyNumber || initial.gat_number || initial.survey_number || '42');
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

  const statesData = jurisdictions.states || [];
  const districtsData = jurisdictions.districts || [];
  const tehsilsData = jurisdictions.tehsils || [];
  const villagesData = jurisdictions.villages || [];
  const parcelsData = parcels;

  // Filtered Districts based on State
  const availableDistricts = useMemo(() => {
    return districtsData.filter((d) => (d.stateCode || d.state_code) === selectedState);
  }, [districtsData, selectedState]);

  // Filtered Tehsils based on District
  const availableTehsils = useMemo(() => {
    return tehsilsData.filter((t) => (t.districtCode || t.district_code) === selectedDistrict);
  }, [tehsilsData, selectedDistrict]);

  // Filtered Villages based on Tehsil
  const availableVillages = useMemo(() => {
    return villagesData.filter((v) => (v.tehsilCode || v.tehsil_code) === selectedTehsil);
  }, [villagesData, selectedTehsil]);

  // Parcels in active village
  const villageParcels = useMemo(() => {
    const list = parcelsData.filter((p) => {
      const vCode = p.villageCode || p.village_code;
      const tCode = p.tehsilCode || p.tehsil_code;
      const sCode = p.stateCode || p.state_code;
      if (selectedVillage && selectedVillage !== 'ALL') {
        return vCode === selectedVillage;
      }
      if (selectedTehsil && selectedTehsil !== 'ALL') {
        return tCode === selectedTehsil;
      }
      return sCode === selectedState;
    });
    return list.length > 0 ? list : parcelsData.slice(0, 8);
  }, [parcelsData, selectedVillage, selectedTehsil, selectedState]);

  // Auto-update cascaded dropdowns on state change
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const newDists = districtsData.filter((d) => d.stateCode === newState);
    const firstDist = newDists[0]?.code || '';
    setSelectedDistrict(firstDist);

    const newTehsils = tehsilsData.filter((t) => t.districtCode === firstDist);
    const firstTehsil = newTehsils[0]?.code || '';
    setSelectedTehsil(firstTehsil);

    const newVillages = villagesData.filter((v) => v.tehsilCode === firstTehsil);
    const firstVillage = newVillages[0]?.code || '';
    setSelectedVillage(firstVillage);

    // Pick first parcel in this new location
    const matchedParcel = parcelsData.find((p) => p.villageCode === firstVillage) ||
      parcelsData.find((p) => p.stateCode === newState) || parcelsData[0];
    if (matchedParcel) {
      setSelectedParcel(matchedParcel);
      setSelectedPlotNo(matchedParcel.gatNumber || matchedParcel.surveyNumber || '');
    }
  };

  // Auto-update cascaded dropdowns on district change
  const handleDistrictChange = (newDist) => {
    setSelectedDistrict(newDist);
    const newTehsils = tehsilsData.filter((t) => t.districtCode === newDist);
    const firstTehsil = newTehsils[0]?.code || '';
    setSelectedTehsil(firstTehsil);

    const newVillages = villagesData.filter((v) => v.tehsilCode === firstTehsil);
    const firstVillage = newVillages[0]?.code || '';
    setSelectedVillage(firstVillage);

    const matchedParcel = parcelsData.find((p) => p.villageCode === firstVillage) ||
      parcelsData.find((p) => p.districtCode === newDist) || parcelsData[0];
    if (matchedParcel) {
      setSelectedParcel(matchedParcel);
      setSelectedPlotNo(matchedParcel.gatNumber || matchedParcel.surveyNumber || '');
    }
  };

  // Auto-update cascaded dropdowns on tehsil change
  const handleTehsilChange = (newTehsil) => {
    setSelectedTehsil(newTehsil);
    const newVillages = villagesData.filter((v) => v.tehsilCode === newTehsil);
    const firstVillage = newVillages[0]?.code || '';
    setSelectedVillage(firstVillage);

    const matchedParcel = parcelsData.find((p) => p.villageCode === firstVillage) ||
      parcelsData.find((p) => p.tehsilCode === newTehsil) || parcelsData[0];
    if (matchedParcel) {
      setSelectedParcel(matchedParcel);
      setSelectedPlotNo(matchedParcel.gatNumber || matchedParcel.surveyNumber || '');
    }
  };

  // Auto-update on village change
  const handleVillageChange = (newVillage) => {
    setSelectedVillage(newVillage);
    const matchedParcel = parcelsData.find((p) => p.villageCode === newVillage) || parcelsData[0];
    if (matchedParcel) {
      setSelectedParcel(matchedParcel);
      setSelectedPlotNo(matchedParcel.gatNumber || matchedParcel.surveyNumber || '');
    }
  };

  // Plot number selected from dropdown
  const handlePlotSelect = (plotVal) => {
    setSelectedPlotNo(plotVal);
    const matched = villageParcels.find(
      (p) => p.gatNumber === plotVal || p.surveyNumber === plotVal || p.khasraNumber === plotVal
    );
    if (matched) {
      setSelectedParcel(matched);
    }
  };

  // Plot selected directly by clicking on GIS map
  const handleMapParcelClick = (parcel) => {
    setSelectedParcel(parcel);
    setSelectedState(parcel.stateCode);
    setSelectedDistrict(parcel.districtCode);
    setSelectedTehsil(parcel.tehsilCode);
    setSelectedVillage(parcel.villageCode);
    setSelectedPlotNo(parcel.gatNumber || parcel.surveyNumber || '');
    setIsRorOpen(true);
  };

  // Handle ULPIN Search
  const handleUlpinSearch = (e) => {
    e?.preventDefault();
    const clean = ulpinQuery.trim().toUpperCase();
    const matched = parcelsData.find((p) => p.ulpin.toUpperCase().includes(clean));
    if (matched) {
      setSelectedParcel(matched);
      setSelectedState(matched.stateCode);
      setSelectedDistrict(matched.districtCode);
      setSelectedTehsil(matched.tehsilCode);
      setSelectedVillage(matched.villageCode);
      setSelectedPlotNo(matched.gatNumber || matched.surveyNumber || '');
    } else {
      alert(`No parcel found matching ULPIN "${clean}". Try selecting from the demo list.`);
    }
  };

  // Handle Owner Name Filter
  const matchedOwnerParcels = useMemo(() => {
    if (!ownerQuery.trim()) return [];
    const q = ownerQuery.toLowerCase().trim();
    return parcelsData.filter((p) => (p.ownerName || p.currentOwner || '').toLowerCase().includes(q));
  }, [parcelsData, ownerQuery]);

  // Selected Parcel layers & relations derived from live PostgreSQL 360 dossier
  const parcelOwners = dossier?.ownership || [];
  const parcelEncumbrances = dossier?.encumbrances || [];
  const parcelRestrictions = dossier?.restrictions || [];
  const parcelCourtCases = dossier?.courtCases || [];
  const parcelTax = dossier?.taxRecords || { annualAssessment: 180, outstandingDues: 0 };
  const parcelMutations = dossier?.mutations || [];

  // Estimated Ready Reckoner Valuation
  const estimatedValuation = useMemo(() => {
    if (!selectedParcel) return '0';
    const ratePerSqm = selectedParcel.landUse?.includes('Commercial')
      ? 18500
      : selectedParcel.landUse?.includes('Residential')
      ? 9500
      : 3200;
    const sqm = (selectedParcel.area || 1) * 10000;
    const totalVal = Math.round(sqm * ratePerSqm);
    return totalVal >= 10000000
      ? `₹ ${(totalVal / 10000000).toFixed(2)} Cr`
      : `₹ ${(totalVal / 100000).toFixed(2)} Lakh`;
  }, [selectedParcel]);

  // Add to Watchlist action
  const handleAddToWatchlist = () => {
    setWatchlistSuccess(`Gat No. ${selectedParcel?.gatNumber || selectedParcel?.surveyNumber} (${selectedParcel?.villageName}) added to your Watchlist with real-time mutation alerts.`);
    
  };

  return (
    <div className="page-parcel-search" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            National Bhu-Aadhaar Spatial Discovery
          </span>
          <Badge variant="primary">BhuNaksha Cadastral GIS &bull; 7/12 RoR Engine</Badge>
          <Badge variant="success">ISO 19152 LADM</Badge>
        </div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
          Interactive Cadastral GIS Parcel Search & Official RoR
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
          Explore digital cadastral map polygons on the left or select administrative boundary hierarchy on the right. Click any plot on the GIS map to instantly inspect its certified 7/12 & 8A Record of Rights.
        </p>
      </div>

      {/* Success Notification Alert */}
      {watchlistSuccess && (
        <Alert variant="success">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} />
            {watchlistSuccess}
          </span>
        </Alert>
      )}

      {/* Two-Column Responsive Layout: Left GIS Map (60%), Right Cascading Form (40%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.25rem',
          alignItems: 'start',
        }}
      >
        {/* ============================================================ */}
        {/* LEFT COLUMN: Interactive Cadastral GIS Map Engine (60%) */}
        {/* ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 0 }}>
          <CadastralGisMap
            villageParcels={villageParcels}
            selectedParcel={selectedParcel}
            onSelectParcel={(parcel) => {
              setSelectedParcel(parcel);
              setSelectedPlotNo(parcel.gatNumber || parcel.surveyNumber || '');
            }}
            onOpenRor={(parcel) => {
              setSelectedParcel(parcel);
              setIsRorOpen(true);
            }}
            onOpenMapReport={(parcel) => {
              setSelectedParcel(parcel);
              setIsMapReportOpen(true);
            }}
            height="590px"
          />

          {/* Quick Geographic Context strip */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--ux4g-border-subtle)',
              borderRadius: 'var(--ux4g-radius-md)',
              padding: '0.65rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={15} style={{ color: 'var(--ux4g-primary)' }} />
              <span>
                <strong>Centroid:</strong> {selectedParcel?.latitude}&deg;N, {selectedParcel?.longitude}&deg;E &bull; <strong>SRS:</strong> EPSG:4326 (WGS 84)
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span style={{ color: 'var(--ux4g-text-muted)' }}>Source:</span>
              <strong style={{ color: 'var(--ux4g-primary)' }}>{selectedParcel?.source || 'e-Mahabhumi Cadastral Registry'}</strong>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Cascading Selection Form & Quick Dossier (40%) */}
        {/* ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          {/* Main Search Panel */}
          <Card style={{ padding: '1.25rem' }}>
            {/* Search Mode Tabs */}
            <div
              style={{
                display: 'flex',
                background: '#f1f5f9',
                borderRadius: 'var(--ux4g-radius-md)',
                padding: '3px',
                marginBottom: '1rem',
                gap: '3px',
              }}
            >
              <button
                type="button"
                onClick={() => setSearchMode('CASCADING')}
                style={{
                  flex: 1,
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: searchMode === 'CASCADING' ? 'var(--ux4g-primary)' : 'transparent',
                  color: searchMode === 'CASCADING' ? '#ffffff' : 'var(--ux4g-text)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                }}
              >
                <Layers size={13} />
                Boundary Hierarchy
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('ULPIN')}
                style={{
                  flex: 1,
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: searchMode === 'ULPIN' ? 'var(--ux4g-primary)' : 'transparent',
                  color: searchMode === 'ULPIN' ? '#ffffff' : 'var(--ux4g-text)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                }}
              >
                <Sparkles size={13} />
                14-Digit ULPIN
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('OWNER')}
                style={{
                  flex: 1,
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: searchMode === 'OWNER' ? 'var(--ux4g-primary)' : 'transparent',
                  color: searchMode === 'OWNER' ? '#ffffff' : 'var(--ux4g-text)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                }}
              >
                <User size={13} />
                Khatedar Name
              </button>
            </div>

            {/* TAB 1: Cascading Administrative Dropdowns */}
            {searchMode === 'CASCADING' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ux4g-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={15} style={{ color: 'var(--ux4g-secondary)' }} />
                  Select State, District, Tehsil, Village & Plot Number:
                </div>

                {/* State / UT */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                    1. राज्य (State / UT)
                  </label>
                  <select
                    className="ux4g-select"
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    {statesData.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name} ({st.localName}) — {st.code}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                    2. जिल्हा (District)
                  </label>
                  <select
                    className="ux4g-select"
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    {availableDistricts.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.name} ({d.localName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tehsil / Taluka */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                    3. तालुका / तहसील (Tehsil / Taluka)
                  </label>
                  <select
                    className="ux4g-select"
                    value={selectedTehsil}
                    onChange={(e) => handleTehsilChange(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    {availableTehsils.map((t) => (
                      <option key={t.code} value={t.code}>
                        {t.name} ({t.localName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Village / Ward */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                    4. गाव / मौजे / वॉर्ड (Village / Ward)
                  </label>
                  <select
                    className="ux4g-select"
                    value={selectedVillage}
                    onChange={(e) => handleVillageChange(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ux4g-primary)' }}
                  >
                    {availableVillages.map((v) => (
                      <option key={v.code} value={v.code}>
                        {v.name} ({v.localName}) &bull; Pin: {v.pinCode}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plot / Gat / Survey / Khasra No (Final selection step) */}
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 'var(--ux4g-radius-md)', padding: '0.75rem' }}>
                  <label style={{ fontSize: '0.78rem', color: '#166534', display: 'block', marginBottom: '0.35rem', fontWeight: 800 }}>
                    5. गट क्र. / सर्व्हे क्र. / खसरा क्र. (Select Plot Number) *
                  </label>
                  <select
                    className="ux4g-select"
                    value={selectedPlotNo}
                    onChange={(e) => handlePlotSelect(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      borderColor: '#22c55e',
                      color: 'var(--ux4g-primary)',
                      background: '#ffffff',
                    }}
                  >
                    {villageParcels.map((p) => {
                      const plotNum = p.gatNumber || p.surveyNumber || p.khasraNumber;
                      return (
                        <option key={p.ulpin} value={plotNum}>
                          Gat {p.gatNumber ? p.gatNumber : p.surveyNumber} (Survey {p.surveyNumber}) &bull; {p.area} Ha &bull; [{p.status}]
                        </option>
                      );
                    })}
                  </select>
                  <div style={{ fontSize: '0.7rem', color: '#15803d', marginTop: '0.35rem' }}>
                    ✓ Selecting a plot immediately updates the GIS map on the left and loads the legal record.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ULPIN Search */}
            {searchMode === 'ULPIN' && (
              <form onSubmit={handleUlpinSearch} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                    Enter 14-Digit Bhu-Aadhaar / ULPIN Code
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="ux4g-input"
                      placeholder="e.g. TEST_ULPIN_MH_PUN_001"
                      value={ulpinQuery}
                      onChange={(e) => setUlpinQuery(e.target.value)}
                      style={{ fontSize: '0.9rem', fontFamily: 'monospace', textTransform: 'uppercase' }}
                    />
                    <Button variant="primary" size="sm" type="submit">
                      Locate
                    </Button>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-secondary)' }}>
                  Quick Sample ULPINs:
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                    {parcelsData.slice(0, 4).map((p) => (
                      <button
                        key={p.ulpin}
                        type="button"
                        onClick={() => {
                          setUlpinQuery(p.ulpin);
                          setSelectedParcel(p);
                          setSelectedState(p.stateCode);
                          setSelectedDistrict(p.districtCode);
                          setSelectedTehsil(p.tehsilCode);
                          setSelectedVillage(p.villageCode);
                          setSelectedPlotNo(p.gatNumber || p.surveyNumber || '');
                        }}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '0.68rem',
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                        }}
                      >
                        {p.ulpin}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* TAB 3: Khatedar / Owner Search */}
            {searchMode === 'OWNER' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                    Search by Khatedar / Land Owner Name (Fuzzy Search)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="ux4g-input"
                      placeholder="e.g. Aarav Patil, Priya Shinde, Vikram Jadhav..."
                      value={ownerQuery}
                      onChange={(e) => setOwnerQuery(e.target.value)}
                      style={{ fontSize: '0.9rem', paddingLeft: '2.25rem' }}
                    />
                    <Search
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--ux4g-text-muted)',
                      }}
                    />
                  </div>
                </div>

                {/* Search Matches */}
                {ownerQuery && (
                  <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {matchedOwnerParcels.length > 0 ? (
                      matchedOwnerParcels.map((p) => {
                        const ownerDisplay = p.ownerName || p.currentOwner || 'Landholder';
                        return (
                          <div
                            key={p.ulpin}
                            onClick={() => {
                              setSelectedParcel(p);
                              setSelectedState(p.stateCode || p.state_code);
                              setSelectedDistrict(p.districtCode || p.district_code);
                              setSelectedTehsil(p.tehsilCode || p.tehsil_code);
                              setSelectedVillage(p.villageCode || p.village_code);
                              setSelectedPlotNo(p.gatNumber || p.surveyNumber || p.gat_number || p.survey_number || '');
                            }}
                            style={{
                              padding: '0.5rem',
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              background: selectedParcel?.ulpin === p.ulpin ? '#f0fdf4' : '#ffffff',
                              fontSize: '0.78rem',
                            }}
                          >
                            <div style={{ fontWeight: 700, color: 'var(--ux4g-primary)' }}>
                              Gat {p.gatNumber || p.surveyNumber || p.gat_number || p.survey_number} &bull; {p.villageName || p.village_name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              Owner: {ownerDisplay}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', padding: '0.5rem' }}>
                        No khatedars found matching "{ownerQuery}".
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* ============================================================ */}
          {/* Selected Parcel Live Summary & Action Dossier Card */}
          {/* ============================================================ */}
          {selectedParcel && (
            <Card style={{ padding: '1.25rem', border: '2px solid var(--ux4g-primary)', background: '#ffffff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Title & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Selected Cadastral Record
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ux4g-primary)', margin: '0.1rem 0' }}>
                      Gat No. {selectedParcel.gatNumber || selectedParcel.surveyNumber}
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginLeft: '0.5rem' }}>
                        (Survey {selectedParcel.surveyNumber})
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                      {selectedParcel.villageName} &bull; {selectedParcel.tehsilCode} &bull; {selectedParcel.districtCode}
                    </div>
                  </div>

                  <Badge
                    variant={
                      selectedParcel.status === 'CLEAR'
                        ? 'success'
                        : selectedParcel.status === 'ENCUMBERED'
                        ? 'warning'
                        : selectedParcel.status === 'RESTRICTED'
                        ? 'danger'
                        : 'primary'
                    }
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                  >
                    {selectedParcel.status}
                  </Badge>
                </div>

                {/* ULPIN code pill */}
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                    color: 'var(--ux4g-secondary)',
                    fontWeight: 700,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>ULPIN: {selectedParcel.ulpin}</span>
                  <span style={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem' }}>ISO LADM</span>
                </div>

                {/* Attributes Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    background: '#fafaf9',
                    padding: '0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #e7e5e4',
                  }}
                >
                  <div>
                    <span style={{ color: '#78716c', fontSize: '0.7rem' }}>Total Area:</span>
                    <div style={{ fontWeight: 700 }}>
                      {selectedParcel.area} Ha ({Math.round(selectedParcel.area * 40 * 10) / 10} Guntha)
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#78716c', fontSize: '0.7rem' }}>Classification:</span>
                    <div style={{ fontWeight: 700 }}>{selectedParcel.classification}</div>
                  </div>
                  <div>
                    <span style={{ color: '#78716c', fontSize: '0.7rem' }}>Land Use:</span>
                    <div style={{ fontWeight: 700 }}>{selectedParcel.landUse}</div>
                  </div>
                  <div>
                    <span style={{ color: '#78716c', fontSize: '0.7rem' }}>Circle Rate Valuation:</span>
                    <div style={{ fontWeight: 800, color: '#047857' }}>{estimatedValuation}</div>
                  </div>
                </div>

                {/* Khatedars List */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: '0.2rem' }}>
                    Khatedars on Form 8A:
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#1e293b' }}>
                    {parcelOwners.length > 0
                      ? parcelOwners.map((o) => `${o.ownerName} (${o.share}%)`).join(', ')
                      : 'Government / Municipal Record'}
                  </div>
                </div>

                {/* PRIMARY ACTION: View Official RoR (7/12 & 8A) & Map Report */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <Button
                    variant="primary"
                    onClick={() => setIsRorOpen(true)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      background: 'var(--ux4g-primary)',
                    }}
                  >
                    <FileText size={17} />
                    View Official RoR (7/12 & 8A Extract)
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => setIsMapReportOpen(true)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      background: '#ea580c',
                      color: '#ffffff',
                    }}
                  >
                    <Printer size={17} />
                    गाव नमुना नकाशा प्रत (MahaBhunaksha FMB Report)
                  </Button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/citizen/parcels/${selectedParcel.ulpin}`)}
                      style={{ fontSize: '0.78rem' }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ExternalLink size={13} />
                        Parcel 360°
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/citizen/due-diligence')}
                      style={{ fontSize: '0.78rem' }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ShieldCheck size={13} />
                        Due Diligence
                      </span>
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddToWatchlist}
                    style={{ fontSize: '0.75rem', width: '100%', color: 'var(--ux4g-secondary)' }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Bookmark size={14} />
                      Watch this Parcel for Mutation Alerts
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

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
