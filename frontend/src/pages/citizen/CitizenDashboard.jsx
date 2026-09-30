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
import citizenService from '../../services/citizenService';


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

  const currentCitizen = user || {};

  // Live state from Supabase API
  const [userParcels, setUserParcels] = useState([]);
  const [userMutations, setUserMutations] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isSeedingModalOpen, setIsSeedingModalOpen] = useState(false);
  const [isRorModalOpen, setIsRorModalOpen] = useState(false);
  const [selectedParcelForRor, setSelectedParcelForRor] = useState(null);

  useEffect(() => {
    if (!currentCitizen.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.allSettled([
      citizenService.getMyParcels().then((data) => {
        if (Array.isArray(data)) {
          setUserParcels(data);
          if (data.length > 0) {
            setSelectedParcelForRor(data[0]);
          }
        }
      }).catch((err) => {
        console.warn('Citizen parcels fetch notice:', err.message);
      }),

      mutationService.getMutations().then((data) => {
        if (Array.isArray(data)) setUserMutations(data);
      }).catch(() => { }),

      applicationService.getApplications({ citizenId: currentCitizen.id }).then((data) => {
        if (Array.isArray(data)) setUserApplications(data);
      }).catch(() => { }),

      notificationService.getNotifications(currentCitizen.id).then((data) => {
        const notifs = data?.data || data || [];
        if (Array.isArray(notifs)) setUserNotifications(notifs);
      }).catch(() => { }),
    ]).finally(() => {
      setLoading(false);
    });
  }, [currentCitizen.id]);

  const unreadNotifications = userNotifications.filter((n) => !(n.is_read != null ? n.is_read : n.read));
  const totalArea = userParcels.reduce((acc, p) => acc + (parseFloat(p.area) || 0), 0);

  const handleSeedSuccess = (receipt) => {
    parcelService.getParcelById(receipt.parcelId).then((seededParcel) => {
      if (seededParcel && !userParcels.some((p) => p.ulpin === seededParcel.ulpin)) {
        setUserParcels((prev) => [seededParcel, ...prev]);
      }
    }).catch(() => { });
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
          {/* Section 11: Citizen Cadastral Identity & Overview Banner */}
          <Card style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', borderLeft: '4px solid var(--ux4g-primary, #064e3b)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ux4g-primary, #064e3b)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Authoritative Landholder Identity
                  </span>
                  <Badge variant="success">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={12} strokeWidth={2.5} />
                      e-KYC VERIFIED
                    </span>
                  </Badge>
                  <Badge variant="primary">Form 8A Khatedar</Badge>
                </div>
                <h2 style={{ margin: '0.2rem 0', fontSize: '1.45rem', color: 'var(--ux4g-primary, #064e3b)', fontWeight: 700 }}>
                  Welcome back, {currentCitizen.name || 'Citizen Landholder'}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                  <span>Mobile: <strong>{currentCitizen.mobile || 'N/A'}</strong></span>
                  <span>Email: <strong>{currentCitizen.email || 'N/A'}</strong></span>
                  <span>Address: <strong>{currentCitizen.address || 'Maharashtra, India'}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="outline" size="sm" onClick={() => navigate('/citizen/profile')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={13} />
                    View Citizen Profile
                  </span>
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/citizen/applications')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ClipboardList size={13} />
                    New Application
                  </span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Cards Row - 4 in a single horizontal row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem' }}>
            <Card style={{ padding: '0.85rem 1rem', borderLeft: '3px solid var(--ux4g-primary, #064e3b)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Land Parcels
                </div>
                <Layers size={16} style={{ color: 'var(--ux4g-primary, #064e3b)' }} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ux4g-primary, #064e3b)', margin: '0.15rem 0' }}>
                {userParcels.length} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Parcels</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Area: <strong>{totalArea.toFixed(2)} Ha</strong> ({(totalArea * 100).toFixed(0)} R)
              </div>
            </Card>

            <Card style={{ padding: '0.85rem 1rem', borderLeft: '3px solid var(--ux4g-secondary, #ea580c)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Mutations
                </div>
                <GitPullRequest size={16} style={{ color: 'var(--ux4g-secondary, #ea580c)' }} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ux4g-secondary, #ea580c)', margin: '0.15rem 0' }}>
                {userMutations.length} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Cases</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                e-Ferfar &amp; RoR changes
              </div>
            </Card>

            <Card style={{ padding: '0.85rem 1rem', borderLeft: '3px solid var(--ux4g-info, #0284c7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Applications
                </div>
                <ClipboardList size={16} style={{ color: 'var(--ux4g-info, #0284c7)' }} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ux4g-info, #0284c7)', margin: '0.15rem 0' }}>
                {userApplications.length} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Submitted</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                7/12, 8A &amp; Mojani
              </div>
            </Card>

            <Card style={{ padding: '0.85rem 1rem', borderLeft: '3px solid #7c3aed' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Alerts &amp; Notices
                </div>
                <Bell size={16} style={{ color: '#7c3aed' }} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#7c3aed', margin: '0.15rem 0' }}>
                {unreadNotifications.length} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>Unread</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ux4g-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Security &amp; Mutation
              </div>
            </Card>
          </div>

          {/* Quick Action Navigation Grid - 5 in a single horizontal row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '0.5rem',
            }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/citizen/search')}
              style={{ padding: '0.45rem 0.4rem', fontSize: '0.76rem', justifyContent: 'center' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                <Search size={14} />
                Search Cadastre
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/citizen/documents')}
              style={{ padding: '0.45rem 0.4rem', fontSize: '0.76rem', justifyContent: 'center' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                <FileCheck size={14} />
                Documents Vault
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/citizen/due-diligence')}
              style={{ padding: '0.45rem 0.4rem', fontSize: '0.76rem', justifyContent: 'center' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                <ShieldCheck size={14} />
                Due Diligence
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/citizen/watchlist')}
              style={{ padding: '0.45rem 0.4rem', fontSize: '0.76rem', justifyContent: 'center' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                <Bookmark size={14} />
                Watchlist
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/citizen/grievances')}
              style={{ padding: '0.45rem 0.4rem', fontSize: '0.76rem', justifyContent: 'center' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                <Scale size={14} />
                e-Grievance
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

            {loading ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {[1, 2].map((idx) => (
                  <Card key={idx} style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ width: '40%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.75rem' }} />
                    <div style={{ width: '75%', height: '20px', backgroundColor: '#cbd5e1', borderRadius: '4px', marginBottom: '0.5rem' }} />
                    <div style={{ width: '50%', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                  </Card>
                ))}
              </div>
            ) : userParcels.length === 0 ? (
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
            borderRadius: '12px',
            padding: '1.1rem 1.15rem',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 'calc(100vh - 148px)',
            minHeight: 'calc(100vh - 148px)',
            maxHeight: 'calc(100vh - 148px)',
            boxShadow: '0 8px 24px -4px rgba(6, 78, 59, 0.3)',
            position: 'sticky',
            top: '124px',
            alignSelf: 'start',
            boxSizing: 'border-box',
            zIndex: 20,
            overflowY: 'auto',
          }}
        >
          {/* Main Top Group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Section 1: Citizen Profile Header */}
            <div
              style={{
                paddingBottom: '0.65rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  CITIZEN CONTROL DESK
                </div>
                <Badge variant="success" style={{ background: '#16a34a', color: '#ffffff', fontSize: '0.65rem', padding: '0.15rem 0.45rem', border: 'none' }}>
                  ACTIVE
                </Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  {(currentCitizen.name || 'A').charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentCitizen.name}
                  </div>
                  {currentCitizen.localName && (
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.2 }}>
                      {currentCitizen.localName}
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', color: '#fef08a', marginTop: '0.15rem' }}>
                    Mobile: {currentCitizen.mobile || '+91 98230 45891'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: FEATURED SERVICE - Link Mobile to 7/12 RoR */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '8px',
                padding: '0.7rem 0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Smartphone size={15} color="#fef08a" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                    RoR Mobile Seeding
                  </span>
                </div>
                <span
                  style={{
                    backgroundColor: 'var(--ux4g-secondary, #ea580c)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '9999px',
                  }}
                >
                  ₹10 Only
                </span>
              </div>

              <p style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0.25rem 0 0.55rem', lineHeight: 1.35 }}>
                Link or update mobile number on 7/12 &amp; 8A to receive instant mutation &amp; crop survey alerts.
              </p>

              <button
                type="button"
                onClick={() => setIsSeedingModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem',
                  backgroundColor: 'var(--ux4g-secondary, #ea580c)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 3px 8px rgba(234, 88, 12, 0.3)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--ux4g-secondary, #ea580c)')}
              >
                <Smartphone size={14} />
                <span>Link Mobile to 7/12 (₹10) &rarr;</span>
              </button>
            </div>

            {/* Section 3: Quick Right Menu Services */}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.45rem' }}>
                ONLINE CADASTRAL SERVICES
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {/* Instant 7/12 RoR */}
                <button
                  type="button"
                  onClick={() => {
                    if (userParcels[0]) setSelectedParcelForRor(userParcels[0]);
                    setIsRorModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.48rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.78rem',
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
                    <FileText size={14} color="#fef08a" />
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
                    padding: '0.48rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.78rem',
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
                    <Layers size={14} color="#fef08a" />
                    <span>Form 8A Khata Extract</span>
                  </span>
                  <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
                </button>

                {/* e-Ferfar Mutation */}
                <Link
                  to="/citizen/mutations"
                  style={{
                    width: '100%',
                    padding: '0.48rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.78rem',
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
                    <GitPullRequest size={14} color="#fef08a" />
                    <span>Apply for e-Ferfar Mutation</span>
                  </span>
                  <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
                </Link>

                {/* Due Diligence 360 */}
                <Link
                  to="/citizen/due-diligence"
                  style={{
                    width: '100%',
                    padding: '0.48rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.78rem',
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
                    <ShieldCheck size={14} color="#fef08a" />
                    <span>Due Diligence 360° Report</span>
                  </span>
                  <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
                </Link>
              </div>
            </div>
          </div>

          {/* Section 4: DoLR National Toll-Free Support (Pinned to Bottom of Box) */}
          <div
            style={{
              paddingTop: '0.65rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <PhoneCall size={14} color="#fef08a" />
              <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                DoLR Helpline:
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fef08a' }}>
              1800-120-8040
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CitizenDashboard;
