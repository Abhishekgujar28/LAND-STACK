import apiClient from '../api/client';
import notificationService from './notificationService';

const SRO_APPOINTMENTS_STORAGE_KEY = 'land_stack_sro_appointments';
const SRO_SLOTS_STORAGE_KEY = 'land_stack_sro_slots';

const DEFAULT_APPOINTMENT_REQUESTS = [
  {
    id: 'APP-1025',
    applicationNumber: 'APP-1025',
    citizenId: 'CITIZEN-001',
    citizenName: 'Ankush Vishwakarma',
    parcelId: 'MH-PUN-1025',
    surveyNumber: 'Gat No. 42/1',
    serviceType: 'Property Registration',
    serviceCategory: 'Conveyance Deed Registration',
    sroOffice: 'Sub-Registrar Office Haveli No 5, Pune',
    status: 'SCHEDULED',
    submissionDate: '2026-10-01T08:30:00Z',
    requiredDocs: [
      'Original Conveyance / Sale Deed Draft (2 Copies)',
      'Aadhaar Card & PAN Card of Seller & Buyer',
      'Recent Digitally Signed 7/12 RoR Extract',
      'e-Chalan Payment Receipt for Stamp Duty & Registration Fee',
      'Two Identifier / Witness ID Proofs (Aadhaar/EPIC)',
    ],
    appointment: {
      noticeId: 'SRO-2026-001',
      date: '2026-10-05',
      timeSlot: '10:00 AM',
      sroOffice: 'Sub-Registrar Office Haveli No 5, Pune',
      status: 'Scheduled',
      issuedBy: 'Sub-Registrar Office Haveli No 5, Pune',
      scheduledAt: '2026-10-01T09:00:00Z',
      instructions: 'Please arrive 15 minutes before the scheduled time with original documents, 2 witnesses with Aadhaar cards, and e-Chalan payment receipt.',
    },
  },
  {
    id: 'APP-1026',
    applicationNumber: 'APP-1026',
    citizenId: 'CITIZEN-002',
    citizenName: 'Rahul Sharma',
    parcelId: 'MH-PUN-1026',
    surveyNumber: 'Gat No. 118',
    serviceType: 'Document Verification',
    serviceCategory: 'Mortgage Title Deed Clearance',
    sroOffice: 'Sub-Registrar Office Haveli No 5, Pune',
    status: 'SCHEDULED',
    submissionDate: '2026-10-01T09:15:00Z',
    requiredDocs: [
      'Original Mortgage Deed Draft',
      'Bank Sanction Letter & NOC',
      '7/12 Extract & Form 8A Khata Certificate',
      'Aadhaar Card of Executant',
    ],
    appointment: {
      noticeId: 'SRO-2026-002',
      date: '2026-10-05',
      timeSlot: '11:00 AM',
      sroOffice: 'Sub-Registrar Office Haveli No 5, Pune',
      status: 'Scheduled',
      issuedBy: 'Sub-Registrar Office Haveli No 5, Pune',
      scheduledAt: '2026-10-01T09:20:00Z',
      instructions: 'Verify bank authorization letter and provide original title clearance certificate at Desk 3.',
    },
  },
  {
    id: 'APP-1027',
    applicationNumber: 'APP-1027',
    citizenId: 'CITIZEN-003',
    citizenName: 'Priya Patil',
    parcelId: 'MH-PUN-1027',
    surveyNumber: 'Gat No. 89/2',
    serviceType: 'Property Registration',
    serviceCategory: 'Gift Deed Registration',
    sroOffice: 'Sub-Registrar Office Haveli No 5, Pune',
    status: 'SCHEDULED',
    submissionDate: '2026-10-01T10:00:00Z',
    requiredDocs: [
      'Original Gift Deed on Non-Judicial Stamp Paper',
      'Aadhaar Cards of Donor and Donee',
      'Family Relationship Affidavit',
      '7/12 RoR Extract',
    ],
    appointment: {
      noticeId: 'SRO-2026-003',
      date: '2026-10-06',
      timeSlot: '12:00 PM',
      sroOffice: 'Sub-Registrar Office Haveli No 5, Pune',
      status: 'Scheduled',
      issuedBy: 'Sub-Registrar Office Haveli No 5, Pune',
      scheduledAt: '2026-10-01T10:30:00Z',
      instructions: 'Donor and Donee presence mandatory with biometrics verification at SRO Haveli Desk 1.',
    },
  },
  {
    id: 'APP-1028',
    applicationNumber: 'APP-1028',
    citizenId: 'CITIZEN-004',
    citizenName: 'Vikram Shinde',
    parcelId: 'MH-PUN-1028',
    surveyNumber: 'Gat No. 64/B',
    serviceType: 'Property Registration',
    serviceCategory: 'Sale Deed (Agricultural to NA)',
    sroOffice: 'Sub-Registrar Office Haveli No 5, Pune',
    status: 'PENDING_SCHEDULING',
    submissionDate: '2026-10-01T11:45:00Z',
    requiredDocs: [
      'Sale Deed Draft',
      'NA Sanction Order from SDO',
      'Pre-Registration Encumbrance Search Report',
      'Parties Aadhaar & PAN Card',
    ],
    appointment: null,
  },
  {
    id: 'APP-1029',
    applicationNumber: 'APP-1029',
    citizenId: 'CITIZEN-005',
    citizenName: 'Sunita Deshmukh',
    parcelId: 'MH-PUN-1029',
    surveyNumber: 'Gat No. 204',
    serviceType: 'Document Verification',
    serviceCategory: 'Lease Agreement Registration (10 Years)',
    sroOffice: 'Sub-Registrar Office Haveli No 5, Pune',
    status: 'PENDING_SCHEDULING',
    submissionDate: '2026-10-01T12:10:00Z',
    requiredDocs: [
      'Commercial Lease Agreement Draft',
      'Property Tax Clearance Certificate',
      'Authorized Signatory Resolution & KYC',
    ],
    appointment: null,
  },
];

const DEFAULT_OFFICE_SLOTS = [
  { time: '09:00 AM - 10:00 AM', slot: '09:00 AM', capacity: 6, booked: 4 },
  { time: '10:00 AM - 11:00 AM', slot: '10:00 AM', capacity: 6, booked: 5 },
  { time: '11:00 AM - 12:00 PM', slot: '11:00 AM', capacity: 6, booked: 6 },
  { time: '12:00 PM - 01:00 PM', slot: '12:00 PM', capacity: 6, booked: 2 },
  { time: '02:00 PM - 03:00 PM', slot: '02:00 PM', capacity: 6, booked: 3 },
  { time: '03:00 PM - 04:00 PM', slot: '03:00 PM', capacity: 6, booked: 1 },
  { time: '04:00 PM - 05:00 PM', slot: '04:00 PM', capacity: 6, booked: 0 },
];

const getStoredAppointments = () => {
  try {
    const raw = localStorage.getItem(SRO_APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SRO_APPOINTMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_APPOINTMENT_REQUESTS));
      return DEFAULT_APPOINTMENT_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_APPOINTMENT_REQUESTS;
  }
};

const saveStoredAppointments = (data) => {
  try {
    localStorage.setItem(SRO_APPOINTMENTS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save appointments in localStorage:', err);
  }
};

const getStoredSlots = () => {
  try {
    const raw = localStorage.getItem(SRO_SLOTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SRO_SLOTS_STORAGE_KEY, JSON.stringify(DEFAULT_OFFICE_SLOTS));
      return DEFAULT_OFFICE_SLOTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_OFFICE_SLOTS;
  }
};

const saveStoredSlots = (slots) => {
  try {
    localStorage.setItem(SRO_SLOTS_STORAGE_KEY, JSON.stringify(slots));
  } catch (err) {
    console.warn('Failed to save slots in localStorage:', err);
  }
};

/**
 * Service to fetch and manage citizen service applications and SRO appointment scheduling
 */
export const applicationService = {
  getApplications: async (params = {}) => {
    try {
      const res = await apiClient.get('applications', params);
      const remoteItems = Array.isArray(res) ? res : res?.items || res?.data || [];
      if (remoteItems.length > 0) {
        return remoteItems;
      }
    } catch {
      // fallback to local appointment state
    }
    return getStoredAppointments();
  },

  getApplicationById: async (id) => {
    if (!id) return null;
    try {
      const res = await apiClient.get(`applications/${encodeURIComponent(id)}`);
      if (res) return res;
    } catch {
      // fallback
    }
    const all = getStoredAppointments();
    return all.find((a) => a.id === id || a.applicationNumber === id) || null;
  },

  getApplicationsByCitizen: async (citizenId) => {
    const all = getStoredAppointments();
    return all.filter((a) => !citizenId || a.citizenId === citizenId || citizenId === 'CITIZEN-001' || citizenId === 'citizen_ankush');
  },

  getApplicationTypes: async () => {
    try {
      return await apiClient.get('applications/types');
    } catch {
      return [
        { code: 'APPT_REGISTRATION', title: 'Property Registration Deed Execution', fee: 1000, sla_days: 7 },
        { code: 'APPT_VERIFICATION', title: 'Document & Title Deed Verification', fee: 200, sla_days: 3 },
        { code: 'APPT_ROR_EXTRACT', title: 'Certified Digitally Signed 7/12 RoR Extract', fee: 50, sla_days: 3 },
      ];
    }
  },

  createApplication: async (payload) => {
    try {
      return await apiClient.post('applications', payload);
    } catch {
      const all = getStoredAppointments();
      const newApp = {
        id: `APP-${Date.now().toString().slice(-4)}`,
        applicationNumber: `APP-${Date.now().toString().slice(-4)}`,
        citizenId: payload.citizenId || 'CITIZEN-001',
        citizenName: payload.citizenName || 'Ankush Vishwakarma',
        parcelId: payload.parcelId || payload.parcelUlpin || 'MH-PUN-1025',
        surveyNumber: payload.surveyNumber || 'Gat 42/1',
        serviceType: payload.serviceType || 'Property Registration',
        serviceCategory: payload.serviceCategory || 'Statutory Registration',
        sroOffice: payload.sroOffice || 'Sub-Registrar Office Haveli No 5, Pune',
        status: 'PENDING_SCHEDULING',
        submissionDate: new Date().toISOString(),
        requiredDocs: [
          'Identity Proof (Aadhaar / PAN)',
          'Original Document Draft',
          '7/12 RoR Extract',
          'Chalan Payment Receipt',
        ],
        appointment: null,
      };
      all.unshift(newApp);
      saveStoredAppointments(all);
      return newApp;
    }
  },

  // ─── SRO APPOINTMENT SCHEDULING METHODS ────────────────────────────────────

  getAppointmentRequests: async () => {
    const all = getStoredAppointments();
    return all.filter((app) => app.status === 'PENDING_SCHEDULING' || !app.appointment);
  },

  getAppointments: async (filter = 'ALL') => {
    const all = getStoredAppointments();
    const scheduledOnly = all.filter((app) => app.appointment && app.status !== 'PENDING_SCHEDULING');
    if (filter === 'ALL') return scheduledOnly;
    if (filter === 'SCHEDULED') return scheduledOnly.filter((a) => a.appointment?.status === 'Scheduled');
    if (filter === 'RESCHEDULED') return scheduledOnly.filter((a) => a.appointment?.status === 'Rescheduled');
    if (filter === 'COMPLETED') return scheduledOnly.filter((a) => a.appointment?.status === 'Completed');
    if (filter === 'CANCELLED') return scheduledOnly.filter((a) => a.appointment?.status === 'Cancelled');
    if (filter === 'TODAY') {
      const todayStr = '2026-10-05'; // prototype target date or current date
      return scheduledOnly.filter((a) => a.appointment?.date === todayStr || a.appointment?.date === new Date().toISOString().split('T')[0]);
    }
    return scheduledOnly;
  },

  scheduleAppointment: async ({
    applicationId,
    citizenName,
    citizenId,
    parcelId,
    serviceType,
    sroOffice,
    appointmentDate,
    timeSlot,
    instructions,
    status = 'Scheduled',
  }) => {
    const all = getStoredAppointments();
    const noticeId = `SRO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    let targetApp = all.find((a) => a.id === applicationId || a.applicationNumber === applicationId);
    if (!targetApp) {
      targetApp = {
        id: applicationId || `APP-${Date.now().toString().slice(-4)}`,
        applicationNumber: applicationId || `APP-${Date.now().toString().slice(-4)}`,
        citizenName: citizenName || 'Citizen Applicant',
        citizenId: citizenId || 'CITIZEN-001',
        parcelId: parcelId || 'MH-PUN-1025',
        serviceType: serviceType || 'Property Registration',
        sroOffice: sroOffice || 'Sub-Registrar Office Haveli No 5, Pune',
      };
      all.unshift(targetApp);
    }

    targetApp.status = status.toUpperCase();
    targetApp.appointment = {
      noticeId,
      date: appointmentDate,
      timeSlot,
      sroOffice: sroOffice || targetApp.sroOffice || 'Sub-Registrar Office Haveli No 5, Pune',
      status,
      issuedBy: sroOffice || 'Sub-Registrar Office Haveli No 5, Pune',
      scheduledAt: now,
      instructions: instructions || 'Please bring all original documents, 2 witnesses with Aadhaar cards, and fee receipt.',
    };

    saveStoredAppointments(all);

    // Update slot booking count
    const slots = getStoredSlots();
    const matchedSlot = slots.find((s) => s.slot === timeSlot || s.time.includes(timeSlot));
    if (matchedSlot && matchedSlot.booked < matchedSlot.capacity) {
      matchedSlot.booked += 1;
      saveStoredSlots(slots);
    }

    // Trigger citizen notification
    notificationService.addNotification({
      userId: targetApp.citizenId || citizenId || 'CITIZEN-001',
      title: 'BHARATBHUMI — SRO APPOINTMENT NOTICE',
      message: `Your appointment for ${targetApp.serviceType || serviceType} (${targetApp.id}) has been assigned for ${appointmentDate} at ${timeSlot} at ${targetApp.appointment.sroOffice}. Notice ID: ${noticeId}.`,
      type: 'DOCUMENT',
      subType: 'APPOINTMENT_NOTICE',
      parcelId: targetApp.parcelId || parcelId,
      applicationId: targetApp.id,
      noticeId,
      appointment: targetApp.appointment,
    });

    return targetApp;
  },

  rescheduleAppointment: async (applicationId, { appointmentDate, timeSlot, instructions, reason }) => {
    const all = getStoredAppointments();
    const targetApp = all.find((a) => a.id === applicationId || a.applicationNumber === applicationId);
    if (!targetApp || !targetApp.appointment) {
      throw new Error('Appointment not found');
    }

    targetApp.appointment.date = appointmentDate;
    targetApp.appointment.timeSlot = timeSlot;
    targetApp.appointment.status = 'Rescheduled';
    targetApp.appointment.rescheduleReason = reason;
    targetApp.appointment.instructions = instructions || targetApp.appointment.instructions;
    targetApp.appointment.updatedAt = new Date().toISOString();
    targetApp.status = 'RESCHEDULED';

    saveStoredAppointments(all);

    notificationService.addNotification({
      userId: targetApp.citizenId || 'CITIZEN-001',
      title: 'SRO Appointment Rescheduled',
      message: `Your appointment for ${targetApp.serviceType} (${targetApp.id}) has been rescheduled to ${appointmentDate} at ${timeSlot}. Reason: ${reason || 'Officer capacity adjustment'}.`,
      type: 'DOCUMENT',
      subType: 'APPOINTMENT_RESCHEDULED',
      parcelId: targetApp.parcelId,
      applicationId: targetApp.id,
      noticeId: targetApp.appointment.noticeId,
      appointment: targetApp.appointment,
    });

    return targetApp;
  },

  cancelAppointment: async (applicationId, { reason }) => {
    const all = getStoredAppointments();
    const targetApp = all.find((a) => a.id === applicationId || a.applicationNumber === applicationId);
    if (!targetApp || !targetApp.appointment) {
      throw new Error('Appointment not found');
    }

    targetApp.appointment.status = 'Cancelled';
    targetApp.appointment.cancellationReason = reason || 'Cancelled by SRO Officer';
    targetApp.appointment.updatedAt = new Date().toISOString();
    targetApp.status = 'CANCELLED';

    saveStoredAppointments(all);

    notificationService.addNotification({
      userId: targetApp.citizenId || 'CITIZEN-001',
      title: 'SRO Appointment Cancelled',
      message: `Your appointment for ${targetApp.serviceType} (${targetApp.id}) on ${targetApp.appointment.date} has been cancelled. Reason: ${reason || 'Officer operational update'}.`,
      type: 'SECURITY',
      subType: 'APPOINTMENT_CANCELLED',
      parcelId: targetApp.parcelId,
      applicationId: targetApp.id,
      noticeId: targetApp.appointment.noticeId,
    });

    return targetApp;
  },

  markAppointmentCompleted: async (applicationId) => {
    const all = getStoredAppointments();
    const targetApp = all.find((a) => a.id === applicationId || a.applicationNumber === applicationId);
    if (!targetApp || !targetApp.appointment) {
      throw new Error('Appointment not found');
    }

    targetApp.appointment.status = 'Completed';
    targetApp.appointment.completedAt = new Date().toISOString();
    targetApp.status = 'COMPLETED';

    saveStoredAppointments(all);

    notificationService.addNotification({
      userId: targetApp.citizenId || 'CITIZEN-001',
      title: 'SRO Deed Verification Completed',
      message: `Your appointment and document verification for ${targetApp.serviceType} (${targetApp.id}) has been successfully completed.`,
      type: 'DOCUMENT',
      subType: 'APPOINTMENT_COMPLETED',
      parcelId: targetApp.parcelId,
      applicationId: targetApp.id,
    });

    return targetApp;
  },

  getAvailableSlots: async (date, office) => {
    return getStoredSlots();
  },

  updateSlotCapacity: async (slotTime, newCapacity) => {
    const slots = getStoredSlots();
    const target = slots.find((s) => s.slot === slotTime || s.time === slotTime);
    if (target) {
      target.capacity = Math.max(0, parseInt(newCapacity, 10));
      saveStoredSlots(slots);
    }
    return slots;
  },

  getCitizenAppointmentNotice: async (citizenId) => {
    const all = getStoredAppointments();
    // Return the active scheduled appointment notice for the citizen
    const active = all.find(
      (a) =>
        a.appointment &&
        (a.citizenId === citizenId || !citizenId || citizenId === 'CITIZEN-001' || citizenId === 'citizen_ankush' || citizenId === 'Ankush Vishwakarma')
    );
    return active || all[0];
  },
};

export default applicationService;
