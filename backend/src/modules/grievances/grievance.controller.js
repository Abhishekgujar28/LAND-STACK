import { grievanceService } from './grievance.service.js';

export const grievanceController = {
  getGrievances: async (req, res, next) => {
    try {
      const { citizenId, status } = req.query;
      const list = await grievanceService.getGrievances({ citizenId, status }, req.user, req.supabase);
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      next(err);
    }
  },

  getGrievanceById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await grievanceService.getGrievanceById(id, req.user, req.supabase);
      if (!item) {
        return res.status(404).json({ success: false, error: { message: `Grievance '${id}' not found` } });
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  createGrievance: async (req, res, next) => {
    try {
      const item = await grievanceService.createGrievance(req.body, req.user, req.supabase);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },
};
