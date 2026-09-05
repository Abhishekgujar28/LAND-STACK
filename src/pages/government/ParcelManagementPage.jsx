import React, { useState } from 'react';
import parcelsData from '../../data/parcels/parcels.json';
import ownershipData from '../../data/parcels/ownership.json';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import RorModal from '../../components/citizen/RorModal';
import {
  MapPin,
  FileText,
  Search,
  Filter,
  Layers,
  CheckCircle2,
  ExternalLink,
  Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ParcelManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [inspectedParcel, setInspectedParcel] = useState(null);
  const [isRorOpen, setIsRorOpen] = useState(false);

  const filteredParcels = parcelsData.filter((p) => {
    if (filterType !== 'ALL' && p.landUse !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.ulpin?.toLowerCase().includes(q) ||
        p.surveyNumber?.toLowerCase().includes(q) ||
        p.village?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q)
      );
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
          owners={ownershipData.filter((o) => o.parcelId === inspectedParcel.ulpin)}
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
            <MapPin size={22} />
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
              Cadastral Parcel Directory & Bhu-Aadhaar (ULPIN) Register
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
              Authoritative spatial land parcel inventory with digitized boundaries and 7/12 RoR records.
            </p>
          </div>
        </div>

        <Link to="/government/map" className="ux4g-btn ux4g-btn-sm" style={{ backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700 }}>
          Open in Cadastral GIS &rarr;
        </Link>
      </div>

      {/* Filters & Search */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`ux4g-btn ux4g-btn-sm ${filterType === 'ALL' ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              onClick={() => setFilterType('ALL')}
              style={{ backgroundColor: filterType === 'ALL' ? '#064e3b' : undefined }}
            >
              All Parcels ({parcelsData.length})
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
                    <strong>Survey {parcel.surveyNumber}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Gat {parcel.subDivisionNumber || parcel.surveyNumber}</div>
                  </td>
                  <td>
                    <div>{parcel.village}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{parcel.tehsil}, {parcel.district}</div>
                  </td>
                  <td>
                    <Badge variant={parcel.landUse === 'AGRICULTURAL' ? 'success' : 'info'}>
                      {parcel.landUse || 'Agricultural'}
                    </Badge>
                  </td>
                  <td>
                    <strong>{parcel.area} {parcel.areaUnit || 'Ha'}</strong>
                  </td>
                  <td>
                    <Badge variant="success">
                      ✓ Vectorized (BhuNaksha)
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
                        to="/government/map"
                        className="ux4g-btn ux4g-btn-sm ux4g-btn-ghost"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Layers size={13} />
                        <span>GIS</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ParcelManagementPage;
