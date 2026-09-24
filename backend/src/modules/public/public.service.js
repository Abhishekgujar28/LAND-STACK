import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';

export const publicService = {
  getServices: async (client) => {
    const db = client || getSupabaseAnon();
    if (!db) return [];

    const { data, error } = await db
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

  getNews: async (client) => {
    const db = client || getSupabaseAnon();
    if (!db) return [];

    const { data, error } = await db
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

  getNotices: async (client) => {
    const db = client || getSupabaseAnon();
    if (!db) return [];

    const { data, error } = await db
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

  getJurisdictions: async (client) => {
    const db = client || getSupabaseAnon();
    if (!db) return { states: [], districts: [], tehsils: [], villages: [] };

    const [
      { data: states },
      { data: districts },
      { data: tehsils },
      { data: villages },
    ] = await Promise.all([
      db.from('states').select('*'),
      db.from('districts').select('*'),
      db.from('tehsils').select('*'),
      db.from('villages').select('*'),
    ]);

    return {
      states: states || [],
      districts: districts || [],
      tehsils: tehsils || [],
      villages: villages || [],
    };
  },
};
