import React, { useState, useEffect } from 'react';
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
  Smartphone,
  Sparkles,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Download,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import parcelService from '../../services/parcelService';
import mutationService from '../../services/mutationService';
import applicationService from '../../services/applicationService';
import watchlistService from '../../services/watchlistService';
import notificationService from '../../services/notificationService';
import { DEFAULT_CITIZENS } from '../../context/authConstants';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ParcelCard from '../../components/citizen/ParcelCard';
import ApplicationCard from '../../components/citizen/ApplicationCard';
import MutationStatus from '../../components/citizen/MutationStatus';
import RorMobileSeedingModal from '../../components/citizen/RorMobileSeedingModal';
import RorModal from '../../components/citizen/RorModal';

export const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentCitizen = user || DEFAULT_CITIZENS[0];

  const [userParcels, setUserParcels] = useState([]);
  const [userMutations, setUserMutations] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);

  // Modal States
  const [isSeedingModalOpen, setIsSeedingModalOpen] = useState(false);
  const [isRorModalOpen, setIsRorModalOpen] = useState(false);
  const [selectedParcelForRor, setSelectedParcelForRor] = useState(null);

  useEffect(() => {
    parcelService.getParcels({ search: currentCitizen.name }).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setUserParcels(data);
        setSelectedParcelForRor(data[0]);
      } else {
        parcelService.getParcels({ limit: 4 }).then((fallback) => {
          if (Array.isArray(fallback)) {
            setUserParcels(fallback);
            setSelectedParcelForRor(fallback[0]);
          }
        }).catch(() => {});
      }
    }).catch(() => {});

    mutationService.getMutationsByApplicant(currentCitizen.id).then((data) => {
      if (Array.isArray(data)) setUserMutations(data);
    }).catch(() => {});

    applicationService.getApplications({ citizenId: currentCitizen.id }).then((data) => {
      if (Array.isArray(data)) setUserApplications(data);
    }).catch(() => {});

    notificationService.getNotifications(currentCitizen.id).then((data) => {
      if (Array.isArray(data)) setUserNotifications(data);
    }).catch(() => {});
  }, [currentCitizen.id, currentCitizen.name]);

  const unreadNotifications = userNotifications.filter((n) => !n.read);
  const totalArea = userParcels.reduce((acc, p) => acc + (parseFloat(p.area) || 0), 0);

  const handleSeedSuccess = (receipt) => {
    parcelService.getParcelById(receipt.parcelId).then((seededParcel) => {
      if (seededParcel && !userParcels.some((p) => p.ulpin === seededParcel.ulpin)) {
        setUserParcels((prev) => [seededParcel, ...prev]);
      }
    }).catch(() => {});
  };

  return (
    <div className="page-citizen-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Modals */}
      <RorMobileSeedingModal
        isOpen={isSeedingModalOpen}
        onClose={() => setIsSeedingModalOpen(false)}
        citizen={currentCitizen}
        onSeedSuccess={handleSeedSuccess}
      />

      <RorModal
        isOpen={isRorModalOpen}
        onClose={() => setIsRorModalOpen(false)}
        parcel={selectedParcelForRor || userParcels[0]}
        owners={[{ ownerName: currentCitizen.name, share: 100, relation: 'Self' }]}
      />

      {/* Main 2-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="citizen-dashboard-grid"
      >
        {/* ================= LEFT / MAIN CONTENT AREA ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          {/* Stats Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--ux4g-primary, #064e3b)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.775rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Land Parcels Owned
                </div>
                <Layers size={18} style={{ color: 'var(--ux4g-primary, #064e3b)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ux4g-primary, #064e3b)', margin: '0.25rem 0' }}>
                {userParcels.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Parcels</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Cumulative Area: <strong>{totalArea.toFixed(2)} Ha</strong> ({(totalArea * 100).toFixed(0)} R)
              </div>
            </Card>

            <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--ux4g-secondary, #ea580c)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.775rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Mutations
                </div>
                <GitPullRequest size={18} style={{ color: 'var(--ux4g-secondary, #ea580c)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ux4g-secondary, #ea580c)', margin: '0.25rem 0' }}>
                {userMutations.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Cases</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                e-Ferfar &amp; RoR changes
              </div>
            </Card>

            <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--ux4g-info, #0284c7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.775rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Service Applications
                </div>
                <ClipboardList size={18} style={{ color: 'var(--ux4g-info, #0284c7)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ux4g-info, #0284c7)', margin: '0.25rem 0' }}>
                {userApplications.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Submitted</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                7/12, 8A &amp; Mojani Extracts
              </div>
            </Card>

            <Card style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.775rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Alerts &amp; Notices
                </div>
                <Bell size={18} style={{ color: '#7c3aed' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#7c3aed', margin: '0.25rem 0' }}>
                {unreadNotifications.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Unread</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Security &amp; Mutation updates
              </div>
            </Card>
          </div>

          {/* Quick Action Navigation Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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
                <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ux4g-primary, #064e3b)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                  No land parcels found linked to Khatedar {currentCitizen.name}.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ marginTop: '1rem', backgroundColor: 'var(--ux4g-primary, #064e3b)' }}
                  onClick={() => setIsSeedingModalOpen(true)}
                >
                  <Smartphone size={14} />
                  <span>Seed Mobile to 7/12 RoR (₹10)</span>
                </Button>
              </Card>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Active Mutations */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary, #064e3b)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--ux4g-primary, #064e3b)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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

        {/* ================= RIGHT MENU SECTION ================= */}
        <aside
          className="citizen-right-menu-section"
          style={{
            background: 'linear-gradient(180deg, var(--ux4g-primary, #064e3b) 0%, #033628 65%, #022319 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 12px 30px -5px rgba(6, 78, 59, 0.35)',
            position: 'sticky',
            top: '1.5rem',
          }}
        >
          {/* Section 1: Citizen Profile Header */}
          <div
            style={{
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                CITIZEN CONTROL DESK
              </div>
              <Badge variant="success" style={{ background: '#16a34a', color: '#ffffff', fontSize: '0.68rem', border: 'none' }}>
                ACTIVE
              </Badge>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  flexShrink: 0,
                }}
              >
                {(currentCitizen.name || 'A').charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                  {currentCitizen.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {currentCitizen.localName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#fef08a', marginTop: '0.2rem' }}>
                  Mobile: {currentCitizen.mobile}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: FEATURED SERVICE - Link Mobile to 7/12 RoR */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              padding: '1rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Smartphone size={16} color="#fef08a" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  RoR Mobile Seeding
                </span>
              </div>
              <span
                style={{
                  backgroundColor: 'var(--ux4g-secondary, #ea580c)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                }}
              >
                ₹10 Only
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0.35rem 0 0.85rem', lineHeight: 1.4 }}>
              Link or update your mobile number to your 7/12 RoR &amp; 8A Khata to receive instantaneous mutation &amp; crop survey alerts.
            </p>

            <button
              type="button"
              onClick={() => setIsSeedingModalOpen(true)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                backgroundColor: 'var(--ux4g-secondary, #ea580c)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 10px rgba(234, 88, 12, 0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--ux4g-secondary, #ea580c)')}
            >
              <Smartphone size={15} />
              <span>Link Mobile to 7/12 (₹10) &rarr;</span>
            </button>
          </div>

          {/* Section 3: Quick Right Menu Services */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
              ONLINE CADASTRAL SERVICES
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {/* Instant 7/12 RoR */}
              <button
                type="button"
                onClick={() => {
                  if (userParcels[0]) setSelectedParcelForRor(userParcels[0]);
                  setIsRorModalOpen(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={15} color="#fef08a" />
                  <span>Download 7/12 RoR Extract</span>
                </span>
                <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
              </button>

              {/* Form 8A Khata */}
              <button
                type="button"
                onClick={() => {
                  if (userParcels[0]) setSelectedParcelForRor(userParcels[0]);
                  setIsRorModalOpen(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={15} color="#fef08a" />
                  <span>Form 8A Khata Extract</span>
                </span>
                <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
              </button>

              {/* e-Ferfar Mutation */}
              <Link
                to="/citizen/mutations"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GitPullRequest size={15} color="#fef08a" />
                  <span>Apply for e-Ferfar Mutation</span>
                </span>
                <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
              </Link>

              {/* Due Diligence 360 */}
              <Link
                to="/citizen/due-diligence"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={15} color="#fef08a" />
                  <span>Due Diligence 360° Report</span>
                </span>
                <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
              </Link>
            </div>
          </div>

          {/* Section 4: DoLR National Toll-Free Support */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <PhoneCall size={16} color="#fef08a" />
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff' }}>
                National Land Helpline
              </div>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fef08a', letterSpacing: '0.05em' }}>
              1800-120-8040
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.2rem' }}>
              Toll-Free &bull; 9:00 AM - 6:00 PM (Mon-Sat)<br />
              Department of Land Resources (DoLR)
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CitizenDashboard;
