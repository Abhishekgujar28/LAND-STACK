import { applicationService } from '../services/applicationService.js';

export const applicationController = {
  getApplications: async (req, res, next) => {
    try {
      const { citizenId, status } = req.query;
      const apps = await applicationService.getApplications({ citizenId, status });
      res.json({ success: true, count: apps.length, data: apps });
    } catch (err) {
      next(err);
    }
  },

  getApplicationById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const app = await applicationService.getApplicationById(id);
      if (!app) {
        return res.status(404).json({ success: false, error: { message: `Application '${id}' not found` } });
      }
      res.json({ success: true, data: app });
    } catch (err) {
      next(err);
    }
  },

  getApplicationTypes: async (req, res, next) => {
    try {
      const types = await applicationService.getApplicationTypes();
      res.json({ success: true, data: types });
    } catch (err) {
      next(err);
    }
  },

  createApplication: async (req, res, next) => {
    try {
      const app = await applicationService.createApplication(req.body);
      res.status(201).json({ success: true, data: app });
    } catch (err) {
      next(err);
    }
  },
};
