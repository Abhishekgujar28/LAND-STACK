import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import RorModal from '../../components/citizen/RorModal';
import parcelService from '../../services/parcelService';
import {
  Layers,
  MapPin,
  Search,
  Filter,
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export const ParcelManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [inspectedParcel, setInspectedParcel] = useState(null);
  const [isRorOpen, setIsRorOpen] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    parcelService.getParcels({ search: searchQuery, limit: 50 })
      .then((data) => {
        if (!isMounted) return;
        setParcels(Array.isArray(data) ? data : (data?.data || []));
      })
      .catch((err) => {
        console.warn('Failed to load parcels:', err.message);
        if (isMounted) setErrorMsg(err.message || 'Unable to load parcels from database.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [searchQuery]);

  const filteredParcels = parcels.filter((p) => {
    if (filterType !== 'ALL') {
      const landUse = (p.landUse || p.land_use || '').toUpperCase();
      if (!landUse.includes(filterType)) return false;
    }
    return true;
  });

  const handleOpenRor = (parcel) => {
    setInspectedParcel(parcel);
    setIsRorOpen(true);
  };

  return (
    <div className="page-parcel-management" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* RoR Modal */}
      {isRorOpen && inspectedParcel && (
        <RorModal
          isOpen={isRorOpen}
          onClose={() => setIsRorOpen(false)}
          parcel={inspectedParcel}
          owners={[]}
        />
      )}

      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #033628 50%, #022319 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(6, 78, 59, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fef08a',
            }}
          >
            <Compass size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Cadastral Parcel Registry &amp; Bhu-Aadhaar Ledger
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Authoritative 14-digit standard ULPIN cadastral boundaries &amp; Section 8A revenue holding records.
            </p>
          </div>
        </div>

        <Badge variant="secondary" style={{ backgroundColor: '#ea580c', color: '#ffffff', border: 'none' }}>
          {filteredParcels.length} PARCELS REGISTERED
        </Badge>
      </div>

      {errorMsg && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem' }}>
          <strong>Notice:</strong> {errorMsg}
        </div>
      )}

      {/* Filters & Search */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`ux4g-btn ux4g-btn-sm ${filterType === 'ALL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setFilterType('ALL')}
              style={{ backgroundColor: filterType === 'ALL' ? '#064e3b' : undefined }}
            >
              All Parcels ({parcels.length})
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${filterType === 'AGRICULTURAL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setFilterType('AGRICULTURAL')}
              style={{ backgroundColor: filterType === 'AGRICULTURAL' ? '#064e3b' : undefined }}
            >
              Agricultural
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${filterType === 'RESIDENTIAL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setFilterType('RESIDENTIAL')}
              style={{ backgroundColor: filterType === 'RESIDENTIAL' ? '#064e3b' : undefined }}
            >
              Residential NA
            </button>
            <button
              className={`ux4g-btn ux4g-btn-sm ${filterType === 'COMMERCIAL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setFilterType('COMMERCIAL')}
              style={{ backgroundColor: filterType === 'COMMERCIAL' ? '#064e3b' : undefined }}
            >
              Commercial NA
            </button>
          </div>

          <input
            type="text"
            className="ux4g-input"
            placeholder="Search by ULPIN, Survey No, Village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '280px', height: '34px' }}
          />
        </div>
      </Card>

      {/* Parcels Table */}
      <Card>
        <div className="ux4g-table-wrapper">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Loading cadastral parcels from database...</p>
            </div>
          ) : filteredParcels.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '1rem' }}>No parcels found</p>
              <span style={{ fontSize: '0.85rem' }}>No parcel records matched your search query in the current jurisdiction.</span>
            </div>
          ) : (
            <table className="ux4g-table">
              <thead>
                <tr>
                  <th>Bhu-Aadhaar (ULPIN)</th>
                  <th>Survey / Gat No.</th>
                  <th>Jurisdiction</th>
                  <th>Land Classification</th>
                  <th>Total Area</th>
                  <th>Spatial Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParcels.map((parcel) => (
                  <tr key={parcel.id || parcel.ulpin}>
                    <td>
                      <code style={{ fontWeight: 800, color: '#064e3b' }}>{parcel.ulpin}</code>
                    </td>
                    <td>
                      <strong>Survey {parcel.surveyNumber || parcel.survey_number || 'N/A'}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                        Gat {parcel.gatNumber || parcel.gat_number || parcel.subDivisionNumber || '42'}
                      </div>
                    </td>
                    <td>
                      <div>{parcel.villageName || parcel.village_name || parcel.village || 'Wagholi'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                        {parcel.tehsilName || parcel.tehsil_name || 'Haveli'}, {parcel.districtName || parcel.district_name || 'Pune'}
                      </div>
                    </td>
                    <td>
                      <Badge variant={(parcel.landUse || parcel.land_use || '').includes('AGRICULT') ? 'success' : 'info'}>
                        {parcel.landUse || parcel.land_use || 'Agricultural'}
                      </Badge>
                    </td>
                    <td>
                      <strong>{parcel.area} {parcel.areaUnit || parcel.area_unit || 'Ha'}</strong>
                    </td>
                    <td>
                      <Badge variant="success">
                        ✓ Vectorized (PostGIS)
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRor(parcel)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <FileText size={13} />
                          <span>7/12 RoR</span>
                        </Button>
                        <Link
                          to={`/citizen/parcels/${parcel.ulpin}`}
                          className="ux4g-btn ux4g-btn-sm ux4g-btn-ghost"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Layers size={13} />
                          <span>360°</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ParcelManagementPage;
