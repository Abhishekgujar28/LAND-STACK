import React from 'react';
import Card from '../ui/Card';

/**
 * ParcelIdentity - Cadastral identity details (ULPIN, Survey, Khasra, Gat, CTS)
 */
export const ParcelIdentity = ({ parcel, className = '' }) => {
  if (!parcel) return null;

  const fields = [
    { label: 'ULPIN', value: parcel.ulpin },
    { label: 'Survey Number', value: parcel.surveyNumber || 'N/A' },
    { label: 'Gat Number', value: parcel.gatNumber || 'N/A' },
    { label: 'Khasra Number', value: parcel.khasraNumber || 'N/A' },
    { label: 'CTS Number (City Title)', value: parcel.ctsNumber || 'N/A' },
    { label: 'State', value: parcel.stateCode || 'MH' },
    { label: 'District', value: parcel.districtCode || 'Pune' },
    { label: 'Tehsil', value: parcel.tehsilCode || 'Haveli' },
    { label: 'Village', value: `${parcel.villageName} (${parcel.villageCode})` },
    { label: 'Total Area', value: `${parcel.area} ${parcel.areaUnit}` },
    { label: 'Land Classification', value: parcel.classification || 'Jirayat' },
    { label: 'Land Use Type', value: parcel.landUse || 'Agricultural' },
  ];

  return (
    <Card className={`parcel-identity ${className}`.trim()} header={<strong>Cadastral Identity Attributes</strong>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {fields.map((f, i) => (
          <div key={i}>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', marginBottom: '0.15rem' }}>{f.label}</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ux4g-text)' }}>{f.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ParcelIdentity;
