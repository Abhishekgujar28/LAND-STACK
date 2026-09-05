import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import parcelsData from '../../data/parcels/parcels.json';
import ownershipData from '../../data/parcels/ownership.json';
import statesData from '../../data/jurisdictions/states.json';
import districtsData from '../../data/jurisdictions/districts.json';
import tehsilsData from '../../data/jurisdictions/tehsils.json';
import villagesData from '../../data/jurisdictions/villages.json';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ParcelCard from '../../components/citizen/ParcelCard';

export const ParcelSearchPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedTehsil, setSelectedTehsil] = useState('ALL');
  const [selectedLandUse, setSelectedLandUse] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filtered parcels
  const filteredParcels = useMemo(() => {
    return parcelsData.filter((parcel) => {
      // Find matching owners
      const parcelOwners = ownershipData
        .filter((o) => o.parcelId === parcel.ulpin)
        .map((o) => o.ownerName.toLowerCase());

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        parcel.ulpin.toLowerCase().includes(q) ||
        (parcel.gatNumber && parcel.gatNumber.toLowerCase().includes(q)) ||
        (parcel.surveyNumber && parcel.surveyNumber.toLowerCase().includes(q)) ||
        (parcel.khasraNumber && parcel.khasraNumber.toLowerCase().includes(q)) ||
        (parcel.ctsNumber && parcel.ctsNumber.toLowerCase().includes(q)) ||
        parcel.villageName.toLowerCase().includes(q) ||
        parcelOwners.some((name) => name.includes(q));

      const matchesState = selectedState === 'ALL' || parcel.stateCode === selectedState;
      const matchesTehsil = selectedTehsil === 'ALL' || parcel.tehsilCode === selectedTehsil;
      const matchesLandUse =
        selectedLandUse === 'ALL' ||
        parcel.landUse.toLowerCase().includes(selectedLandUse.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || parcel.status === selectedStatus;

      return matchesQuery && matchesState && matchesTehsil && matchesLandUse && matchesStatus;
    });
  }, [searchQuery, selectedState, selectedTehsil, selectedLandUse, selectedStatus]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedState('ALL');
    setSelectedTehsil('ALL');
    setSelectedLandUse('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="page-parcel-search" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase' }}>
            National Bhu-Aadhaar Cadastral Search
          </span>
          <Badge variant="primary">ISO 19152 LADM</Badge>
        </div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0 }}>
          Search Land Records by ULPIN / Gat / Owner
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
          Search authoritative cadastral parcels across Maharashtra and Rajasthan with instant 360&deg; composite title cross-checks.
        </p>
      </div>

      {/* Search & Filter Card */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Search Input */}
          <div className="ux4g-form-group" style={{ margin: 0 }}>
            <label className="ux4g-label">
              Search by ULPIN (14-digit), Survey No, Gat No, Khasra No, CTS No, Village, or Khatedar Name
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="ux4g-input"
                placeholder="e.g. ULPIN-MH-PUN-000001, Gat 42, Wagholi, Aarav Patil, Hinjawadi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.95rem' }}
              />
              {searchQuery && (
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--ux4g-border-subtle)',
            }}
          >
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                State / UT
              </label>
              <select
                className="ux4g-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="ALL">All States (MH, RJ)</option>
                <option value="MH">Maharashtra (MH)</option>
                <option value="RJ">Rajasthan (RJ)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Tehsil / Taluka
              </label>
              <select
                className="ux4g-select"
                value={selectedTehsil}
                onChange={(e) => setSelectedTehsil(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Tehsils</option>
                <option value="TEH-HAV">Haveli (Pune)</option>
                <option value="TEH-MUL">Mulshi (Pune)</option>
                <option value="TEH-MAW">Mawal (Pune)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Land Use
              </label>
              <select
                className="ux4g-select"
                value={selectedLandUse}
                onChange={(e) => setSelectedLandUse(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Land Uses</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Residential">Residential (NA)</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Legal & Title Status
              </label>
              <select
                className="ux4g-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="CLEAR">CLEAR (No Liabilities)</option>
                <option value="ENCUMBERED">ENCUMBERED (Bank Charge)</option>
                <option value="RESTRICTED">RESTRICTED (Govt / Tribal)</option>
                <option value="DISPUTED">DISPUTED (Court Case)</option>
                <option value="UNDER_VERIFICATION">UNDER VERIFICATION</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button variant="outline" size="sm" onClick={handleReset} style={{ width: '100%' }}>
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--ux4g-primary)' }}>
            Search Results ({filteredParcels.length} Parcels Found)
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
            Showing cadastral records matching active filters
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredParcels.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--ux4g-primary)' }}>No Matching Cadastral Parcels Found</h3>
          <p style={{ color: 'var(--ux4g-text-secondary)', maxWidth: '450px', margin: '0 auto 1.25rem', fontSize: '0.9rem' }}>
            We could not find any land parcels matching "{searchQuery}". Try searching with a different ULPIN or village name.
          </p>
          <Button variant="primary" size="sm" onClick={handleReset}>
            Clear Search & Filters
          </Button>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredParcels.map((parcel) => {
            const owners = ownershipData.filter((o) => o.parcelId === parcel.ulpin);
            return (
              <div key={parcel.ulpin} style={{ display: 'flex', flexDirection: 'column' }}>
                <ParcelCard parcel={parcel} />
                {owners.length > 0 && (
                  <div
                    style={{
                      background: 'var(--ux4g-surface-muted)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0 0 var(--ux4g-radius-md) var(--ux4g-radius-md)',
                      fontSize: '0.75rem',
                      color: 'var(--ux4g-text-secondary)',
                      marginTop: '-4px',
                      border: '1px solid var(--ux4g-border-subtle)',
                      borderTop: 'none',
                    }}
                  >
                    <strong>Khatedars:</strong> {owners.map((o) => `${o.ownerName} (${o.share}%)`).join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParcelSearchPage;
