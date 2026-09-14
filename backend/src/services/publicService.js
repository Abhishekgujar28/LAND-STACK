import { getSupabaseAdmin } from '../config/supabase.js';

export const publicService = {
  getServices: async () => {
    const admin = getSupabaseAdmin();
    if (!admin) return [];

    const { data, error } = await admin
      .from('government_services')
      .select('*')
      .order('id');

    if (error) {
      console.error('[PublicService] Services error:', error.message);
      return [];
    }

    return (data || []).map((s) => ({
      ...s,
      processingTime: s.processing_time,
    }));
  },

  getNews: async () => {
    const admin = getSupabaseAdmin();
    if (!admin) return [];

    const { data, error } = await admin
      .from('news')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) {
      console.error('[PublicService] News error:', error.message);
      return [];
    }

    return (data || []).map((n) => ({
      ...n,
      publishedDate: n.published_date,
    }));
  },

  getNotices: async () => {
    const admin = getSupabaseAdmin();
    if (!admin) return [];

    const { data, error } = await admin
      .from('notices')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('[PublicService] Notices error:', error.message);
      return [];
    }

    return (data || []).map((n) => ({
      ...n,
      noticeNumber: n.notice_number,
      issueDate: n.issue_date,
      expiryDate: n.expiry_date,
    }));
  },

  getJurisdictions: async () => {
    const admin = getSupabaseAdmin();
    if (!admin) return { states: [], districts: [], tehsils: [], villages: [] };

    const [
      { data: states },
      { data: districts },
      { data: tehsils },
      { data: villages },
    ] = await Promise.all([
      admin.from('states').select('*'),
      admin.from('districts').select('*'),
      admin.from('tehsils').select('*'),
      admin.from('villages').select('*'),
    ]);

    return {
      states: states || [],
      districts: districts || [],
      tehsils: tehsils || [],
      villages: villages || [],
    };
  },
};
