import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  GitPullRequest,
  ClipboardList,
  Bell,
  ShieldCheck,
  Search,
  FileCheck,
  Bookmark,
  Scale,
  ArrowRight,
  CheckCircle2,
  MapPin,
  FileText,
  User,
} from 'lucide-react';
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
          background: 'linear-gradient(135deg, #0f284e 0%, #1a365d 100%)',
          color: '#ffffff',
          borderRadius: 'var(--ux4g-radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: 'var(--ux4g-shadow-md)',
          border: '1px solid rgba(255,255,255,0.1)',
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
              fontSize: '1.6rem',
              fontWeight: 800,
              boxShadow: 'var(--ux4g-shadow-sm)',
              flexShrink: 0,
            }}
          >
            {currentCitizen.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.45rem', color: '#ffffff', fontWeight: 700 }}>
                Welcome, {currentCitizen.name}
              </h1>
              <span style={{ fontSize: '1rem', opacity: 0.9 }}>({currentCitizen.localName})</span>
              <Badge variant="success" style={{ background: '#1b6e3f', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  Aadhaar KYC Verified
                </span>
              </Badge>
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: '0.35rem' }}>
              Citizen ID: <strong>{currentCitizen.id}</strong> &bull; Aadhaar: <code>{currentCitizen.aadhaarHash}</code> &bull; Jurisdiction: {currentCitizen.stateCode}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.2rem' }}>
              {currentCitizen.address}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)' }}
            onClick={() => navigate('/citizen/due-diligence')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={16} />
              Due Diligence 360°
            </span>
          </Button>
          <Button
            variant="primary"
            style={{ background: '#ffffff', color: 'var(--ux4g-primary)', fontWeight: 600 }}
            onClick={() => navigate('/citizen/mutations')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <GitPullRequest size={16} />
              Apply e-Ferfar Mutation
              <ArrowRight size={14} />
            </span>
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--ux4g-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.775rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Land Parcels Owned
            </div>
            <Layers size={18} style={{ color: 'var(--ux4g-primary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ux4g-primary)', margin: '0.25rem 0' }}>
            {userParcels.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Parcels</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
            Cumulative Area: <strong>{totalArea.toFixed(2)} Ha</strong> ({(totalArea * 100).toFixed(0)} R)
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--ux4g-accent-orange)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.775rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Active Mutations
            </div>
            <GitPullRequest size={18} style={{ color: 'var(--ux4g-accent-orange)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ux4g-accent-orange)', margin: '0.25rem 0' }}>
            {userMutations.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Cases</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
            e-Ferfar & RoR changes
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--ux4g-info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.775rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Service Applications
            </div>
            <ClipboardList size={18} style={{ color: 'var(--ux4g-info)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ux4g-info)', margin: '0.25rem 0' }}>
            {userApplications.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Submitted</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
            7/12, 8A & Mojani Extracts
          </div>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.775rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Alerts & Notices
            </div>
            <Bell size={18} style={{ color: '#7c3aed' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#7c3aed', margin: '0.25rem 0' }}>
            {unreadNotifications.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Unread</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
            Security & Mutation updates
          </div>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <Button variant="outline" onClick={() => navigate('/citizen/search')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Search size={15} />
            Search Cadastre
          </span>
        </Button>
        <Button variant="outline" onClick={() => navigate('/citizen/documents')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileCheck size={15} />
            Documents Vault
          </span>
        </Button>
        <Button variant="outline" onClick={() => navigate('/citizen/due-diligence')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={15} />
            Due Diligence 360°
          </span>
        </Button>
        <Button variant="outline" onClick={() => navigate('/citizen/watchlist')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Bookmark size={15} />
            Watchlist Alerts
          </span>
        </Button>
        <Button variant="outline" onClick={() => navigate('/citizen/grievances')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Scale size={15} />
            e-Lokshahi Grievance
          </span>
        </Button>
      </div>

      {/* My Land Parcels Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ux4g-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={20} />
              My Landholdings (Form 8A Registry)
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.15rem' }}>
              Authentic cadastral land parcels verified against e-Mahabhumi records
            </div>
          </div>
          <Link to="/citizen/parcels">
            <Button variant="ghost" size="sm">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                View All ({userParcels.length})
                <ArrowRight size={14} />
              </span>
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
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GitPullRequest size={18} />
              e-Ferfar Mutation Status
            </h3>
            <Link to="/citizen/mutations">
              <Button variant="ghost" size="sm">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Manage
                  <ArrowRight size={13} />
                </span>
              </Button>
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
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ClipboardList size={18} />
              Recent Service Requests
            </h3>
            <Link to="/citizen/applications">
              <Button variant="ghost" size="sm">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  View All ({userApplications.length})
                  <ArrowRight size={13} />
                </span>
              </Button>
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
