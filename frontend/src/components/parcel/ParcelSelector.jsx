import React, { useState, useEffect } from 'react';
import { Layers, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';
import citizenService from '../../services/citizenService';
import Badge from '../ui/Badge';

/**
 * Reusable Authoritative Parcel Selector
 * 
 * Conforms to Section 5 of Phase 3 specification:
 * - Loads actual authenticated citizen parcels
 * - Format: [ Gat 42 • Wagholi • 1.45 Ha (100% share) ]
 * - Renders selected parcel summary card with real cadastral attributes
 */
export const ParcelSelector = ({
  value = '',
  onChange = () => {},
  parcels: propParcels = null,
  required = true,
  label = 'Select Registered Land Parcel (ULPIN)',
  helperText = 'Select from your official 7/12 landholdings recorded in Form 8A',
}) => {
  const [parcels, setParcels] = useState(propParcels || []);
  const [loading, setLoading] = useState(!propParcels);

  useEffect(() => {
    if (propParcels) {
      setParcels(propParcels);
      setLoading(false);
      return;
    }

    let isMounted = true;
    citizenService.getMyParcels()
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          setParcels(list);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[ParcelSelector] Failed to load citizen parcels:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [propParcels]);

  const selectedParcel = parcels.find((p) => p.ulpin === value) || null;

  const handleSelectChange = (e) => {
    const ulpin = e.target.value;
    const found = parcels.find((p) => p.ulpin === ulpin) || null;
    onChange(ulpin, found);
  };

  return (
    <div className="parcel-selector-component" style={{ marginBottom: '1.25rem' }}>
      <label className={`ux4g-label ${required ? 'ux4g-label-required' : ''}`}>
        {label}
      </label>

      {loading ? (
        <div style={{ padding: '0.65rem', color: '#64748b', fontSize: '0.85rem' }}>
          Loading your verified landholdings from database...
        </div>
      ) : parcels.length === 0 ? (
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
          No registered landholdings found linked to your citizen account.
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
            <option value="">-- Choose Land Parcel --</option>
            {parcels.map((p) => {
              const gat = p.gatNumber || p.gat_number || p.surveyNumber || p.survey_number || 'N/A';
              const village = p.villageName || p.village_name || 'Village';
              const area = `${p.area} ${p.areaUnit || p.area_unit || 'Ha'}`;
              const share = p.share !== undefined ? `${p.share}% share` : '100% share';
              return (
                <option key={p.ulpin} value={p.ulpin}>
                  Gat {gat} • {village} • {area} ({share}) — {p.ulpin}
                </option>
              );
            })}
          </select>

          {helperText && (
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {helperText}
            </div>
          )}

          {/* Selected Parcel Summary Card */}
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
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Gat / Survey:</span>
                <strong>Gat {selectedParcel.gatNumber || selectedParcel.gat_number || selectedParcel.surveyNumber || selectedParcel.survey_number}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Village &amp; Tehsil:</span>
                <strong>{selectedParcel.villageName || selectedParcel.village_name}, {selectedParcel.tehsilCode || selectedParcel.tehsil_code || 'Haveli'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Land Area:</span>
                <strong>{selectedParcel.area} {selectedParcel.areaUnit || selectedParcel.area_unit || 'Ha'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Ownership Share:</span>
                <span style={{ color: '#065f46', fontWeight: 700 }}>
                  {selectedParcel.share !== undefined ? `${selectedParcel.share}%` : '100%'} ({selectedParcel.relation || 'Sole Titleholder'})
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Land Classification:</span>
                <strong>{selectedParcel.classification || 'Jirayat'} ({selectedParcel.landUse || selectedParcel.land_use || 'Agricultural'})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>Title Clearance:</span>
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
