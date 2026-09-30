import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  GitPullRequest,
  ClipboardList,
  Bell,
  ShieldCheck,
  Search,
  Bookmark,
  Scale,
  ArrowRight,
  CheckCircle2,
  MapPin,
  FileText,
  User,
  Sprout,
  Plane,
  Home,
  ChevronRight,
  PlusCircle,
  Eye,
  Phone,
  Mail,
  HelpCircle,
  Calendar,
  Clock,
  Printer,
  Download,
  FileSignature,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import parcelService from '../../services/parcelService';
import mutationService from '../../services/mutationService';
import applicationService from '../../services/applicationService';
import notificationService from '../../services/notificationService';
import citizenService from '../../services/citizenService';

import RorModal from '../../components/citizen/RorModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentCitizen = user || {};

  // Live state from Supabase API & SRO Appointment System
  const [userParcels, setUserParcels] = useState([]);
  const [userMutations, setUserMutations] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [activeAppointmentApp, setActiveAppointmentApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isRorModalOpen, setIsRorModalOpen] = useState(false);
  const [selectedParcelForRor, setSelectedParcelForRor] = useState(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

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

      applicationService.getCitizenAppointmentNotice(currentCitizen.id).then((noticeApp) => {
        if (noticeApp) setActiveAppointmentApp(noticeApp);
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

  const handleOpenRor = (parcel) => {
    setSelectedParcelForRor(parcel);
    setIsRorModalOpen(true);
  };

  return (
    <div
      className="page-citizen-dashboard"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ROR Modal */}
      <RorModal
        isOpen={isRorModalOpen}
        onClose={() => setIsRorModalOpen(false)}
        parcel={selectedParcelForRor}
      />

      {/* 1. TOP ROW: Welcome Hero Card (Left) & Government Schemes (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr)',
          gap: '1rem',
          alignItems: 'stretch',
        }}
      >
        {/* Left: Authoritative Landholder Identity Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fafffc 60%, #f0fdf4 100%)',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.4rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.25rem',
            position: 'relative',
          }}
        >
          {/* User Green Circle Avatar */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '2px solid #bbf7d0',
              marginTop: '2px',
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.12)',
            }}
          >
            <User size={28} strokeWidth={2.2} />
          </div>

          {/* Citizen Details Flex Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem', minWidth: 0 }}>
            {/* Top Bar: Verification Badges + Slogan */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#166534', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  AUTHORITATIVE LANDHOLDER IDENTITY
                </span>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: '#15803d',
                    backgroundColor: '#dcfce7',
                    border: '1px solid #86efac',
                    padding: '1px 7px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <CheckCircle2 size={10} />
                  e-KYC VERIFIED
                </span>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  FORM 8A KHATEDAR
                </span>
              </div>

              {/* Slogan with Tricolor underline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#065f46',
                    lineHeight: 1.1,
                  }}
                >
                  Your Land Our Service
                </div>
                <div style={{ display: 'flex', height: '2px', width: '56px', marginTop: '3px', borderRadius: '2px', overflow: 'hidden' }}>
                  <span style={{ flex: 1, backgroundColor: '#ea580c' }} />
                  <span style={{ flex: 1, backgroundColor: '#ffffff', border: '0.5px solid #cbd5e1' }} />
                  <span style={{ flex: 1, backgroundColor: '#16a34a' }} />
                </div>
              </div>
            </div>

            {/* Greeting */}
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              Welcome back, {currentCitizen.name || 'Abhishek Gujar'}
            </h1>

            {/* Phone & Email line */}
            <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={12} color="#16a34a" />
                <span>{currentCitizen.mobile || '+91 98230 45891'}</span>
              </span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={12} color="#16a34a" />
                <span>{currentCitizen.email || 'a**************@example.com'}</span>
              </span>
            </div>

            {/* Address line */}
            <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={12} color="#ea580c" />
                <span>{currentCitizen.address || 'Gat No 42, Wagholi, Pune, Maharashtra 412207'}</span>
              </span>
              <Link to="/citizen/profile" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none', marginLeft: '4px' }}>
                View Details &rarr;
              </Link>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              <Link
                to="/citizen/profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
              >
                <User size={13} />
                <span>View Citizen Profile</span>
              </Link>

              <Link
                to="/citizen/applications"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#064e3b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(6, 78, 59, 0.25)',
                  transition: 'all 0.15s ease',
                }}
              >
                <PlusCircle size={13} />
                <span>New Application</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Government Schemes for You Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.05rem 1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
              <Sprout size={16} color="#16a34a" />
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                Government Schemes for You
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 0.65rem' }}>
              Based on your land records and profile, you may be eligible for the following schemes
            </p>
          </div>

          {/* 3 Compact Scheme Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {/* Scheme 1: PM Kisan */}
            <Link
              to="/schemes"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sprout size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    PM Kisan Samman Nidhi
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.2 }}>
                    Income support to eligible farmer families
                  </div>
                </div>
              </div>
              <ChevronRight size={14} color="#15803d" />
            </Link>

            {/* Scheme 2: SVAMITVA Scheme */}
            <Link
              to="/schemes"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#dbeafe',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Plane size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    SVAMITVA Scheme
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.2 }}>
                    Drone based mapping and property card (Gharoni)
                  </div>
                </div>
              </div>
              <ChevronRight size={14} color="#2563eb" />
            </Link>

            {/* Scheme 3: NAKSHA Scheme */}
            <Link
              to="/schemes"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: '#fff7ed',
                border: '1px solid #fed7aa',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#ffedd5',
                    color: '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Home size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    NAKSHA Scheme
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.2 }}>
                    Modernization of land records (cadastral mapping)
                  </div>
                </div>
              </div>
              <ChevronRight size={14} color="#ea580c" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 1.5. SRO APPOINTMENT NOTICE & NOTIFICATION CENTER SECTION ─────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
          gap: '1rem',
          alignItems: 'stretch',
        }}
      >
        {/* Left Card: Official SRO Appointment Notice Widget */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1.5px solid #bbf7d0',
            borderLeft: '5px solid #064e3b',
            padding: '1.15rem 1.35rem',
            boxShadow: '0 2px 8px rgba(6, 78, 59, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: '#ecfdf5',
                    color: '#064e3b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileSignature size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#065f46', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    BHARATBHUMI &bull; SRO NOTIFICATION
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    SRO Appointment Notice
                  </h3>
                </div>
              </div>

              <span
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #86efac',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}
              >
                {activeAppointmentApp?.appointment?.status?.toUpperCase() || 'SCHEDULED'}
              </span>
            </div>

            {/* Appointment Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.65rem',
                backgroundColor: '#f8fafc',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                marginBottom: '0.85rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Notice ID</div>
                <div style={{ fontWeight: 800, color: '#064e3b' }}>
                  {activeAppointmentApp?.appointment?.noticeId || 'SRO-2026-001'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Application ID</div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>
                  {activeAppointmentApp?.id || 'APP-1025'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Service Type</div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {activeAppointmentApp?.serviceType || 'Property Registration'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Parcel ID / Gat</div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {activeAppointmentApp?.parcelId || 'MH-PUN-1025'} (Gat 42/1)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Appointment Date</div>
                <div style={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} color="#064e3b" />
                  <span>{activeAppointmentApp?.appointment?.date || '5 October 2026'}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Appointment Time</div>
                <div style={{ fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="#047857" />
                  <span>{activeAppointmentApp?.appointment?.timeSlot || '10:00 AM'}</span>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Assigned SRO Office</div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {activeAppointmentApp?.appointment?.sroOffice || 'Sub-Registrar Office Haveli No 5, Pune'}
                </div>
              </div>
            </div>

            {/* Required Documents Callout */}
            <div style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '0.85rem' }}>
              <strong>Required Documents to Bring:</strong>{' '}
              <span>Original Deed Drafts (2 copies), Aadhaar &amp; PAN Card, 7/12 RoR Extract, 2 Witnesses, e-Chalan receipt.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNoticeModalOpen(true)}
              style={{
                backgroundColor: '#064e3b',
                color: '#ffffff',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Eye size={13} />
              <span>View Notice</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNoticeModalOpen(true)}
              style={{
                borderColor: '#cbd5e1',
                color: '#1e293b',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Printer size={13} />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Right Card: Notification Center */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #ffffff 100%)',
            borderRadius: '12px',
            border: '1px solid #bbf7d0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Bell size={16} color="#065f46" />
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#064e3b' }}>
                  Notification Center
                </span>
              </div>
              <Badge variant="info">New Update</Badge>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dcfce7',
                borderRadius: '8px',
                padding: '0.85rem',
                marginBottom: '0.65rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>
                  New appointment scheduled
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                Your appointment is on <strong>05 October</strong> at 10:00 AM at SRO Pune. Please bring the required documents.
              </p>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              SMS &amp; Email reminders will be dispatched 24 hours prior to your slot.
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <Link
              to="/citizen/notifications"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#065f46',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <span>View All Notifications ({userNotifications.length})</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ROW 2: 4 Small KPI Stat Boxes with Wave Graphs & Left Colored Accent */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.85rem',
        }}
      >
        {/* Box 1: LAND PARCELS (Green) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            borderLeft: '3.5px solid #16a34a',
            padding: '0.75rem 0.95rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Layers size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                LAND PARCELS
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '2px 0 1px' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>
                  {userParcels.length}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                  Parcels
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Area: {totalArea.toFixed(2)} Ha (0 R)
              </div>
            </div>
          </div>

          {/* Wave SVG */}
          <svg
            viewBox="0 0 80 35"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '75px',
              height: '32px',
              pointerEvents: 'none',
              opacity: 0.8,
            }}
          >
            <path
              d="M0,25 Q20,10 40,20 T80,8 L80,35 L0,35 Z"
              fill="rgba(22, 163, 74, 0.08)"
            />
            <path
              d="M0,25 Q20,10 40,20 T80,8"
              fill="none"
              stroke="#86efac"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Box 2: MUTATIONS (Orange) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            borderLeft: '3.5px solid #ea580c',
            padding: '0.75rem 0.95rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#fff7ed',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <GitPullRequest size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                MUTATIONS
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '2px 0 1px' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ea580c', lineHeight: 1 }}>
                  {userMutations.length}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                  Cases
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                e-Ferfar &amp; RoR changes
              </div>
            </div>
          </div>

          {/* Wave SVG */}
          <svg
            viewBox="0 0 80 35"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '75px',
              height: '32px',
              pointerEvents: 'none',
              opacity: 0.8,
            }}
          >
            <path
              d="M0,28 Q25,12 45,22 T80,10 L80,35 L0,35 Z"
              fill="rgba(234, 88, 12, 0.08)"
            />
            <path
              d="M0,28 Q25,12 45,22 T80,10"
              fill="none"
              stroke="#fed7aa"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Box 3: APPLICATIONS (Blue) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            borderLeft: '3.5px solid #2563eb',
            padding: '0.75rem 0.95rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ClipboardList size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                APPLICATIONS
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '2px 0 1px' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563eb', lineHeight: 1 }}>
                  {userApplications.length}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                  Submitted
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                7/12, 8A &amp; Mojani
              </div>
            </div>
          </div>

          {/* Wave SVG */}
          <svg
            viewBox="0 0 80 35"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '75px',
              height: '32px',
              pointerEvents: 'none',
              opacity: 0.8,
            }}
          >
            <path
              d="M0,22 Q20,30 45,14 T80,12 L80,35 L0,35 Z"
              fill="rgba(37, 99, 235, 0.08)"
            />
            <path
              d="M0,22 Q20,30 45,14 T80,12"
              fill="none"
              stroke="#bfdbfe"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Box 4: ALERTS & NOTICES (Purple) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            borderLeft: '3.5px solid #9333ea',
            padding: '0.75rem 0.95rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#faf5ff',
                color: '#9333ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                ALERTS &amp; NOTICES
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '2px 0 1px' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#9333ea', lineHeight: 1 }}>
                  {unreadNotifications.length}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                  Unread
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Security &amp; Mutation
              </div>
            </div>
          </div>

          {/* Wave SVG */}
          <svg
            viewBox="0 0 80 35"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '75px',
              height: '32px',
              pointerEvents: 'none',
              opacity: 0.8,
            }}
          >
            <path
              d="M0,26 Q20,8 45,20 T80,15 L80,35 L0,35 Z"
              fill="rgba(147, 51, 234, 0.08)"
            />
            <path
              d="M0,26 Q20,8 45,20 T80,15"
              fill="none"
              stroke="#e9d5ff"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* 3. ROW 3: Quick Action Pill Buttons Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.75rem',
        }}
      >
        <Link
          to="/citizen/search"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 12px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            color: '#334155',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <Search size={14} color="#475569" />
          <span>Search Cadastre</span>
        </Link>

        <Link
          to="/citizen/documents"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 12px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            color: '#334155',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <FileText size={14} color="#475569" />
          <span>Documents Vault</span>
        </Link>

        <Link
          to="/citizen/due-diligence"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 12px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            color: '#334155',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <ShieldCheck size={14} color="#475569" />
          <span>Due Diligence</span>
        </Link>

        <Link
          to="/citizen/watchlist"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 12px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            color: '#334155',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <Bookmark size={14} color="#475569" />
          <span>Watchlist</span>
        </Link>

        <Link
          to="/citizen/grievances"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 12px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            color: '#334155',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <Scale size={14} color="#475569" />
          <span>e-Grievance</span>
        </Link>
      </div>

      {/* 4. ROW 4: My Landholdings (Form 8A Registry) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.15rem 1.35rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Layers size={17} color="#059669" />
            <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
              My Landholdings (Form 8A Registry)
            </span>
          </div>
          <Link
            to="/citizen/parcels"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#2563eb',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>View All ({userParcels.length})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 0.85rem' }}>
          Authentic cadastral land parcels verified against e-Mahabhumi records
        </p>

        {/* Parcels Table OR Illustrated Farmland Empty State */}
        {userParcels.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>Sr. No.</th>
                  <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>Survey No. / Gat No.</th>
                  <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>Village</th>
                  <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>Taluka</th>
                  <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>District</th>
                  <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>Area (Ha)</th>
                  <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>Land Use</th>
                  <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userParcels.map((p, idx) => (
                  <tr key={p.id || p.ulpin || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0.4rem', color: '#64748b' }}>{idx + 1}</td>
                    <td style={{ padding: '0.65rem 0.4rem', fontWeight: 700, color: '#0f172a' }}>
                      {p.survey_number || p.surveyNumber || 'Gat No. 42/1'}
                    </td>
                    <td style={{ padding: '0.65rem 0.4rem', color: '#334155' }}>
                      {p.village_name || p.village || 'Wagholi'}
                    </td>
                    <td style={{ padding: '0.65rem 0.4rem', color: '#334155' }}>
                      {p.taluka_name || p.taluka || 'Haveli'}
                    </td>
                    <td style={{ padding: '0.65rem 0.4rem', color: '#334155' }}>
                      {p.district_name || p.district || 'Pune'}
                    </td>
                    <td style={{ padding: '0.65rem 0.4rem', fontWeight: 700, color: '#064e3b' }}>
                      {p.area ? `${parseFloat(p.area).toFixed(2)} Ha` : '1.45 Ha'}
                    </td>
                    <td style={{ padding: '0.65rem 0.4rem' }}>
                      <span
                        style={{
                          backgroundColor: '#ecfdf5',
                          color: '#047857',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '1px 7px',
                          borderRadius: '10px',
                        }}
                      >
                        {p.land_use || p.landType || 'Agricultural'}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.4rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenRor(p)}
                        style={{
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '5px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#064e3b',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Eye size={11} />
                        <span>View 7/12 RoR</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Clean Empty State */
          <div
            style={{
              borderRadius: '10px',
              border: '1px dashed #cbd5e1',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.65rem',
                border: '1px solid #bbf7d0',
              }}
            >
              <Layers size={22} />
            </div>

            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              No land parcels linked yet
            </div>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 auto 1rem', maxWidth: '480px' }}>
              Link your 7/12 RoR via Mobile Seeding or Search Cadastre to view your certified parcels.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                to="/citizen/profile"
                style={{
                  backgroundColor: '#064e3b',
                  color: '#ffffff',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(6, 78, 59, 0.25)',
                }}
              >
                Go to Mobile Seeding in Profile
              </Link>
              <Link
                to="/citizen/search"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                Search Land Registry
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ─── OFFICIAL SRO APPOINTMENT NOTICE MODAL ───────────────────────────── */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="📄 Official SRO Appointment Notice (Form SRO-17)"
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Printable Notice Card */}
          <div
            id="printable-citizen-sro-notice"
            style={{
              border: '2px solid #064e3b',
              borderRadius: '8px',
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontFamily: 'Georgia, serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #064e3b', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>
                GOVERNMENT OF MAHARASHTRA &bull; REGISTRATION &amp; STAMPS DEPARTMENT
              </div>
              <h2 style={{ margin: '0.4rem 0 0.2rem', color: '#064e3b', fontSize: '1.4rem', fontWeight: 800 }}>
                BHARATBHUMI — SRO APPOINTMENT NOTICE
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                Sub-Registrar Office Appointment Confirmation under Registration Act 1908
              </div>
            </div>

            {/* Notice Metadata Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, width: '38%', color: '#475569' }}>Notice ID:</td>
                  <td style={{ padding: '0.45rem 0', fontWeight: 800, color: '#064e3b' }}>
                    {activeAppointmentApp?.appointment?.noticeId || 'SRO-2026-001'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#475569' }}>Citizen Name:</td>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700 }}>
                    {currentCitizen.name || activeAppointmentApp?.citizenName || 'Ankush Vishwakarma'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#475569' }}>Application ID:</td>
                  <td style={{ padding: '0.45rem 0', fontFamily: 'monospace', fontWeight: 700 }}>
                    {activeAppointmentApp?.id || 'APP-1025'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#475569' }}>Parcel ID:</td>
                  <td style={{ padding: '0.45rem 0', fontFamily: 'monospace' }}>
                    {activeAppointmentApp?.parcelId || 'MH-PUN-1025'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#475569' }}>Service:</td>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#065f46' }}>
                    {activeAppointmentApp?.serviceType || 'Property Registration'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#475569' }}>SRO Office:</td>
                  <td style={{ padding: '0.45rem 0' }}>
                    {activeAppointmentApp?.appointment?.sroOffice || 'Sub-Registrar Office Haveli No 5, Pune'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#475569' }}>Appointment Date:</td>
                  <td style={{ padding: '0.45rem 0', fontWeight: 800, color: '#0f172a' }}>
                    {activeAppointmentApp?.appointment?.date || '5 October 2026'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#475569' }}>Appointment Time:</td>
                  <td style={{ padding: '0.45rem 0', fontWeight: 800, color: '#047857' }}>
                    {activeAppointmentApp?.appointment?.timeSlot || '10:00 AM'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#475569' }}>Status:</td>
                  <td style={{ padding: '0.45rem 0' }}>
                    <span style={{ fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                      {activeAppointmentApp?.appointment?.status || 'SCHEDULED'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700, color: '#475569' }}>Issued By:</td>
                  <td style={{ padding: '0.45rem 0', fontWeight: 700 }}>
                    Sub-Registrar Office Haveli No 5, Pune
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Instructions */}
            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '0.85rem 1rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.35rem', color: '#064e3b' }}>
                📌 Required Documents &amp; Instructions to Bring:
              </strong>
              <ul style={{ margin: '0 0 0 1rem', padding: 0, color: '#334155', lineHeight: 1.5 }}>
                <li>Original Deed Draft (2 copies on appropriate Stamp Paper)</li>
                <li>Aadhaar Cards &amp; PAN Cards of Executant (Seller) &amp; Claimant (Buyer)</li>
                <li>Recent Digitally Signed 7/12 RoR Extract &amp; Form 8A Khata Certificate</li>
                <li>Stamp Duty &amp; Registration Fee e-Chalan Payment Receipt (GRAS / Cyber Treasury)</li>
                <li>Two Witnesses / Identifiers with Aadhaar / Voter ID Cards</li>
              </ul>
            </div>

            {/* Footer Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
              <div>
                <div>Digitally verified by BharatBhumi SRO Portal</div>
                <div>Security Seal: QR-SEC-2026-HA-592</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: '#064e3b' }}>Sub-Registrar (Haveli No 5)</div>
                <div>Pune Division, Maharashtra</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setIsNoticeModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => window.print()}
              style={{ backgroundColor: '#064e3b', fontWeight: 700 }}
            >
              <Printer size={15} style={{ marginRight: '6px' }} />
              Download PDF / Print Notice
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CitizenDashboard;
