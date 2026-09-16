import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';

export const grievanceService = {
  getGrievances: async ({ citizenId, status } = {}, actor, client) => {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) return [];

    let query = db.from('grievances').select('*');
    const targetCitizenId = citizenId || (actor?.userType === 'CITIZEN' ? actor?.userId : null);
    if (targetCitizenId) query = query.eq('citizen_id', targetCitizenId);
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order('filed_date', { ascending: false });
    if (error) {
      console.error('[GrievanceService] Query error:', error.message);
      return [];
    }

    return (data || []).map((g) => ({
      ...g,
      citizenId: g.citizen_id,
      parcelId: g.parcel_ulpin,
      grievanceNumber: g.grievance_number,
      filedDate: g.filed_date,
      departmentCode: g.department_code,
      resolutionNotes: g.resolution_notes,
      resolvedAt: g.resolved_at,
    }));
  },

  getGrievanceById: async (id, actor, client) => {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    if (!db) return null;

    const { data, error } = await db
      .from('grievances')
      .select('*')
      .or(`id.eq.${id},grievance_number.eq.${id}`)
      .maybeSingle();

    if (error || !data) return null;

    return {
      ...data,
      citizenId: data.citizen_id,
      parcelId: data.parcel_ulpin,
      grievanceNumber: data.grievance_number,
      filedDate: data.filed_date,
      departmentCode: data.department_code,
      resolutionNotes: data.resolution_notes,
      resolvedAt: data.resolved_at,
    };
  },

  createGrievance: async (payload, actor, client) => {
    const db = getSupabaseAdmin() || client || getSupabaseAnon();
    const newId = `GRV-${Date.now()}`;
    const grievanceNumber = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const citizenId = payload.citizenId || actor?.userId || 'CITIZEN';

    const record = {
      id: newId,
      grievance_number: grievanceNumber,
      citizen_id: citizenId,
      parcel_ulpin: payload.parcelId || payload.parcelUlpin || null,
      category: payload.category || 'Revenue Records',
      subject: payload.subject,
      description: payload.description,
      status: 'OPEN',
      filed_date: now,
      department_code: payload.departmentCode || 'DEPT-REV',
    };

    if (db) {
      const { data, error } = await db.from('grievances').insert(record).select().maybeSingle();
      if (error) {
        console.error('[GrievanceService] Insert error:', error.message);
      }
      if (data) {
        return {
          ...data,
          citizenId: data.citizen_id,
          parcelId: data.parcel_ulpin,
          grievanceNumber: data.grievance_number,
          filedDate: data.filed_date,
          departmentCode: data.department_code,
          resolutionNotes: data.resolution_notes,
          resolvedAt: data.resolved_at,
        };
      }
    }

    return {
      ...record,
      citizenId: record.citizen_id,
      parcelId: record.parcel_ulpin,
      grievanceNumber: record.grievance_number,
      filedDate: record.filed_date,
    };
  },
};

export default grievanceService;
