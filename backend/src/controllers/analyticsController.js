import { analyticsService } from '../services/analyticsService.js';

export const analyticsController = {
  getNational: async (req, res, next) => {
    try {
      const data = await analyticsService.getNationalData();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getNationalBenchmarks: async (req, res, next) => {
    try {
      const data = await analyticsService.getNationalBenchmarks();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getState: async (req, res, next) => {
    try {
      const { stateCode } = req.params;
      const data = await analyticsService.getStateData(stateCode);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getStatePMU: async (req, res, next) => {
    try {
      const { stateCode } = req.params;
      const data = await analyticsService.getStatePMUData(stateCode);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getDistrict: async (req, res, next) => {
    try {
      const { districtCode } = req.params;
      const data = await analyticsService.getDistrictData(districtCode);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getTehsil: async (req, res, next) => {
    try {
      const { tehsilCode } = req.params;
      const data = await analyticsService.getTehsilData(tehsilCode);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getSystemHealth: async (req, res, next) => {
    try {
      const data = await analyticsService.getSystemHealth();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
