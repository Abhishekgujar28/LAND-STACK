import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import citizensData from '../../data/users/citizens.json';
import parcelsData from '../../data/parcels/parcels.json';
import ownershipData from '../../data/parcels/ownership.json';
import mutationsData from '../../data/mutations/mutations.json';
import applicationsData from '../../data/applications/applications.json';
import watchlistData from '../../data/watchlist/watchlist.json';
import notificationsData from '../../data/notifications/notifications.json';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ParcelCard from '../../components/citizen/ParcelCard';
import ApplicationCard from '../../components/citizen/ApplicationCard';
import MutationStatus from '../../components/citizen/MutationStatus';

export const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active citizen record (matching auth user id or fallback to CIT-001)
  const currentCitizen =
    citizensData.find((c) => c.id === user?.id) ||
    citizensData[0];

  // Matched land parcels owned by this citizen
  const userHoldings = ownershipData.filter((o) => o.ownerId === currentCitizen.id);
  const ownedParcelIds = userHoldings.map((h) => h.parcelId);
  const userParcels = parcelsData.filter((p) => ownedParcelIds.includes(p.ulpin));

  // Matched mutations for this citizen
  const userMutations = mutationsData.filter(
    (m) => m.initiatedBy.includes(currentCitizen.id) || ownedParcelIds.includes(m.parcelId)
  );

  // Matched service applications
  const userApplications = applicationsData.filter((a) => a.citizenId === currentCitizen.id);

  // Matched notifications
  const userNotifications = notificationsData.filter((n) => n.userId === currentCitizen.id);
  const unreadNotifications = userNotifications.filter((n) => !n.read);

  // Total area calculation
  const totalArea = userParcels.reduce((acc, p) => acc + (p.area || 0), 0);

  return (
    <div className="page-citizen-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome & Profile Summary Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0b3c5d 0%, #1d5f8a 100%)',
          color: '#ffffff',
          borderRadius: 'var(--ux4g-radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: 'var(--ux4g-shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ffffff',
              color: 'var(--ux4g-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 700,
              boxShadow: 'var(--ux4g-shadow-sm)',
            }}
          >
            {currentCitizen.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#ffffff' }}>
                Welcome, {currentCitizen.name}
              </h1>
              <span style={{ fontSize: '1.1rem', opacity: 0.9 }}>({currentCitizen.localName})</span>
              <Badge variant="success" style={{ background: '#22c55e', color: '#ffffff' }}>
                KYC VERIFIED
              </Badge>
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.35rem' }}>
              Citizen ID: <strong>{currentCitizen.id}</strong> &bull; Aadhaar: <code>{currentCitizen.aadhaarHash}</code> &bull; State: {currentCitizen.stateCode}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.2rem' }}>
              {currentCitizen.address}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="outline"
            style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}
            onClick={() => navigate('/citizen/due-diligence')}
          >
            🛡️ Due Diligence 360
          </Button>
          <Button
            variant="primary"
            style={{ background: '#ffffff', color: 'var(--ux4g-primary)', fontWeight: 600 }}
            onClick={() => navigate('/citizen/mutations')}
          >
            Apply e-Ferfar Mutation →
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--ux4g-primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Land Parcels Owned
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ux4g-primary)', margin: '0.25rem 0' }}>
            {userParcels.length} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Parcels</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
            Cumulative Area: <strong>{totalArea.toFixed(2)} Ha</strong>
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--ux4g-accent)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Active Mutations
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ux4g-accent)', margin: '0.25rem 0' }}>
            {userMutations.length} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Cases</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
            e-Ferfar & RoR changes
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--ux4g-info)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Service Applications
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ux4g-info)', margin: '0.25rem 0' }}>
            {userApplications.length} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Submitted</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
            7/12, 8A & Mojani Extracts
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Alerts & Notices
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#8b5cf6', margin: '0.25rem 0' }}>
            {unreadNotifications.length} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Unread</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
            Security & Mutation updates
          </div>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <Button variant="outline" onClick={() => navigate('/citizen/search')}>
          🔍 Search Land Cadastre
        </Button>
        <Button variant="outline" onClick={() => navigate('/citizen/documents')}>
          📁 Certified Documents Vault
        </Button>
        <Button variant="outline" onClick={() => navigate('/citizen/due-diligence')}>
          🛡️ Run Title Due Diligence
        </Button>
        <Button variant="outline" onClick={() => navigate('/citizen/watchlist')}>
          ⭐ Land Watchlist Alerts
        </Button>
        <Button variant="outline" onClick={() => navigate('/citizen/grievances')}>
          ⚖️ Grievance Redressal
        </Button>
      </div>

      {/* My Land Parcels Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ux4g-primary)' }}>
              🌾 My Landholdings (Form 8A Registry)
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
              Authentic cadastral land parcels verified against e-Mahabhumi records
            </div>
          </div>
          <Link to="/citizen/parcels">
            <Button variant="ghost" size="sm">
              View All Holdings ({userParcels.length}) →
            </Button>
          </Link>
        </div>

        {userParcels.length === 0 ? (
          <Card style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>
              No land parcels found linked to Aadhaar ID {currentCitizen.aadhaarHash}.
            </p>
          </Card>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {userParcels.map((parcel) => (
              <ParcelCard key={parcel.ulpin} parcel={parcel} />
            ))}
          </div>
        )}
      </div>

      {/* Grid: Active Mutations & Recent Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Active Mutations */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary)' }}>
              🔄 e-Ferfar Mutation Status
            </h3>
            <Link to="/citizen/mutations">
              <Button variant="ghost" size="sm">Manage →</Button>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userMutations.length === 0 ? (
              <Card style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--ux4g-text-muted)' }}>
                No active mutation proceedings.
              </Card>
            ) : (
              userMutations.slice(0, 2).map((mutation) => (
                <MutationStatus key={mutation.id} mutation={mutation} />
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary)' }}>
              📋 Recent Service Requests
            </h3>
            <Link to="/citizen/applications">
              <Button variant="ghost" size="sm">View All ({userApplications.length}) →</Button>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userApplications.length === 0 ? (
              <Card style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--ux4g-text-muted)' }}>
                No pending service requests.
              </Card>
            ) : (
              userApplications.slice(0, 2).map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onTrack={() => navigate('/citizen/applications')}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
