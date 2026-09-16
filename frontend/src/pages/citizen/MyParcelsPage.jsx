import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import parcelService from '../../services/parcelService';


import citizenService from '../../services/citizenService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const MyParcelsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentCitizen = user || {};
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    citizenService.getMyParcels()
      .then((data) => {
        setParcels(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load citizen parcels:', err);
        setError('Unable to load parcel records from database. Please try again.');
        setParcels([]);
      })
      .finally(() => setLoading(false));
  }, [currentCitizen?.id]);

  const totalArea = parcels.reduce((acc, p) => acc + (parseFloat(p.area) || 0), 0);
  const clearParcelsCount = parcels.filter((p) => p.status === 'CLEAR').length;

  return (
    <div className="page-my-parcels" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Form 8A Landholder Account Book
            </span>
            <Badge variant="success">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={12} strokeWidth={2.5} />
                Aadhaar Linked
              </span>
            </Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
            My Registered Landholdings
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Authoritative cadastral holdings linked to Khatedar <strong>{currentCitizen.name}</strong> ({currentCitizen.id})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={() => navigate('/citizen/search')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Search size={15} />
              Search Any Parcel
            </span>
          </Button>
          <Button variant="primary" onClick={() => navigate('/citizen/mutations')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <GitPullRequest size={15} />
              Apply e-Ferfar Mutation
              <ArrowRight size={14} />
            </span>
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card style={{ padding: '1rem', borderLeft: '4px solid var(--ux4g-primary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Parcels
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ux4g-primary)', margin: '0.2rem 0' }}>
            {parcels.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>
            Recorded in Form 8A Khata
          </div>
        </Card>

        <Card style={{ padding: '1rem', borderLeft: '4px solid var(--ux4g-success)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Cumulative Area
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ux4g-success)', margin: '0.2rem 0' }}>
            {totalArea.toFixed(2)} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Ha</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>
            {(totalArea * 100).toFixed(0)} Gunthas (approx)
          </div>
        </Card>

        <Card style={{ padding: '1rem', borderLeft: '4px solid var(--ux4g-accent-orange, #ea580c)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Clear Title Status
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ux4g-accent-orange, #ea580c)', margin: '0.2rem 0' }}>
            {clearParcelsCount} / {parcels.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>
            Free of active encumbrance
          </div>
        </Card>

        <Card style={{ padding: '1rem', borderLeft: '4px solid var(--ux4g-info, #0284c7)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Tax &amp; Dues Status
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ux4g-success)', margin: '0.2rem 0' }}>
            ₹0
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-secondary)' }}>
            All annual taxes paid
          </div>
        </Card>
      </div>

      {/* Holdings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {loading ? (
          <Card style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>Loading land holdings...</p>
          </Card>
        ) : parcels.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>
              No land parcels found linked to Khatedar {currentCitizen.name}.
            </p>
          </Card>
        ) : (
          parcels.map((parcel) => (
            <Card key={parcel.ulpin} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-text-muted)', letterSpacing: '0.04em' }}>
                      ULPIN (BHU-AADHAAR)
                    </span>
                    <Badge variant={parcel.status === 'CLEAR' ? 'success' : 'warning'}>
                      {parcel.status}
                    </Badge>
                    <Badge variant="primary">
                      {parcel.relation || 'Owner'} ({parcel.share != null ? `${parcel.share}%` : '100%'} Share)
                    </Badge>
                    {parcel.khataNumber && (
                      <Badge variant="outline">
                        Khata: {parcel.khataNumber}
                      </Badge>
                    )}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--ux4g-font-mono)', color: 'var(--ux4g-primary)', fontWeight: 700 }}>
                    {parcel.ulpin}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.25rem' }}>
                    Village: <strong>{parcel.village_name || parcel.villageName}</strong> &bull; Tehsil: <strong>{parcel.tehsil || 'Haveli'}</strong> &bull; Gat / Survey: <strong>{parcel.gat_number || parcel.gatNumber || parcel.survey_number || parcel.surveyNumber}</strong> &bull; State: <code>{parcel.state_code || parcel.stateCode || 'MH'}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/citizen/parcels/${parcel.ulpin}`)}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      360° Title Dossier
                      <ArrowRight size={13} />
                    </span>
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/citizen/mutations')}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      Apply e-Ferfar
                      <ArrowRight size={13} />
                    </span>
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
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Total Land Area:</span>
                  <div style={{ fontWeight: 600 }}>{parcel.area} {parcel.areaUnit || parcel.area_unit || 'Ha'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Land Classification:</span>
                  <div style={{ fontWeight: 600 }}>{parcel.classification || 'Jirayat'} ({parcel.landUse || parcel.land_use || 'Agricultural'})</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Bank Encumbrances:</span>
                  <div style={{ fontWeight: 600, color: parcel.status === 'CLEAR' ? 'var(--ux4g-success)' : 'var(--ux4g-danger)' }}>
                    {parcel.status === 'CLEAR' ? 'Clear (No Lien)' : parcel.status}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Annual Land Revenue:</span>
                  <div style={{ fontWeight: 600 }}>
                    ₹180 / yr &bull; <span style={{ color: 'var(--ux4g-success)' }}>Paid</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyParcelsPage;
