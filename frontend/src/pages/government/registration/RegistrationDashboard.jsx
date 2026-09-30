import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import applicationService from '../../../services/applicationService';
import parcelService from '../../../services/parcelService';
import KPIStat from '../../../components/government/KPIStat';
import AuthorityGisMap from '../../../components/government/AuthorityGisMap';
import { ROLES } from '../../../config/roles';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Modal from '../../../components/ui/Modal';
import {
  FileSignature,
  Layers,
  Search,
  CheckCircle2,
  AlertOctagon,
  Calculator,
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  Check,
  X,
  RotateCcw,
  Plus,
  Send,
  Printer,
  ShieldCheck,
  Building,
  Scale,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const RegistrationDashboard = () => {
  const { user } = useAuth();

  // Navigation State
  // 'DASHBOARD' | 'REQUESTS' | 'APPOINTMENTS' | 'CALENDAR' | 'SLOTS' | 'NOTICES' | 'HISTORY' | 'AUDIT' | 'GIS_MAP' | 'VALUATION_BANDS'
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  // Appointments State
  const [allAppointments, setAllAppointments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [officeSlots, setOfficeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bannerAlert, setBannerAlert] = useState(null);

  // Modals & Action State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedNoticeApp, setSelectedNoticeApp] = useState(null);

  // Form State for Scheduling
  const [formCitizenName, setFormCitizenName] = useState('');
  const [formApplicationId, setFormApplicationId] = useState('');
  const [formParcelId, setFormParcelId] = useState('');
  const [formServiceType, setFormServiceType] = useState('Property Registration');
  const [formSroOffice, setFormSroOffice] = useState('Sub-Registrar Office Haveli No 5, Pune');
  const [formAppointmentDate, setFormAppointmentDate] = useState('2026-10-05');
  const [formTimeSlot, setFormTimeSlot] = useState('10:00 AM');
  const [formInstructions, setFormInstructions] = useState(
    'Please bring original deed drafts (2 copies), parties Aadhaar/PAN cards, 7/12 RoR extract, 2 witnesses with ID proof, and stamp duty e-Chalan payment receipt.'
  );
  const [formStatus, setFormStatus] = useState('Scheduled');

  // Form State for Rescheduling & Cancellation
  const [rescheduleDate, setRescheduleDate] = useState('2026-10-06');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('11:00 AM');
  const [rescheduleReason, setRescheduleReason] = useState('SRO Office capacity adjustment');
  const [cancelReason, setCancelReason] = useState('Incomplete deed annexures submitted');

  // Pre-Registration Audit State
  const [searchUlpin, setSearchUlpin] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditNotice, setAuditNotice] = useState(null);

  // Valuation Calculator State
  const [plotAreaSqm, setPlotAreaSqm] = useState(250);
  const [selectedZoneRate, setSelectedZoneRate] = useState(52000);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, slots] = await Promise.all([
        applicationService.getApplications(),
        applicationService.getAvailableSlots(),
      ]);
      const appList = Array.isArray(apps) ? apps : [];
      setAllAppointments(appList);
      setPendingRequests(appList.filter((a) => a.status === 'PENDING_SCHEDULING' || !a.appointment));
      setOfficeSlots(Array.isArray(slots) ? slots : []);
    } catch (err) {
      console.warn('Error loading SRO appointment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Scheduling
  const openScheduleModal = (req = null) => {
    if (req) {
      setSelectedRequest(req);
      setFormCitizenName(req.citizenName || 'Ankush Vishwakarma');
      setFormApplicationId(req.id || req.applicationNumber || 'APP-1025');
      setFormParcelId(req.parcelId || 'MH-PUN-1025');
      setFormServiceType(req.serviceType || 'Property Registration');
      setFormSroOffice(req.sroOffice || 'Sub-Registrar Office Haveli No 5, Pune');
      setFormAppointmentDate(req.appointment?.date || '2026-10-05');
      setFormTimeSlot(req.appointment?.timeSlot || '10:00 AM');
      setFormInstructions(
        req.appointment?.instructions ||
          'Please bring original deed drafts (2 copies), parties Aadhaar/PAN cards, 7/12 RoR extract, 2 witnesses with ID proof, and stamp duty e-Chalan payment receipt.'
      );
      setFormStatus('Scheduled');
    } else {
      setSelectedRequest(null);
      setFormCitizenName('Ankush Vishwakarma');
      setFormApplicationId(`APP-${Math.floor(1000 + Math.random() * 9000)}`);
      setFormParcelId('MH-PUN-1025');
      setFormServiceType('Property Registration');
      setFormSroOffice('Sub-Registrar Office Haveli No 5, Pune');
      setFormAppointmentDate('2026-10-05');
      setFormTimeSlot('10:00 AM');
      setFormInstructions(
        'Please bring original deed drafts (2 copies), parties Aadhaar/PAN cards, 7/12 RoR extract, 2 witnesses with ID proof, and stamp duty e-Chalan payment receipt.'
      );
      setFormStatus('Scheduled');
    }
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduled = await applicationService.scheduleAppointment({
        applicationId: formApplicationId,
        citizenName: formCitizenName,
        parcelId: formParcelId,
        serviceType: formServiceType,
        sroOffice: formSroOffice,
        appointmentDate: formAppointmentDate,
        timeSlot: formTimeSlot,
        instructions: formInstructions,
        status: formStatus,
      });
      setIsScheduleModalOpen(false);
      setBannerAlert(
        `✅ Appointment scheduled for ${formCitizenName} (${formApplicationId}) on ${formAppointmentDate} at ${formTimeSlot}. Notice ID: ${scheduled.appointment?.noticeId}. Citizen notified.`
      );
      await loadData();
    } catch (err) {
      alert(`Scheduling error: ${err.message}`);
    }
  };

  const openRescheduleModal = (app) => {
    setSelectedRequest(app);
    setRescheduleDate(app.appointment?.date || '2026-10-06');
    setRescheduleTimeSlot(app.appointment?.timeSlot || '11:00 AM');
    setRescheduleReason('Officer calendar rebalancing');
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      await applicationService.rescheduleAppointment(selectedRequest.id, {
        appointmentDate: rescheduleDate,
        timeSlot: rescheduleTimeSlot,
        reason: rescheduleReason,
      });
      setIsRescheduleModalOpen(false);
      setBannerAlert(
        `🔄 Appointment for ${selectedRequest.citizenName} (${selectedRequest.id}) rescheduled to ${rescheduleDate} at ${rescheduleTimeSlot}. Rescheduling notice dispatched.`
      );
      await loadData();
    } catch (err) {
      alert(`Reschedule error: ${err.message}`);
    }
  };

  const openCancelModal = (app) => {
    setSelectedRequest(app);
    setCancelReason('Discrepancy in property valuation or missing title documents');
    setIsCancelModalOpen(true);
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      await applicationService.cancelAppointment(selectedRequest.id, {
        reason: cancelReason,
      });
      setIsCancelModalOpen(false);
      setBannerAlert(
        `🛑 Appointment for ${selectedRequest.citizenName} (${selectedRequest.id}) cancelled. Reason logged & citizen notified.`
      );
      await loadData();
    } catch (err) {
      alert(`Cancellation error: ${err.message}`);
    }
  };

  const handleMarkCompleted = async (app) => {
    try {
      await applicationService.markAppointmentCompleted(app.id);
      setBannerAlert(
        `🎉 Deed registration and verification completed for ${app.citizenName} (${app.id}). NGDRS handover triggered.`
      );
      await loadData();
    } catch (err) {
      alert(`Error completing appointment: ${err.message}`);
    }
  };

  const openNoticeView = (app) => {
    setSelectedNoticeApp(app);
    setIsNoticeModalOpen(true);
  };

  const handleSlotCapacityChange = async (slotTime, change) => {
    const target = officeSlots.find((s) => s.slot === slotTime || s.time === slotTime);
    if (!target) return;
    const newCap = Math.max(0, target.capacity + change);
    const updated = await applicationService.updateSlotCapacity(slotTime, newCap);
    setOfficeSlots(updated);
  };

  // Pre-Registration Audit Check
  const handleAuditCheck = async (targetOverride) => {
    const ulpinToQuery = (targetOverride || searchUlpin || '').trim();
    if (!ulpinToQuery) {
      setAuditNotice('Please enter a valid ULPIN or Gat number.');
      return;
    }
    setAuditLoading(true);
    setAuditNotice(null);
    try {
      const data = await parcelService.getParcel360(ulpinToQuery);
      if (data && data.overview) {
        const overview = data.overview;
        setAuditResult({
          ulpin: overview.ulpin,
          gatNumber: overview.surveyNumber || overview.gatNumber || 'Gat 42',
          village: overview.villageName || 'Wagholi',
          areaHectares: overview.area || 1.45,
          ownerName: overview.currentOwner || data.ownership?.current?.[0]?.owner_name || 'Registered Landholder',
          status: overview.status || 'CLEAR',
          deedNumber: `SRO-PUN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          parties: {
            seller: overview.currentOwner || data.ownership?.current?.[0]?.owner_name || 'Registered Landholder',
            buyer: 'Rohan Kadam (Purchaser)',
          },
          titleStatus: overview.status === 'CLEAR' ? 'CLEAR_MARKETABLE' : 'FLAGGED',
          encumbranceStatus: data.encumbrances && data.encumbrances.length > 0 ? 'ACTIVE_MORTGAGE' : 'NIL',
          stayStatus: data.courtCases && data.courtCases.length > 0 ? 'STAY_PENDING' : 'NO_STAY',
          valuation: data.valuation?.marketValueTotal || 13000000,
          stampDutyExpected: Math.round((data.valuation?.marketValueTotal || 13000000) * 0.06),
          flags: data.restrictions?.map((r) => r.title || r.type) || [],
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        });
        setAuditNotice(`Pre-registration audit verified for ${overview.ulpin}. Title & encumbrance synced from PostgreSQL.`);
      } else {
        setAuditNotice(`No parcel found matching '${ulpinToQuery}'.`);
      }
    } catch (err) {
      console.error('Audit check error:', err);
      setAuditNotice(`Error checking parcel: ${err.message}`);
    } finally {
      setAuditLoading(false);
    }
  };

  const calculatedMarketValue = plotAreaSqm * selectedZoneRate;
  const stampDutyAmt = Math.round(calculatedMarketValue * 0.06);
  const regFeeAmt = Math.min(30000, Math.round(calculatedMarketValue * 0.01));

  // Computed Lists
  const scheduledAppointments = allAppointments.filter(
    (a) => a.appointment && a.appointment.status === 'Scheduled'
  );
  const todayAppointments = allAppointments.filter(
    (a) => a.appointment && (a.appointment.date === '2026-10-05' || a.appointment.date === '2026-10-01')
  );
  const completedAppointments = allAppointments.filter(
    (a) => a.appointment && a.appointment.status === 'Completed'
  );

  return (
    <div
      className="page-registration-dashboard"
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ─── 1. SRO OFFICER HEADER ──────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #033628 50%, #022319 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(6, 78, 59, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef08a',
              }}
            >
              <FileSignature size={22} />
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>
              BHARATBHUMI | SRO PORTAL
            </h1>
            <span
              style={{
                background: '#ea580c',
                color: '#ffffff',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              REGISTRATION ACT 1908
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#e2e8f0', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span>
              <strong>Officer:</strong> {user?.name || 'Rekha Joshi (Sub-Registrar)'}
            </span>
            <span>
              <strong>Office:</strong> Sub-Registrar Office Haveli No 5, Pune
            </span>
            <span>
              <strong>Capacity:</strong> Real-Time SRO Slot Mesh
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            variant="primary"
            onClick={() => openScheduleModal(null)}
            style={{
              backgroundColor: '#f59e0b',
              color: '#1e293b',
              fontWeight: 800,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Plus size={16} />
            <span>Schedule Appointment</span>
          </Button>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 0.85rem',
              borderRadius: '10px',
              textAlign: 'right',
            }}
          >
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              NGDRS Gateway: Active
            </div>
          </div>
        </div>
      </div>

      {bannerAlert && (
        <Alert variant="success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{bannerAlert}</span>
          <button
            type="button"
            onClick={() => setBannerAlert(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'inherit' }}
          >
            &times;
          </button>
        </Alert>
      )}

      {/* ─── 2. APPOINTMENT OVERVIEW (KPIs) ────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          onClick={() => setActiveTab('REQUESTS')}
          style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
        >
          <KPIStat
            title="Pending Requests"
            value={pendingRequests.length.toString()}
            subtitle="Citizen requests awaiting scheduling"
            icon="⏳"
            status={pendingRequests.length > 0 ? 'warning' : 'normal'}
          />
        </div>
        <div
          onClick={() => setActiveTab('APPOINTMENTS')}
          style={{ cursor: 'pointer' }}
        >
          <KPIStat
            title="Scheduled Appointments"
            value={scheduledAppointments.length.toString()}
            subtitle="Notices issued with confirmed slots"
            icon="📅"
            status="primary"
          />
        </div>
        <div
          onClick={() => setActiveTab('CALENDAR')}
          style={{ cursor: 'pointer' }}
        >
          <KPIStat
            title="Today's Appointments"
            value={todayAppointments.length.toString()}
            subtitle="Scheduled for deed execution today"
            icon="⚡"
            status="success"
          />
        </div>
        <div
          onClick={() => setActiveTab('HISTORY')}
          style={{ cursor: 'pointer' }}
        >
          <KPIStat
            title="Completed Registrations"
            value={completedAppointments.length.toString()}
            subtitle="Deeds registered & handed over"
            icon="📜"
            status="normal"
          />
        </div>
      </div>

      {/* ─── 3. NAVIGATION TABS ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {[
          { key: 'DASHBOARD', label: 'Dashboard Overview', icon: FileSignature },
          { key: 'REQUESTS', label: `Requests (${pendingRequests.length})`, icon: Clock },
          { key: 'APPOINTMENTS', label: `Appointments (${scheduledAppointments.length})`, icon: Calendar },
          { key: 'CALENDAR', label: 'Appointment Calendar', icon: Calendar },
          { key: 'SLOTS', label: 'Available Slots & Capacity', icon: Scale },
          { key: 'NOTICES', label: 'Citizen Notices Log', icon: Send },
          { key: 'HISTORY', label: 'Appointment History', icon: CheckCircle2 },
          { key: 'AUDIT', label: 'Title & Encumbrance Audit', icon: Search },
          { key: 'GIS_MAP', label: 'Cadastral GIS Map', icon: Layers },
          { key: 'VALUATION_BANDS', label: 'Ready Reckoner Rates', icon: Calculator },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`ux4g-btn ux4g-btn-sm ${isActive ? 'ux4g-btn-primary' : 'ux4g-btn-outline'}`}
              style={{
                backgroundColor: isActive ? '#064e3b' : undefined,
                borderColor: isActive ? '#064e3b' : undefined,
                color: isActive ? '#ffffff' : undefined,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB: DASHBOARD OVERVIEW ───────────────────────────────────────────── */}
      {activeTab === 'DASHBOARD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section: Citizen Appointment Requests Queue */}
          <Card>
            <div
              style={{
                padding: '1.1rem 1.25rem',
                borderBottom: '1px solid var(--ux4g-border-subtle)',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
                  📋 Citizen Appointment Requests Awaiting SRO Scheduling
                </h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                  Citizens submit requests. The SRO officer reviews and assigns the appointment slot.
                </p>
              </div>
              <Badge variant="warning">{pendingRequests.length} Pending Scheduling</Badge>
            </div>

            <div style={{ padding: '1rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Application ID</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Citizen</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Parcel ID / Gat</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Service Requested</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        🎉 All citizen appointment requests have been scheduled.
                      </td>
                    </tr>
                  ) : (
                    pendingRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>
                          <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {req.id}
                          </code>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#1e293b' }}>
                          {req.citizenName}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>
                          {req.parcelId} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({req.surveyNumber || 'Gat 42'})</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span
                            style={{
                              backgroundColor: '#ecfdf5',
                              color: '#065f46',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {req.serviceType}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <Badge variant="warning">Awaiting Slot</Badge>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openScheduleModal(req)}
                            style={{ backgroundColor: '#064e3b', gap: '4px' }}
                          >
                            <Calendar size={13} />
                            <span>Schedule Appointment</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Section: Live Appointment Calendar Summary */}
          <Card>
            <div
              style={{
                padding: '1.1rem 1.25rem',
                borderBottom: '1px solid var(--ux4g-border-subtle)',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
                  📅 SRO Appointment Calendar (Active Schedules)
                </h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                  Confirmed citizen appointments with assigned date, time, and issued notices.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('CALENDAR')}>
                View Full Calendar &rarr;
              </Button>
            </div>

            <div style={{ padding: '1rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Date</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Time Slot</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Citizen</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Application ID</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Notice ID</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allAppointments
                    .filter((a) => a.appointment)
                    .map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>
                          {app.appointment.date}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#047857' }}>
                          <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                          {app.appointment.timeSlot}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#1e293b' }}>
                          {app.citizenName}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <code>{app.id}</code>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>
                            {app.appointment.noticeId}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <Badge
                            variant={
                              app.appointment.status === 'Scheduled'
                                ? 'success'
                                : app.appointment.status === 'Rescheduled'
                                ? 'warning'
                                : app.appointment.status === 'Completed'
                                ? 'primary'
                                : 'danger'
                            }
                          >
                            {app.appointment.status}
                          </Badge>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openNoticeView(app)}
                              title="View Official Notice"
                            >
                              <FileText size={13} />
                              <span>Notice</span>
                            </Button>
                            {app.appointment.status !== 'Completed' && app.appointment.status !== 'Cancelled' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openRescheduleModal(app)}
                                  title="Reschedule Appointment"
                                >
                                  <RotateCcw size={13} />
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleMarkCompleted(app)}
                                  style={{ backgroundColor: '#16a34a' }}
                                  title="Mark Deed Verification Completed"
                                >
                                  <Check size={13} />
                                  <span>Complete</span>
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => openCancelModal(app)}
                                  title="Cancel Appointment"
                                >
                                  <X size={13} />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB: REQUESTS ────────────────────────────────────────────────────── */}
      {activeTab === 'REQUESTS' && (
        <Card>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <h2 style={{ fontSize: '1.15rem', margin: 0, color: '#064e3b', fontWeight: 800 }}>
              Citizen Land Registration Requests (Awaiting SRO Slot Scheduling)
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Step 2 in the SRO Workflow: SRO reviews the request details, verifies land records, and assigns the official appointment slot.
            </p>
          </div>

          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1.15rem',
                  background: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                      {req.citizenName}
                    </h3>
                    <code style={{ fontSize: '0.78rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                      {req.id}
                    </code>
                    <Badge variant="warning">Awaiting Scheduling</Badge>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>
                      <strong>Service:</strong> {req.serviceType}
                    </span>
                    <span>
                      <strong>Parcel ID:</strong> {req.parcelId}
                    </span>
                    <span>
                      <strong>Gat:</strong> {req.surveyNumber || 'Gat 42'}
                    </span>
                    <span>
                      <strong>Office:</strong> {req.sroOffice}
                    </span>
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>
                    <strong>Required Documents:</strong> {req.requiredDocs?.join(', ') || 'Original Deed Draft, Aadhaar, PAN, 7/12 RoR'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="primary"
                    onClick={() => openScheduleModal(req)}
                    style={{ backgroundColor: '#064e3b', fontWeight: 700 }}
                  >
                    <Calendar size={15} style={{ marginRight: '6px' }} />
                    Schedule Appointment Slot
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─── TAB: APPOINTMENTS & CALENDAR ─────────────────────────────────────── */}
      {(activeTab === 'APPOINTMENTS' || activeTab === 'CALENDAR') && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#064e3b', fontWeight: 800 }}>
                📅 SRO Appointment Schedule &amp; Execution Calendar
              </h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Manage confirmed citizen appointments, print notices, reschedule slots, and mark deed verifications as completed.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => openScheduleModal(null)}
              style={{ backgroundColor: '#064e3b', fontWeight: 700 }}
            >
              <Plus size={15} style={{ marginRight: '4px' }} />
              New Appointment
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {allAppointments
              .filter((a) => a.appointment)
              .map((app) => (
                <div
                  key={app.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderLeft: `4px solid ${
                      app.appointment.status === 'Scheduled'
                        ? '#16a34a'
                        : app.appointment.status === 'Rescheduled'
                        ? '#ea580c'
                        : app.appointment.status === 'Completed'
                        ? '#2563eb'
                        : '#dc2626'
                    }`,
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    background: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div
                      style={{
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.5rem 0.85rem',
                        minWidth: '90px',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        {app.appointment.date?.split('-')[1] || 'OCT'}
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b', lineHeight: 1.1 }}>
                        {app.appointment.date?.split('-')[2] || '05'}
                      </div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#047857', marginTop: '2px' }}>
                        {app.appointment.timeSlot}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                          {app.citizenName}
                        </h4>
                        <Badge
                          variant={
                            app.appointment.status === 'Scheduled'
                              ? 'success'
                              : app.appointment.status === 'Rescheduled'
                              ? 'warning'
                              : app.appointment.status === 'Completed'
                              ? 'primary'
                              : 'danger'
                          }
                        >
                          {app.appointment.status}
                        </Badge>
                        <span style={{ fontSize: '0.75rem', color: '#1e40af', background: '#eff6ff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Notice: {app.appointment.noticeId}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>
                          <strong>App ID:</strong> {app.id}
                        </span>
                        <span>
                          <strong>Parcel:</strong> {app.parcelId}
                        </span>
                        <span>
                          <strong>Service:</strong> {app.serviceType}
                        </span>
                        <span>
                          <strong>Office:</strong> {app.appointment.sroOffice}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem' }}>
                        <strong>Instructions:</strong> {app.appointment.instructions}
                      </div>
                      {app.appointment.rescheduleReason && (
                        <div style={{ fontSize: '0.76rem', color: '#c2410c', marginTop: '0.2rem' }}>
                          <strong>Reschedule Reason:</strong> {app.appointment.rescheduleReason}
                        </div>
                      )}
                      {app.appointment.cancellationReason && (
                        <div style={{ fontSize: '0.76rem', color: '#b91c1c', marginTop: '0.2rem' }}>
                          <strong>Cancellation Reason:</strong> {app.appointment.cancellationReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                    <Button variant="outline" size="sm" onClick={() => openNoticeView(app)}>
                      <FileText size={14} style={{ marginRight: '4px' }} />
                      View Notice
                    </Button>
                    {app.appointment.status !== 'Completed' && app.appointment.status !== 'Cancelled' && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => openRescheduleModal(app)}>
                          <RotateCcw size={14} style={{ marginRight: '4px' }} />
                          Reschedule
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleMarkCompleted(app)}
                          style={{ backgroundColor: '#16a34a' }}
                        >
                          <Check size={14} style={{ marginRight: '4px' }} />
                          Complete
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => openCancelModal(app)}>
                          <X size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* ─── TAB: AVAILABLE SLOTS & CAPACITY MANAGER ───────────────────────────── */}
      {activeTab === 'SLOTS' && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
              🏢 Sub-Registrar Office Capacity &amp; Slot Management (Pune Haveli No 5)
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Define hourly citizen intake limits and monitor real-time booking distribution across registration counters.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {officeSlots.map((slotItem) => {
              const isFull = slotItem.booked >= slotItem.capacity;
              const percent = slotItem.capacity > 0 ? Math.round((slotItem.booked / slotItem.capacity) * 100) : 0;
              return (
                <div
                  key={slotItem.slot}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '1.1rem',
                    background: isFull ? '#fff1f2' : '#f8fafc',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-2px' }} />
                      {slotItem.time}
                    </span>
                    <Badge variant={isFull ? 'danger' : 'success'}>
                      {isFull ? 'Full' : `${slotItem.capacity - slotItem.booked} Available`}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569', marginBottom: '0.4rem' }}>
                    <span>Booked: <strong>{slotItem.booked}</strong></span>
                    <span>Total Capacity: <strong>{slotItem.capacity}</strong></span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, percent)}%`,
                        backgroundColor: isFull ? '#e11d48' : percent > 70 ? '#f59e0b' : '#10b981',
                        borderRadius: '4px',
                      }}
                    />
                  </div>

                  {/* Capacity Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Adjust Capacity:</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSlotCapacityChange(slotItem.slot, -1)}
                        style={{ padding: '2px 8px' }}
                      >
                        -1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSlotCapacityChange(slotItem.slot, 1)}
                        style={{ padding: '2px 8px' }}
                      >
                        +1
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─── TAB: CITIZEN NOTICES LOG ──────────────────────────────────────────── */}
      {activeTab === 'NOTICES' && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
              📤 SRO Citizen Notification &amp; Notice Delivery Log
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Automatic notices sent to citizens upon scheduling, rescheduling, and cancellation with document checklists.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {allAppointments
              .filter((a) => a.appointment)
              .map((app) => (
                <div
                  key={app.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.9rem 1.1rem',
                    background: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Send size={14} color="#047857" />
                      <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>
                        Notice {app.appointment.noticeId} &rarr; {app.citizenName}
                      </strong>
                      <Badge variant="info">Delivered to Citizen Portal</Badge>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155' }}>
                      Appointment for {app.serviceType} ({app.id}) on <strong>{app.appointment.date}</strong> at{' '}
                      <strong>{app.appointment.timeSlot}</strong> at {app.appointment.sroOffice}.
                    </p>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => openNoticeView(app)}>
                    <Printer size={13} style={{ marginRight: '4px' }} />
                    View &amp; Print Notice
                  </Button>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* ─── TAB: APPOINTMENT HISTORY ─────────────────────────────────────────── */}
      {activeTab === 'HISTORY' && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
              📜 SRO Appointment &amp; Registration History Archive
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Permanent audit log of deed verifications, executions, cancellations, and completed appointments.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Notice ID</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Citizen</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Parcel ID</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Service</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Date &amp; Slot</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Final Status</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700, textAlign: 'right' }}>Document</th>
                </tr>
              </thead>
              <tbody>
                {allAppointments.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                      {app.appointment?.noticeId || '—'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{app.citizenName}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{app.parcelId}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{app.serviceType}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {app.appointment ? `${app.appointment.date} @ ${app.appointment.timeSlot}` : 'Pending'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Badge
                        variant={
                          app.status === 'COMPLETED'
                            ? 'primary'
                            : app.status === 'SCHEDULED'
                            ? 'success'
                            : app.status === 'RESCHEDULED'
                            ? 'warning'
                            : app.status === 'CANCELLED'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      {app.appointment && (
                        <Button variant="ghost" size="sm" onClick={() => openNoticeView(app)}>
                          View Notice
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ─── TAB: PRE-REGISTRATION AUDIT (EXISTING CAPABILITY) ────────────────── */}
      {activeTab === 'AUDIT' && (
        <Card>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#f8fafc' }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', color: '#064e3b', fontWeight: 800 }}>
              🔍 Instant Pre-Registration Parcel Title &amp; Encumbrance Audit
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
              Run pre-execution compliance check before accepting deed registration under Section 17 of the Registration Act.
            </p>
          </div>

          <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="ux4g-input"
                style={{ flex: 1, minWidth: '260px' }}
                value={searchUlpin}
                onChange={(e) => setSearchUlpin(e.target.value)}
                placeholder="Enter ULPIN (Bhu-Aadhaar) or Gat/Survey Number..."
              />
              <Button variant="primary" onClick={() => handleAuditCheck()} style={{ backgroundColor: '#064e3b' }}>
                Run Pre-Registration Audit
              </Button>
            </div>

            {auditNotice && <Alert variant="info">{auditNotice}</Alert>}

            {/* Persona Quick Picker */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>Quick Audit Targets:</span>
              {[
                { ulpin: 'MH-PUN-1025', label: 'Gat 42 Wagholi (Ankush)' },
                { ulpin: 'MH-PUN-1026', label: 'Gat 118 (Rahul)' },
                { ulpin: 'MH-PUN-1027', label: 'Gat 89/2 (Priya)' },
              ].map((item) => (
                <button
                  key={item.ulpin}
                  type="button"
                  className="ux4g-btn ux4g-btn-sm ux4g-btn-outline"
                  onClick={() => {
                    setSearchUlpin(item.ulpin);
                    handleAuditCheck(item.ulpin);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {auditResult && (
              <div
                style={{
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--ux4g-success)', fontSize: '1.05rem', fontWeight: 800 }}>
                      ✅ AUDIT RESULT: Cleared for Deed Registration
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.2rem' }}>
                      Target: <strong>{auditResult.gatNumber}</strong> | ULPIN: <code>{auditResult.ulpin}</code>
                    </div>
                  </div>
                  <Badge variant="success">Clear Title</Badge>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Canonical RoR Owner:</strong>
                    <div style={{ color: '#064e3b', fontWeight: 700, marginTop: '0.2rem' }}>{auditResult.ownerName}</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Mortgages &amp; Encumbrances:</strong>
                    <div style={{ color: '#047857', fontWeight: 700, marginTop: '0.2rem' }}>{auditResult.encumbranceStatus}</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Court Injunctions &amp; Stays:</strong>
                    <div style={{ color: '#047857', fontWeight: 700, marginTop: '0.2rem' }}>{auditResult.stayStatus}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ─── TAB: GIS MAP (EXISTING CAPABILITY) ─────────────────────────────────── */}
      {activeTab === 'GIS_MAP' && (
        <Card style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
                Haveli SRO Cadastral GIS &amp; Ready Reckoner Map
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                Inspect registered deeds, appointment plots, and valuation bands across Pune Haveli No 5.
              </p>
            </div>
            <Badge variant="primary" style={{ backgroundColor: '#064e3b' }}>
              SRO Haveli 05
            </Badge>
          </div>

          <AuthorityGisMap
            authorityRole={ROLES.SRO}
            activeJurisdiction="Haveli-01 SRO Sub-District"
            height="580px"
            selectedUlpin={searchUlpin}
          />
        </Card>
      )}

      {/* ─── TAB: READY RECKONER VALUATION CALCULATOR ──────────────────────────── */}
      {activeTab === 'VALUATION_BANDS' && (
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#064e3b', fontWeight: 800 }}>
              Maharashtra Annual Statement of Rates (Ready Reckoner 2026-27)
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--ux4g-text-secondary)' }}>
              Official statutory stamp duty and registration fee valuation calculator for Haveli Sub-District
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div className="ux4g-form-group" style={{ marginBottom: '1rem' }}>
                <label className="ux4g-label">Select Ready Reckoner Valuation Zone</label>
                <select
                  className="ux4g-select"
                  value={selectedZoneRate}
                  onChange={(e) => setSelectedZoneRate(Number(e.target.value))}
                >
                  <option value={85000}>Zone A: Commercial Corridor (₹85,000 / sqm)</option>
                  <option value={52000}>Zone B: Residential Non-Agricultural (₹52,000 / sqm)</option>
                  <option value={32000}>Zone C: Gaothan Residential (₹32,000 / sqm)</option>
                  <option value={18000}>Zone D: Agricultural Bagayat (₹18,000 / sqm)</option>
                </select>
              </div>

              <div className="ux4g-form-group" style={{ marginBottom: '1rem' }}>
                <label className="ux4g-label">Plot / Carpet Area (Square Meters)</label>
                <input
                  type="number"
                  className="ux4g-input"
                  value={plotAreaSqm}
                  onChange={(e) => setPlotAreaSqm(Number(e.target.value))}
                />
              </div>
            </div>

            <div
              style={{
                background: '#f0fdf4',
                padding: '1.25rem',
                borderRadius: '10px',
                border: '1px solid #bbf7d0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                  Statutory Duty Assessment
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#064e3b', margin: '0.5rem 0' }}>
                  ₹{calculatedMarketValue.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
                  Calculated Minimum Market Valuation (ASR)
                </div>
              </div>

              <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Stamp Duty (6%):</span>
                  <strong>₹{stampDutyAmt.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Registration Fee (1% capped):</span>
                  <strong>₹{regFeeAmt.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #86efac', paddingTop: '0.5rem', fontWeight: 800, color: '#064e3b', fontSize: '0.95rem' }}>
                  <span>Total Govt Chalan:</span>
                  <span>₹{(stampDutyAmt + regFeeAmt).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ─── MODAL 1: APPOINTMENT SCHEDULING FORM ──────────────────────────────── */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="🗓️ SRO Officer: Assign Citizen Appointment Slot"
        size="lg"
      >
        <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#475569' }}>
            ℹ️ As the SRO Officer, assign a confirmed slot based on office intake capacity. Upon scheduling, an official <strong>BHARATBHUMI — SRO APPOINTMENT NOTICE</strong> will be generated and dispatched to the citizen.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="ux4g-form-group">
              <label className="ux4g-label">Citizen Name (Applicant)</label>
              <input
                type="text"
                className="ux4g-input"
                required
                value={formCitizenName}
                onChange={(e) => setFormCitizenName(e.target.value)}
                placeholder="e.g. Ankush Vishwakarma"
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Application ID</label>
              <input
                type="text"
                className="ux4g-input"
                required
                value={formApplicationId}
                onChange={(e) => setFormApplicationId(e.target.value)}
                placeholder="e.g. APP-1025"
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Parcel ID / Land Reference</label>
              <input
                type="text"
                className="ux4g-input"
                required
                value={formParcelId}
                onChange={(e) => setFormParcelId(e.target.value)}
                placeholder="e.g. MH-PUN-1025"
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Service Type</label>
              <select
                className="ux4g-select"
                value={formServiceType}
                onChange={(e) => setFormServiceType(e.target.value)}
              >
                <option value="Property Registration">Property Registration (Conveyance / Sale Deed)</option>
                <option value="Document Verification">Document &amp; Title Verification</option>
                <option value="Gift Deed Registration">Gift Deed Registration</option>
                <option value="Lease Agreement Registration">Lease Agreement Registration</option>
              </select>
            </div>

            <div className="ux4g-form-group" style={{ gridColumn: 'span 2' }}>
              <label className="ux4g-label">Assigned SRO Office</label>
              <input
                type="text"
                className="ux4g-input"
                required
                value={formSroOffice}
                onChange={(e) => setFormSroOffice(e.target.value)}
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Appointment Date (Officer Selected)</label>
              <input
                type="date"
                className="ux4g-input"
                required
                value={formAppointmentDate}
                onChange={(e) => setFormAppointmentDate(e.target.value)}
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Time Slot (Officer Selected)</label>
              <select
                className="ux4g-select"
                value={formTimeSlot}
                onChange={(e) => setFormTimeSlot(e.target.value)}
              >
                <option value="09:00 AM">09:00 AM - 10:00 AM (Morning Slot 1)</option>
                <option value="10:00 AM">10:00 AM - 11:00 AM (Morning Slot 2)</option>
                <option value="11:00 AM">11:00 AM - 12:00 PM (Morning Slot 3)</option>
                <option value="12:00 PM">12:00 PM - 01:00 PM (Midday Slot)</option>
                <option value="02:00 PM">02:00 PM - 03:00 PM (Afternoon Slot 1)</option>
                <option value="03:00 PM">03:00 PM - 04:00 PM (Afternoon Slot 2)</option>
                <option value="04:00 PM">04:00 PM - 05:00 PM (Closing Slot)</option>
              </select>
            </div>

            <div className="ux4g-form-group" style={{ gridColumn: 'span 2' }}>
              <label className="ux4g-label">Instructions &amp; Required Documents to Bring</label>
              <textarea
                className="ux4g-textarea"
                rows={3}
                value={formInstructions}
                onChange={(e) => setFormInstructions(e.target.value)}
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Initial Status</label>
              <select
                className="ux4g-select"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" style={{ backgroundColor: '#064e3b', fontWeight: 700 }}>
              <Send size={15} style={{ marginRight: '6px' }} />
              Schedule Appointment &amp; Issue Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── MODAL 2: RESCHEDULE APPOINTMENT ─────────────────────────────────── */}
      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        title={`🔄 Reschedule Appointment: ${selectedRequest?.citizenName} (${selectedRequest?.id})`}
      >
        <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="ux4g-form-group">
            <label className="ux4g-label">New Appointment Date</label>
            <input
              type="date"
              className="ux4g-input"
              required
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
            />
          </div>

          <div className="ux4g-form-group">
            <label className="ux4g-label">New Time Slot</label>
            <select
              className="ux4g-select"
              value={rescheduleTimeSlot}
              onChange={(e) => setRescheduleTimeSlot(e.target.value)}
            >
              <option value="09:00 AM">09:00 AM - 10:00 AM</option>
              <option value="10:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM">11:00 AM - 12:00 PM</option>
              <option value="12:00 PM">12:00 PM - 01:00 PM</option>
              <option value="02:00 PM">02:00 PM - 03:00 PM</option>
              <option value="03:00 PM">03:00 PM - 04:00 PM</option>
            </select>
          </div>

          <div className="ux4g-form-group">
            <label className="ux4g-label">Reason for Rescheduling (Will be sent to citizen)</label>
            <textarea
              className="ux4g-textarea"
              rows={2}
              required
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" style={{ backgroundColor: '#ea580c', fontWeight: 700 }}>
              Confirm Rescheduling &amp; Notify Citizen
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── MODAL 3: CANCEL APPOINTMENT ─────────────────────────────────────── */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={`🛑 Cancel Appointment: ${selectedRequest?.citizenName}`}
      >
        <form onSubmit={handleCancelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
            Are you sure you want to cancel this appointment for <strong>{selectedRequest?.id}</strong>? A formal cancellation notice with the stated reason will be delivered to the citizen.
          </p>

          <div className="ux4g-form-group">
            <label className="ux4g-label">Cancellation Reason</label>
            <textarea
              className="ux4g-textarea"
              rows={3}
              required
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsCancelModalOpen(false)}>
              Back
            </Button>
            <Button variant="danger" type="submit" style={{ fontWeight: 700 }}>
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── MODAL 4: OFFICIAL SRO APPOINTMENT NOTICE (PDF/PRINT VIEW) ────────── */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="📄 Official SRO Appointment Notice (Form SRO-17)"
        size="lg"
      >
        {selectedNoticeApp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Printable Notice Container */}
            <div
              id="printable-sro-notice"
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
                <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>
                  GOVERNMENT OF MAHARASHTRA &bull; REGISTRATION &amp; STAMPS DEPARTMENT
                </div>
                <h2 style={{ margin: '0.4rem 0 0.2rem', color: '#064e3b', fontSize: '1.4rem', fontWeight: 800 }}>
                  BHARATBHUMI — SRO APPOINTMENT NOTICE
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Issued under Section 17 &amp; 32 of The Registration Act, 1908
                </div>
              </div>

              {/* Notice Metadata Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, width: '35%', color: '#475569' }}>Notice ID:</td>
                    <td style={{ padding: '0.5rem 0', fontWeight: 800, color: '#064e3b' }}>
                      {selectedNoticeApp.appointment?.noticeId || 'SRO-2026-001'}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Citizen Name:</td>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700 }}>
                      {selectedNoticeApp.citizenName || 'Ankush Vishwakarma'}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Application ID:</td>
                    <td style={{ padding: '0.5rem 0', fontFamily: 'monospace', fontWeight: 700 }}>
                      {selectedNoticeApp.id}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Parcel ID:</td>
                    <td style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                      {selectedNoticeApp.parcelId}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Service:</td>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#065f46' }}>
                      {selectedNoticeApp.serviceType}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>SRO Office:</td>
                    <td style={{ padding: '0.5rem 0' }}>
                      {selectedNoticeApp.appointment?.sroOffice || selectedNoticeApp.sroOffice}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Appointment Date:</td>
                    <td style={{ padding: '0.5rem 0', fontWeight: 800, color: '#0f172a' }}>
                      {selectedNoticeApp.appointment?.date || '5 October 2026'}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Appointment Time:</td>
                    <td style={{ padding: '0.5rem 0', fontWeight: 800, color: '#047857' }}>
                      {selectedNoticeApp.appointment?.timeSlot || '10:00 AM'}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Status:</td>
                    <td style={{ padding: '0.5rem 0' }}>
                      <span style={{ fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                        {selectedNoticeApp.appointment?.status || 'SCHEDULED'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Issued By:</td>
                    <td style={{ padding: '0.5rem 0', fontWeight: 700 }}>
                      Sub-Registrar Office Haveli No 5, Pune
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Instructions Box */}
              <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '0.85rem 1rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.35rem', color: '#064e3b' }}>
                  📌 Officer Instructions &amp; Mandatory Documents:
                </strong>
                <p style={{ margin: 0, color: '#334155', lineHeight: 1.5 }}>
                  {selectedNoticeApp.appointment?.instructions ||
                    'Please arrive 15 minutes before the scheduled time with 2 original deed drafts, parties Aadhaar/PAN cards, 7/12 extract, 2 witnesses with Aadhaar cards, and stamp duty e-Chalan payment receipt.'}
                </p>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
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
        )}
      </Modal>
    </div>
  );
};

export default RegistrationDashboard;
