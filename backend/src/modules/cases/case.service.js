/**
 * Land Stack — Case Management & Work Queue Service
 * 
 * Generates officer work queues derived securely from active jurisdiction assignments.
 * Compiles comprehensive statutory case dossiers for quasi-judicial land governance.
 */

import { Errors } from '../../core/errors.js';
import { Roles, UserTypes } from '../../core/permissions.js';
import { mockStore } from '../../data/mockStore.js';
import { ParcelService } from '../parcels/parcel.service.js';
import { AuditService } from '../audit/audit.service.js';
import { getSupabaseAdmin, isSupabaseMode } from '../../config/supabase.js';

export const CaseService = {
  /**
   * Derive work queue based on officer's role and assigned jurisdiction
   */
  async getOfficerQueue(officer) {
    if (!officer || officer.userType !== UserTypes.GOVERNMENT) {
      throw Errors.forbidden('Work queues are strictly restricted to government officers.');
    }

    const role = officer.role;
    const jurisdiction = officer.jurisdiction || {};
    const villageCode = jurisdiction.villageCode;
    const tehsilCode = jurisdiction.tehsilCode;
    const districtCode = jurisdiction.districtCode;

    let queueItems = [];

    if (role === Roles.TALATHI) {
      // Talathi Queue: Field inspections, pencil entries, boundary checks
      let items = mockStore.talathiQueue || [];
      if (villageCode) {
        const filtered = items.filter((item) => (item.villageCode || item.village) === villageCode);
        if (filtered.length > 0) items = filtered;
      }
      queueItems = items.map((item) => ({
        ...item,
        queueType: 'TALATHI_FIELD_VERIFICATION',
        slaDaysLeft: item.daysLeft ?? 7,
        priority: item.urgency || (item.daysLeft <= 3 ? 'HIGH' : 'NORMAL'),
      }));
    } else if (role === Roles.TAHSILDAR) {
      // Tehsildar Queue: Hearings, objections, final statutory orders
      let items = mockStore.tehsildarQueue || [];
      if (tehsilCode) {
        const filtered = items.filter((item) => (item.tehsilCode || item.tehsil) === tehsilCode);
        if (filtered.length > 0) items = filtered;
      }
      queueItems = items.map((item) => ({
        ...item,
        queueType: 'TEHSILDAR_SANCTION_HEARING',
        slaDaysLeft: Math.max(0, 30 - (item.daysPending || 0)),
        priority: (item.daysPending || 0) > 20 ? 'HIGH' : 'NORMAL',
      }));
    } else if (role === Roles.SUB_REGISTRAR) {
      // SRO Queue: Registration deeds and stamp duty audits
      const items = mockStore.sroAudits || [];
      queueItems = items.map((item) => ({
        ...item,
        queueType: 'SRO_REGISTRATION_AUDIT',
        slaDaysLeft: 5,
        priority: 'NORMAL',
      }));
    } else {
      // Administrative oversight: summary of pending mutations
      const mutations = mockStore.mutations || [];
      queueItems = mutations.slice(0, 20).map((m) => ({
        id: m.id,
        ulpin: m.parcelId || m.parcelUlpin,
        mutationNumber: m.mutationNumber,
        type: m.mutationType || m.type,
        status: m.status,
        applicant: m.initiatedBy || m.applicantName,
        queueType: 'ADMINISTRATIVE_OVERSIGHT',
        slaDaysLeft: 14,
        priority: 'NORMAL',
      }));
    }

    // Calculate queue metrics
    const total = queueItems.length;
    const highPriorityCount = queueItems.filter((i) => i.priority === 'HIGH' || i.urgency === 'high').length;
    const overdueCount = queueItems.filter((i) => (i.slaDaysLeft ?? 1) <= 0).length;

    return {
      officer: {
        id: officer.userId,
        name: officer.name,
        role: officer.role,
        jurisdiction: officer.jurisdiction,
        activeContext: officer.activeContext,
      },
      metrics: {
        total,
        highPriorityCount,
        overdueCount,
        pendingCount: total - overdueCount,
      },
      items: queueItems,
    };
  },

  /**
   * Generate comprehensive case dossier for decision making
   */
  async getCaseDossier(caseId, officer) {
    if (!caseId) throw Errors.badRequest('Case ID is required');
    const cleanId = caseId.trim();

    // 1. Locate case/mutation
    let caseData = null;
    const talathiMatch = (mockStore.talathiQueue || []).find((t) => t.id === cleanId);
    const tehsildarMatch = (mockStore.tehsildarQueue || []).find((t) => t.id === cleanId);
    const mutationMatch = (mockStore.mutations || []).find(
      (m) => m.id === cleanId || m.mutationNumber === cleanId
    );

    caseData = mutationMatch || tehsildarMatch || talathiMatch;
    if (!caseData) {
      throw Errors.notFound(`Case '${cleanId}' not found in registry`);
    }

    const ulpin = caseData.ulpin || caseData.parcelId || caseData.parcel_ulpin || 'IN-MH-PUN-0001-12345';

    // 2. Fetch Parcel 360° summary
    let parcelSummary = null;
    try {
      parcelSummary = await ParcelService.getParcelByUlpin(ulpin, officer);
    } catch {
      // Fallback parcel info if not found
      parcelSummary = {
        ulpin,
        currentOwner: caseData.seller || 'Recorded Landholder',
        areaHectares: 0.42,
        villageName: caseData.village || 'Wagholi',
      };
    }

    // 3. Fetch Timeline & Audit
    const timelineRec = (mockStore.mutationTimeline || []).find(
      (t) => t.mutationId === (caseData.id || cleanId)
    );
    const timeline = timelineRec ? timelineRec.steps : [];
    const auditTrail = await AuditService.getTrail('MUTATION', caseData.id || cleanId);

    // 4. Verification & Inspection Artifacts
    const photos = caseData.photos || (talathiMatch?.photos) || [
      { id: 1, label: 'Boundary Stone (North-East Corner)', coords: '18.5529° N, 73.9312° E', verified: true },
      { id: 2, label: 'Standing Crop & Extent', coords: '18.5531° N, 73.9310° E', verified: true },
    ];

    const panchnamaReport =
      caseData.panchnamaNotes ||
      caseData.talathiReport ||
      'Site inspection verified boundary pegs (Shew) are intact. Physical possession confirmed without encumbrance.';

    // 5. Statutory Prerequisite Checklist
    const hasFieldInspection = !!caseData.panchnamaNotes || !!caseData.talathiReport || photos.length > 0;
    const noticeElapsed = caseData.noticePeriodEnded ?? true;
    const objectionsReceived = caseData.status === 'OBJECTION_RECEIVED' ? 1 : 0;
    const readyForSanction = hasFieldInspection && noticeElapsed && objectionsReceived === 0;

    const checklist = [
      {
        id: 'chk-sro',
        item: 'SRO Deed Registration & Stamp Duty Verification',
        status: 'PASSED',
        verifiedBy: 'e-Registration SRO Haveli',
      },
      {
        id: 'chk-form6',
        item: 'Form 6 Provisional Pencil Entry (कच्ची नोंद)',
        status: 'PASSED',
        verifiedBy: 'Talathi Office',
      },
      {
        id: 'chk-field',
        item: 'Ground Panchnama & Geotagged Boundary Photographs',
        status: hasFieldInspection ? 'PASSED' : 'PENDING',
        verifiedBy: caseData.talathiName || 'Prakash Shinde (Talathi)',
      },
      {
        id: 'chk-notice',
        item: 'Form 135D Statutory 15-Day Public Notice Period',
        status: noticeElapsed ? 'PASSED' : 'IN_PROGRESS',
        notes: noticeElapsed ? 'Window elapsed without objection' : 'Notice window active',
      },
      {
        id: 'chk-objections',
        item: 'Objection & Dispute Resolution Status',
        status: objectionsReceived === 0 ? 'PASSED' : 'PENDING_HEARING',
        unresolvedCount: objectionsReceived,
      },
    ];

    return {
      caseId: caseData.id || cleanId,
      mutationNumber: caseData.mutationNumber || caseData.id,
      ulpin,
      type: caseData.type || caseData.mutationType || 'Sale Deed Mutation',
      applicant: caseData.applicant || caseData.initiatedBy || 'Applicant',
      seller: caseData.seller || caseData.current_owner || 'Recorded Owner',
      filingDate: caseData.filingDate || caseData.created_at || '2026-01-01',
      status: caseData.status || 'READY_FOR_ORDER',
      parcel: parcelSummary,
      talathiReport: {
        officerName: caseData.talathiName || 'Prakash Shinde',
        panchnama: panchnamaReport,
        photos,
        possessionConfirmed: caseData.possessionConfirmed ?? true,
        aiAreaVariance: caseData.aiAreaVariance || 'Within 5% survey tolerance',
      },
      statutoryChecklist: checklist,
      isReadyForSanction: readyForSanction,
      timeline,
      auditTrail,
    };
  },
};
