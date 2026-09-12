/**
 * GIS_mapping/CitizenMappingPage.jsx
 *
 * Top-level Citizen GIS Cadastral Mapping Dashboard page per SIH_26014 Version 2.
 * Matches the reference screenshot:
 *   - Breadcrumbs: Home > Citizen Portal > Mapping
 *   - Eyebrow: CITIZEN LAND SERVICES
 *   - Title: Explore Your Land on Cadastral Map
 *   - Subtitle: Search by ULPIN, Survey No., Gat No., village or location to view accurate parcel map, land records and available services.
 *   - SearchBar with Search & Use My Location buttons + quick search chips
 *   - Main Two-Column Layout: Cadastral Map (65-70%) | Parcel Info Panel (30-35%)
 *   - Bottom 3 Cards:
 *       1. Parcel Snapshot (Total Area, Record Status, Land Use, Last Updated, Classification)
 *       2. Location & Context (Village Wagholi, Tehsil Haveli, District Pune, State Maharashtra)
 *       3. Map Reference (Satellite Imagery reference thumbnail with parcel overlay)
 *
 * Preserves existing CitizenHeader, CitizenSidebar, and CitizenLayout intact.
 */

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Navigation,
  Compass,
  Home,
  ChevronRight,
  Layers,
  FileText,
} from 'lucide-react';

import SearchBar from './components/SearchBar.jsx';
import CitizenMappingMap from './components/CitizenMappingMap.jsx';
import ParcelInfoPanel from './components/ParcelInfoPanel.jsx';
import ResurveyModal from './components/ResurveyModal.jsx';
import ReportIssueModal from './components/ReportIssueModal.jsx';

import { resolveParcelSearch, getMyLandParcels } from './services/parcelResolver.js';
import { getParcelByULPIN } from './data/cadastralParcels.js';
import RorModal from '../frontend/src/components/citizen/RorModal.jsx';
import MapReportModal from '../frontend/src/components/government/MapReportModal.jsx';
import LandDetailPopup from './components/LandDetailPopup.jsx';

const CitizenMappingPage = () => {
  const [selectedParcel, setSelectedParcel] = useState(() =>
    getParcelByULPIN('ULPIN-MH-PUN-000001')
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMsg, setSearchMsg] = useState('');
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isRorOpen, setIsRorOpen] = useState(false);
  const [isMapReportOpen, setIsMapReportOpen] = useState(false);
  const [isResurveyOpen, setIsResurveyOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // ── Search handler ──────────────────────────────────────────────────────────
  const handleSearch = useCallback((query) => {
    setSearchLoading(true);
    setSearchMsg('');

    setTimeout(() => {
      const { parcels } = resolveParcelSearch(query);
      setSearchLoading(false);

      if (parcels.length === 0) {
        setSearchMsg(
          `No land parcel found for "${query}". Try searching with ULPIN, Survey Number (e.g. 104), Gat Number (e.g. 42), or Village (Wagholi).`
        );
        return;
      }

      setSelectedParcel(parcels[0]);
      setSearchMsg('');
    }, 250);
  }, []);

  // ── My Location handler ─────────────────────────────────────────────────────
  const handleMyLocation = () => {
    const focal = getParcelByULPIN('ULPIN-MH-PUN-000001');
    if (focal) setSelectedParcel(focal);
  };

  const p = selectedParcel?.properties || {};

  // Build parcel object for RorModal compatibility
  const rorParcel = selectedParcel
    ? {
        ulpin: p.ulpin,
        surveyNumber: p.survey_number,
        gatNumber: p.gat_number,
        villageName: p.village_name || 'Wagholi',
        area: p.area,
        landUse: p.land_use,
        status: p.status,
        latitude: 18.5793,
        longitude: 73.9812,
        taluka: p.tehsil || 'Haveli',
        district: p.district || 'Pune',
        state: p.state || 'Maharashtra',
      }
    : null;

  return (
    <div
      className="citizen-mapping-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '0 0.5rem',
      }}
    >
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#0f766e',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <MapPin size={12} />
          <span>CITIZEN LAND SERVICES</span>
        </div>
        <h1
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#064e3b',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Explore Your Land on Cadastral Map
        </h1>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: 0,
          }}
        >
          Search by ULPIN, Survey No., Gat No., village or location to view
          accurate parcel map, land records and available services.
        </p>
      </div>

      {/* ── Search Bar & Recent Searches Chips ─────────────────────────────── */}
      <SearchBar
        onSearch={handleSearch}
        onMyLocation={handleMyLocation}
        isLoading={searchLoading}
      />

      {/* Search Error Message */}
      {searchMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '8px',
            color: '#b45309',
            fontSize: '0.85rem',
          }}
        >
          <AlertCircle size={15} />
          <span>{searchMsg}</span>
        </div>
      )}

      {/* ── Main Two-Column Cadastral Layout ───────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 68%) minmax(0, 32%)',
          gap: '1.25rem',
          alignItems: 'stretch',
        }}
        className="mapping-main-grid"
      >
        {/* Left: Large Cadastral Map */}
        <div style={{ minWidth: 0 }}>
          <CitizenMappingMap
            selectedParcel={selectedParcel}
            onSelectParcel={(parcel) => {
              setSelectedParcel(parcel);
              setIsDetailPopupOpen(true);
            }}
            onOpenDetailPopup={(parcel) => {
              if (parcel) setSelectedParcel(parcel);
              setIsDetailPopupOpen(true);
            }}
            onOpenRor={() => setIsRorOpen(true)}
            onOpenMapReport={() => setIsMapReportOpen(true)}
            height="550px"
          />
        </div>

        {/* Right: Selected Parcel Information Panel */}
        <div style={{ minWidth: 0 }}>
          {selectedParcel ? (
            <ParcelInfoPanel
              parcel={selectedParcel}
              onClose={() => setSelectedParcel(null)}
              onOpenDetailPopup={() => setIsDetailPopupOpen(true)}
              onOpenRor={() => setIsRorOpen(true)}
              onApplyResurvey={() => setIsResurveyOpen(true)}
              onReportIssue={() => setIsReportOpen(true)}
            />
          ) : (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <MapPin size={36} color="#0f766e" />
              <h3 style={{ margin: '0.75rem 0 0.25rem', color: '#1e293b' }}>
                Select a Land Parcel
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.825rem', margin: 0 }}>
                Click any plot on the Cadastral Map or use the search bar above.
              </p>
              <button
                type="button"
                onClick={() => {
                  const focal = getParcelByULPIN('ULPIN-MH-PUN-000001');
                  setSelectedParcel(focal);
                  setIsDetailPopupOpen(true);
                }}
                style={{
                  marginTop: '1rem',
                  padding: '8px 16px',
                  backgroundColor: '#064e3b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                View Gat 42 (Aarav Patil)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom 3 Cards Row (Matching Screenshot) ───────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: '1.25rem',
        }}
        className="mapping-bottom-cards-grid"
      >
        {/* Card 1: Parcel Snapshot */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 18px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f766e',
              marginBottom: '14px',
            }}
          >
            <Layers size={16} />
            <span>Parcel Snapshot</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '0.825rem',
            }}
          >
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Total Area
              </div>
              <strong style={{ color: '#1e293b' }}>
                {p.area || '1.45'} Ha ({p.area_local || '58 Guntha'})
              </strong>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Record Status
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#15803d',
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={13} />
                <span>Clear Title</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                No active disputes
              </div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Land Use
              </div>
              <strong style={{ color: '#1e293b' }}>
                {p.land_use || 'Agricultural'}
              </strong>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Last Updated
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#334155',
                  fontWeight: 600,
                }}
              >
                <Clock size={12} color="#64748b" />
                <span>12 Aug 2024</span>
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Classification
              </div>
              <strong style={{ color: '#1e293b' }}>
                {p.classification || 'Jirayat'}
              </strong>
            </div>
          </div>
        </div>

        {/* Card 2: Location & Context */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 18px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f766e',
              marginBottom: '14px',
            }}
          >
            <MapPin size={16} />
            <span>Location &amp; Context</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '0.825rem',
            }}
          >
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Village</div>
              <strong style={{ color: '#1e293b' }}>
                {p.village_name || 'Wagholi'}
              </strong>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Tehsil</div>
              <strong style={{ color: '#1e293b' }}>
                {p.tehsil || 'Haveli'}
              </strong>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>District</div>
              <strong style={{ color: '#1e293b' }}>
                {p.district || 'Pune'}
              </strong>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>State</div>
              <strong style={{ color: '#1e293b' }}>
                {p.state || 'Maharashtra'}
              </strong>
            </div>
          </div>
        </div>

        {/* Card 3: Map Reference */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 18px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f766e',
              marginBottom: '10px',
            }}
          >
            <Compass size={16} />
            <span>Map Reference</span>
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              flex: 1,
              minHeight: '120px',
              border: '1px solid #cbd5e1',
            }}
          >
            {/* Satellite Background Preview */}
            <img
              src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/58249/95252"
              alt="Satellite Reference"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                // Fallback gradient if tile unavailable
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Overlay polygon pin */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(6, 78, 59, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                  }}
                />
                <span>Satellite Reference (Wagholi)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals & Popups ─────────────────────────────────────────────────── */}
      <LandDetailPopup
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        parcel={selectedParcel}
        onOpenRor={() => {
          setIsDetailPopupOpen(false);
          setIsRorOpen(true);
        }}
        onOpenMapReport={() => {
          setIsDetailPopupOpen(false);
          setIsMapReportOpen(true);
        }}
        onApplyResurvey={() => {
          setIsDetailPopupOpen(false);
          setIsResurveyOpen(true);
        }}
        onReportIssue={() => {
          setIsDetailPopupOpen(false);
          setIsReportOpen(true);
        }}
      />

      {isRorOpen && (
        <RorModal
          isOpen={isRorOpen}
          onClose={() => setIsRorOpen(false)}
          parcel={rorParcel}
        />
      )}

      {isMapReportOpen && (
        <MapReportModal
          isOpen={isMapReportOpen}
          onClose={() => setIsMapReportOpen(false)}
          parcel={rorParcel}
        />
      )}

      <ResurveyModal
        isOpen={isResurveyOpen}
        onClose={() => setIsResurveyOpen(false)}
        parcel={selectedParcel}
      />

      <ReportIssueModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        parcel={selectedParcel}
      />
    </div>
  );
};

export default CitizenMappingPage;
