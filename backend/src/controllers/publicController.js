import { publicService } from '../services/publicService.js';

export const publicController = {
  getServices: async (req, res, next) => {
    try {
      const data = await publicService.getServices();
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  },

  getNews: async (req, res, next) => {
    try {
      const data = await publicService.getNews();
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  },

  getNotices: async (req, res, next) => {
    try {
      const data = await publicService.getNotices();
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  },

  getJurisdictions: async (req, res, next) => {
    try {
      const data = await publicService.getJurisdictions();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
