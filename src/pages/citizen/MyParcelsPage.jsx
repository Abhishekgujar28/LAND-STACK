import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import citizensData from '../../data/users/citizens.json';
import ownershipData from '../../data/parcels/ownership.json';
import parcelsData from '../../data/parcels/parcels.json';
import encumbrancesData from '../../data/parcels/encumbrances.json';
import taxRecordsData from '../../data/parcels/taxRecords.json';
import restrictionsData from '../../data/parcels/restrictions.json';
import courtCasesData from '../../data/parcels/courtCases.json';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/common/StatusBadge';

export const MyParcelsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentCitizen =
    citizensData.find((c) => c.id === user?.id) ||
    citizensData[0];

  const userHoldings = ownershipData.filter((o) => o.ownerId === currentCitizen.id);

  const enrichedHoldings = userHoldings.map((holding) => {
    const parcel = parcelsData.find((p) => p.ulpin === holding.parcelId) || {};
    const tax = taxRecordsData.find((t) => t.parcelId === holding.parcelId);
    const encumbrances = encumbrancesData.filter((e) => e.parcelId === holding.parcelId);
    const restrictions = restrictionsData.filter((r) => r.parcelId === holding.parcelId);
    const courtCases = courtCasesData.filter((c) => c.parcelId === holding.parcelId);

    return {
      ...holding,
      parcel,
      tax,
      encumbrances,
      restrictions,
      courtCases,
    };
  });

  const totalArea = enrichedHoldings.reduce((acc, h) => acc + (h.parcel.area || 0), 0);
  const totalDues = enrichedHoldings.reduce((acc, h) => acc + (h.tax?.outstandingDues || 0), 0);
  const clearParcelsCount = enrichedHoldings.filter((h) => h.parcel.status === 'CLEAR').length;

  return (
    <div className="page-my-parcels" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase' }}>
              Form 8A Landholder Account Book
            </span>
            <Badge variant="success">Aadhaar Linked</Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0 }}>
            My Registered Landholdings
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Authoritative cadastral holdings linked to Khatedar <strong>{currentCitizen.name}</strong> ({currentCitizen.id})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" onClick={() => navigate('/citizen/search')}>
            🔍 Search Any Parcel
          </Button>
          <Button variant="primary" onClick={() => navigate('/citizen/mutations')}>
            Apply e-Ferfar Mutation →
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card style={{ padding: '1rem', borderLeft: '4px solid var(--ux4g-primary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Parcels
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ux4g-primary)', margin: '0.2rem 0' }}>
            {enrichedHoldings.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>
            Recorded in Form 8A Khata
          </div>
        </Card>

        <Card style={{ padding: '1rem', borderLeft: '4px solid var(--ux4g-success)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Cumulative Area
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ux4g-success)', margin: '0.2rem 0' }}>
            {totalArea.toFixed(2)} <span style={{ fontSize: '0.9rem' }}>Ha</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>
            {(totalArea * 100).toFixed(0)} Gunthas (approx)
          </div>
        </Card>

        <Card style={{ padding: '1rem', borderLeft: '4px solid var(--ux4g-accent)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Clear Title Status
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ux4g-accent)', margin: '0.2rem 0' }}>
            {clearParcelsCount} / {enrichedHoldings.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>
            Free of active encumbrance
          </div>
        </Card>

        <Card style={{ padding: '1rem', borderLeft: '4px solid var(--ux4g-info)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Tax & Dues Status
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: totalDues === 0 ? 'var(--ux4g-success)' : 'var(--ux4g-danger)', margin: '0.2rem 0' }}>
            ₹{totalDues}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>
            {totalDues === 0 ? 'All annual taxes paid' : 'Outstanding dues pending'}
          </div>
        </Card>
      </div>

      {/* Holdings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {enrichedHoldings.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>
              No land parcels found linked to Aadhaar ID {currentCitizen.aadhaarHash}.
            </p>
          </Card>
        ) : (
          enrichedHoldings.map((holding) => {
            const { parcel, tax, encumbrances, restrictions, courtCases } = holding;
            return (
              <Card key={holding.id} style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)' }}>
                        ULPIN (BHU-AADHAAR)
                      </span>
                      <StatusBadge status={parcel.status} />
                      <Badge variant="primary">{holding.relation} ({holding.share}%)</Badge>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--ux4g-font-mono)', color: 'var(--ux4g-primary)' }}>
                      {parcel.ulpin}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.25rem' }}>
                      Village: <strong>{parcel.villageName}</strong> &bull; Gat / Survey: <strong>{parcel.gatNumber || parcel.surveyNumber}</strong> &bull; Khata No (8A): <code>{holding.khataNumber}</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/citizen/parcels/${parcel.ulpin}`)}>
                      360&deg; Title Dossier →
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => navigate('/citizen/mutations')}>
                      Apply e-Ferfar
                    </Button>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    background: 'var(--ux4g-surface-muted)',
                    padding: '1rem',
                    borderRadius: 'var(--ux4g-radius-md)',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Total Land Area:</span>
                    <div style={{ fontWeight: 600 }}>{parcel.area} {parcel.areaUnit}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Land Classification:</span>
                    <div style={{ fontWeight: 600 }}>{parcel.classification || 'Jirayat'} ({parcel.landUse})</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Bank Encumbrances:</span>
                    <div style={{ fontWeight: 600, color: encumbrances.length > 0 ? 'var(--ux4g-danger)' : 'var(--ux4g-success)' }}>
                      {encumbrances.length > 0 ? `${encumbrances.length} Active Charge(s)` : 'Clear (No Lien)'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Annual Land Revenue:</span>
                    <div style={{ fontWeight: 600 }}>
                      ₹{tax?.annualAssessment || '180'} / yr &bull;{' '}
                      <span style={{ color: tax?.outstandingDues > 0 ? 'var(--ux4g-danger)' : 'var(--ux4g-success)' }}>
                        {tax?.outstandingDues > 0 ? `₹${tax.outstandingDues} Due` : 'Paid'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges / Warnings strip if any */}
                {(restrictions.length > 0 || courtCases.length > 0) && (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {restrictions.map((r) => (
                      <Badge key={r.id} variant="danger">
                        ⚠️ Restriction: {r.type}
                      </Badge>
                    ))}
                    {courtCases.map((c) => (
                      <Badge key={c.id} variant="warning">
                        ⚖️ Litigation: {c.caseNumber} ({c.status})
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyParcelsPage;
