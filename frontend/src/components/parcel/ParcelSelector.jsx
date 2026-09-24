import React, { useState, useEffect } from 'react';
import { Layers, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';
import citizenService from '../../services/citizenService';
import parcelService from '../../services/parcelService';
import Badge from '../ui/Badge';

/**
 * Reusable Production Parcel Selector
 * 
 * Strict compliance with Section 8:
 * - Works from actual API data
 * - Citizen: loads authenticated citizen's parcels (Form 8A / ownership_records)
 * - Government: loads parcels permitted by officer's jurisdiction
 * - Standardized display: Gat 42 • ULPIN • Village • Area • Land use • Status
 * - Automatically provides rich parcel object to caller on selection
 */
export const ParcelSelector = ({
  value = '',
  onChange = () => {},
  portal = 'citizen', // 'citizen' | 'government'
  jurisdiction = null,
  parcels: propParcels = null,
  required = true,
  label = 'Select Registered Land Parcel (ULPIN)',
  helperText = 'Select from verified landholdings recorded in the official cadastral database',
}) => {
  const [parcels, setParcels] = useState(propParcels || []);
  const [loading, setLoading] = useState(!propParcels);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (propParcels) {
      setParcels(propParcels);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setFetchError(null);

    const fetcher = portal === 'government'
      ? parcelService.getParcels(jurisdiction ? { ...jurisdiction } : { limit: 50 })
      : citizenService.getMyParcels();

    fetcher
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
        setParcels(list);
      })
      .catch((err) => {
        console.warn('[ParcelSelector] Error loading parcels:', err);
        if (isMounted) {
          setFetchError(err.message || 'Failed to load parcels from database.');
          setParcels([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [portal, jurisdiction, propParcels]);

  const selectedParcel = parcels.find((p) => p.ulpin === value) || null;

  const handleSelectChange = (e) => {
    const ulpin = e.target.value;
    const found = parcels.find((p) => p.ulpin === ulpin) || null;
    onChange(ulpin, found);
  };

  return (
    <div className="parcel-selector-component" style={{ marginBottom: '1.25rem' }}>
      <label className={`ux4g-label ${required ? 'ux4g-label-required' : ''}`} style={{ fontWeight: 700 }}>
        {label}
      </label>

      {loading ? (
        <div style={{ padding: '0.65rem', color: '#64748b', fontSize: '0.85rem' }}>
          Loading authoritative landholdings from database...
        </div>
      ) : fetchError ? (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#b91c1c',
            fontSize: '0.85rem',
          }}
        >
          {fetchError}
        </div>
      ) : parcels.length === 0 ? (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#64748b',
            fontSize: '0.85rem',
          }}
        >
          {portal === 'government'
            ? 'No parcels found within the specified jurisdiction.'
            : 'No registered landholdings found linked to your citizen account.'}
        </div>
      ) : (
        <>
          <select
            className="ux4g-select"
            value={value}
            onChange={handleSelectChange}
            required={required}
            style={{ width: '100%' }}
          >
            <option value="">-- Select Land Parcel --</option>
            {parcels.map((p) => {
              const gat = p.gatNumber || p.gat_number || p.surveyNumber || p.survey_number || p.ctsNumber || p.cts_number || 'N/A';
              const village = p.villageName || p.village_name || p.village || 'Village';
              const area = p.area ? `${p.area} ${p.areaUnit || p.area_unit || 'Ha'}` : 'N/A';
              const landUse = p.landUse || p.land_use || 'Agricultural';
              const status = p.status || 'CLEAR';
              return (
                <option key={p.ulpin || p.id} value={p.ulpin}>
                  Gat {gat} &bull; {p.ulpin} &bull; {village} &bull; {area} &bull; {landUse} &bull; {status}
                </option>
              );
            })}
          </select>

          {helperText && (
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {helperText}
            </div>
          )}

          {/* Selected Parcel Structured Summary Card */}
          {selectedParcel && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.85rem 1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.65rem',
                fontSize: '0.8rem',
              }}
            >
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Gat / Survey / CTS:</span>
                <strong>Gat {selectedParcel.gatNumber || selectedParcel.gat_number || selectedParcel.surveyNumber || selectedParcel.survey_number || selectedParcel.cts_number}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>ULPIN Identifier:</span>
                <code style={{ fontSize: '0.75rem', color: 'var(--ux4g-primary, #064e3b)' }}>{selectedParcel.ulpin}</code>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Village &amp; Tehsil:</span>
                <strong>{selectedParcel.villageName || selectedParcel.village_name || selectedParcel.village || 'Wagholi'}, {selectedParcel.tehsilCode || selectedParcel.tehsil_code || selectedParcel.tehsil || 'Haveli'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Area:</span>
                <strong>{selectedParcel.area} {selectedParcel.areaUnit || selectedParcel.area_unit || 'Ha'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Land Use / Class:</span>
                <strong>{selectedParcel.classification || 'Jirayat'} ({selectedParcel.landUse || selectedParcel.land_use || 'Agricultural'})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Title Status:</span>
                <Badge variant={selectedParcel.status === 'CLEAR' ? 'success' : 'warning'}>
                  {selectedParcel.status || 'CLEAR'}
                </Badge>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ParcelSelector;
